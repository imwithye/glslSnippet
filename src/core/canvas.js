const twgl = require('twgl.js/dist/4.x/twgl-full');
const ace = require('brace');
require('brace/mode/glsl');
require('brace/theme/chrome');

const VertBuffer = { pos: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0] };
const VertCode = `
attribute vec4 pos;
void main() { 
    gl_Position = pos;
}`
const FragCodeHeader = `
precision mediump float;

uniform vec2 iResolution;
uniform float iTime;

`
const FragCodeFooter = `

void main() {
    gl_FragColor = FragColor();
}
`;

class Canvas {
    constructor(container, code) {
        this.section = document.createElement("div");
        this.section.classList.add("glslSnippet-section");
        container.appendChild(this.section);

        const title = document.createElement("div");
        this.section.classList.add("glslSnippet-title");
        title.innerHTML = "Graph";
        this.section.appendChild(title);

        const div = document.createElement('div');
        div.classList.add('glslSnippet-canvas');
        this.section.appendChild(div);

        this.element = document.createElement('canvas');
        div.appendChild(this.element);

        this.errorMessage = document.createElement('div');
        this.errorMessage.style.display = "none";
        this.errorMessageEditor = ace.edit(this.errorMessage);
        this.errorMessageEditor.renderer.setShowGutter(false);
        this.errorMessageEditor.setShowPrintMargin(false);
        this.errorMessageEditor.setReadOnly(true);
        this.errorMessageEditor.getSession().setUseWrapMode(true);
        div.appendChild(this.errorMessage);

        this.render = true;
        this.gl = this.element.getContext("webgl");
        this.setFragmentCode(code);
        this.bufferInfo = twgl.createBufferInfoFromArrays(this.gl, VertBuffer);
    }

    setFragmentCode(fragCode) {
        fragCode = `${FragCodeHeader}${fragCode}${FragCodeFooter}`;
        var msg = ""
        const programInfo = twgl.createProgramInfo(this.gl, [VertCode, fragCode], [], (err) => msg = err);
        if (programInfo != null) {
            this.programInfo = programInfo;
            this.errorMessage.style.display = "none";
            return;
        }
        this.errorMessage.style.display = "block";
        this.errorMessageEditor.setValue(msg.trim(), -1);
    }

    setTop(height) {
        this.element.style.top = height < 0 ? '0px' : `${height}px`;
    }

    draw(time) {
        if (!this.render) {
            return;
        }
        try {
            const uniforms = {
                iResolution: [this.gl.canvas.width, this.gl.canvas.height],
                iTime: time * 0.001,
            };
            this.gl.viewport(0, 0, this.element.width, this.element.height);
            this.gl.clearColor(0, 0, 0, 1);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT);
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