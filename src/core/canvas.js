const { Control } = require('./control');
const twgl = require('twgl.js/dist/4.x/twgl-full');

const VertBuffer = {
  pos: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
};
const VertCode = `
#version 300 es

layout(location = 0) in vec4 pos;

void main() { 
    gl_Position = pos;
}`;
const FragCodeError = `
#version 300 es

precision highp float;

out vec4 FragColor;

void main() {
  FragColor = vec4(1, 0, 1, 1);
}
`;
const FragCodeHeader = `
#version 300 es

precision highp float;

uniform vec2 iResolution;
uniform float iTime;
uniform float iTimeDelta;
uniform float iFrame;
uniform vec4 iMouse;

out vec4 FragColor;

`;
const FragCodeFooter = `

void main() {
    mainImage(FragColor, gl_FragCoord.xy);
}
`;

class Canvas {
  constructor(container, code) {
    this.element = document.createElement('div');
    this.element.classList.add('glslSnippet-canvas');
    container.appendChild(this.element);

    this.canvas = document.createElement('canvas');
    this.canvas.addEventListener('mousemove', this.mousemove.bind(this));
    this.element.appendChild(this.canvas);

    this.control = new Control(this.element);
    this.control.on('rewind', this.rewind.bind(this));
    this.control.on('play', this.play.bind(this));
    this.control.on('pause', this.pause.bind(this));

    this.render = true;
    this.time = 0;
    this.frame = 0;
    this.mousePosition = { x: 0, y: 0 };
    this.gl = this.canvas.getContext('webgl2');
    this.programInfoError = twgl.createProgramInfo(this.gl, [
      VertCode,
      FragCodeError,
    ]);
    this.setFragmentCode(code);
    this.bufferInfo = twgl.createBufferInfoFromArrays(this.gl, VertBuffer);
  }

  mousemove(evt) {
    const rect = this.canvas.getBoundingClientRect();
    this.mousePosition = {
      x: evt.clientX - rect.left,
      y: this.canvas.clientHeight - evt.clientY + rect.top,
    };
  }

  rewind() {
    this.time = 0;
    this.frame = 0;
    this.drawToCanvas(0);
  }

  play() {
    this.render = true;
  }

  pause() {
    this.render = false;
  }

  setFragmentCode(fragCode) {
    fragCode = `${FragCodeHeader}${fragCode}${FragCodeFooter}`;
    let errMsgs = '';
    this.programInfo = twgl.createProgramInfo(
      this.gl,
      [VertCode, fragCode],
      [],
      (msg) => (errMsgs = msg)
    );
    if (this.programInfo != null) {
      return [];
    }
    try {
      const headerLines = FragCodeHeader.split('\n').length - 1;
      const errors = [];
      const errorStrs = errMsgs.match(/ERROR: \d+:\d+: .+/g);
      for (var i = 0; i < errorStrs.length; i++) {
        const digits = errorStrs[i].match(/\d+:\d+/g);
        if (digits.length < 1) continue;
        const lineno = digits[0].split(':')[1] - headerLines;
        const errMsg = errorStrs[i].replace(/ERROR: \d+:\d+: /g, '');
        errors.push({ lineno: lineno <= 1 ? 1 : lineno, errMsg: errMsg });
      }
      console.error(errMsgs);
      return errors;
    } catch {
      console.error(errMsgs);
      return [{ lineno: 0, errMsg: 'Unknown error, check your console.' }];
    }
  }

  draw(deltaTime) {
    if (!this.render) {
      this.control.setTime(this.time / 1000);
      this.control.setFPS(1000 / deltaTime);
      return;
    }
    try {
      this.drawToCanvas(deltaTime);
    } catch (e) {
      console.log(e);
    }
  }

  drawToCanvas(deltaTime) {
    this.time = this.time + deltaTime;
    this.control.setTime(this.time / 1000);
    this.control.setFPS(1000 / deltaTime);
    const uniforms = {
      iResolution: [this.gl.canvas.width, this.gl.canvas.height],
      iTime: this.time / 1000,
      iTimeDelta: deltaTime / 1000,
      iFrame: this.frame,
      iMouse: [this.mousePosition.x, this.mousePosition.y, 0, 0],
    };
    this.frame += 1;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(
      this.gl.COLOR_BUFFER_BIT |
        this.gl.DEPTH_BUFFER_BIT |
        this.gl.STENCIL_BUFFER_BIT
    );
    const programInfo =
      this.programInfo == null ? this.programInfoError : this.programInfo;
    this.gl.useProgram(programInfo.program);
    twgl.setUniforms(programInfo, uniforms);
    twgl.setBuffersAndAttributes(this.gl, programInfo, this.bufferInfo);
    twgl.drawBufferInfo(this.gl, this.bufferInfo);
  }
}

module.exports = { Canvas };
