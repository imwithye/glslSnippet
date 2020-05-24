const twgl = require('twgl.js/dist/4.x/twgl-full');

const VertBuffer = { pos: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0] };
const VertCode = `
attribute vec4 pos;
void main() { 
    gl_Position = pos;
}`
const FragCode = `
precision mediump float;
void main() {
    gl_FragColor = vec4(1, 0, 1, 1);
}`
const FragCodeHeader = `
precision mediump float;

`
const FragCodeFooter = `

void main() {
    gl_FragColor = FragColor();
}
`;

class Canvas {
    constructor(container) {
        this.element = document.createElement('canvas');
        this.element.classList.add('glslSnippet-canvas');
        container.appendChild(this.element);

        this.render = true;
        this.gl = this.element.getContext("webgl");
        this.programInfo = twgl.createProgramInfo(this.gl, [VertCode, FragCode]);
        this.errorProgramInfo = twgl.createProgramInfo(this.gl, [VertCode, FragCode]);
        this.bufferInfo = twgl.createBufferInfoFromArrays(this.gl, VertBuffer);
    }

    setFragmentCode(fragCode) {
        fragCode = `${FragCodeHeader}${fragCode}${FragCodeFooter}`;
        this.programInfo = twgl.createProgramInfo(this.gl, [VertCode, fragCode]);
    }

    setTop(height) {
        this.element.style.top = height < 0 ? '0px' : `${height}px`;
    }

    draw(time) {
        if (!this.render) {
            return;
        }
        try {
            this.gl.viewport(0, 0, this.element.width, this.element.height);
            this.gl.clearColor(0, 0, 0, 1);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT);
            const programInfo = this.programInfo == null ? this.errorProgramInfo : this.programInfo;
            this.gl.useProgram(programInfo.program);
            twgl.setBuffersAndAttributes(this.gl, programInfo, this.bufferInfo);
            twgl.drawBufferInfo(this.gl, this.bufferInfo);
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = { Canvas };