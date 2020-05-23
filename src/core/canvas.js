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
    gl_FragColor = vec4(1, 0, 0, 1);
}`

class Canvas {
    constructor(container) {
        this.element = document.createElement('canvas');
        this.element.classList.add('glslSnippet-canvas');
        container.appendChild(this.element);

        this.render = true;
        this.gl = this.element.getContext("webgl");
        this.programInfo = twgl.createProgramInfo(this.gl, [VertCode, FragCode]);
        this.bufferInfo = twgl.createBufferInfoFromArrays(this.gl, VertBuffer);
    }

    setTop(height) {
        this.element.style.top = height < 0 ? '0px' : `${height}px`;
    }

    draw(time) {
        if (!this.render) {
            return;
        }
        this.gl.viewport(0, 0, this.element.width, this.element.height);
        this.gl.clearColor(0, 0, 0, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT);
        this.gl.useProgram(this.programInfo.program);
        twgl.setBuffersAndAttributes(this.gl, this.programInfo, this.bufferInfo);
        twgl.drawBufferInfo(this.gl, this.bufferInfo);
    }
}

module.exports = { Canvas };
