const twgl = require('twgl.js/dist/4.x/twgl-full');

const VertBuffer = {
  pos: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
};
const VertCode = `
attribute vec4 pos;
void main() { 
    gl_Position = pos;
}`;
const FragCodeHeader = `
precision mediump float;

uniform vec2 iResolution;
uniform float iTime;
uniform float iTimeDelta;
uniform float iFrame;

`;
const FragCodeFooter = `

void main() {
    vec4 fragColor = vec4(0, 0, 0, 1);
    vec2 fragCoord = gl_FragCoord.xy;
    mainImage(fragColor, fragCoord);
    gl_FragColor = fragColor;
}
`;

class Canvas {
  constructor(container, code) {
    this.element = document.createElement('canvas');
    this.element.classList.add('glslSnippet-canvas');
    container.appendChild(this.element);

    this.render = true;
    this.time = 0;
    this.frame = 0;
    this.gl = this.element.getContext('webgl');
    this.setFragmentCode(code);
    this.bufferInfo = twgl.createBufferInfoFromArrays(this.gl, VertBuffer);
  }

  setFragmentCode(fragCode) {
    fragCode = `${FragCodeHeader}${fragCode}${FragCodeFooter}`;
    const programInfo = twgl.createProgramInfo(this.gl, [VertCode, fragCode]);
    if (programInfo != null) {
      this.programInfo = programInfo;
    }
  }

  setTop(height) {
    this.element.style.top = height < 0 ? '0px' : `${height}px`;
  }

  draw(deltaTime) {
    if (!this.render) {
      return;
    }
    try {
      this.time = this.time + deltaTime;
      const uniforms = {
        iResolution: [this.gl.canvas.width, this.gl.canvas.height],
        iTime: this.time / 1000,
        iTimeDelta: deltaTime / 1000,
        iFrame: this.frame,
      };
      this.frame += 1;
      this.gl.viewport(0, 0, this.element.width, this.element.height);
      this.gl.clearColor(0, 0, 0, 1);
      this.gl.clear(
        this.gl.COLOR_BUFFER_BIT |
          this.gl.DEPTH_BUFFER_BIT |
          this.gl.STENCIL_BUFFER_BIT
      );
      this.gl.useProgram(this.programInfo.program);
      twgl.setUniforms(this.programInfo, uniforms);
      twgl.setBuffersAndAttributes(this.gl, this.programInfo, this.bufferInfo);
      twgl.drawBufferInfo(this.gl, this.bufferInfo);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = { Canvas };
