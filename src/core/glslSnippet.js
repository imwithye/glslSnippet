require('codemirror/mode/css/css');
require('codemirror/mode/clike/clike.js');
const CodeMirror = require('codemirror');
const twgl = require('twgl.js/dist/4.x/twgl-full');

const arrays = { pos: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0] };

class Snippet {
    constructor(element, code) {
        this.element = element;

        this.container = document.createElement('div');
        this.container.style.width = "100%";
        this.container.style.minHeight = "300px";
        this.container.style.position = "relative";
        this.element.appendChild(this.container);

        this.editorElement = document.createElement('div');
        this.editorElement.style.width = "100%";
        this.editorElement.style.height = "300px";
        this.container.appendChild(this.editorElement);
        this.editor = CodeMirror(this.editorElement, {
            lineNumbers: true,
            theme: "base16-light",
            mode: 'x-shader/x-fragment',
            dragDrop: false,
        });
        this.editor.setValue(code.trim());

        this.canvasElement = document.createElement('canvas');
        this.canvasElement.style.maxWidth = "250px";
        this.canvasElement.style.maxHeight = "250px";
        this.canvasElement.style.width = "250px";
        this.canvasElement.style.height = "250px";
        this.canvasElement.style.position = "absolute";
        this.canvasElement.style.top = "0";
        this.canvasElement.style.right = "0";
        this.container.appendChild(this.canvasElement);
        this.gl = this.canvasElement.getContext("webgl");
        this.vertCode = `
        attribute vec4 pos;
        
        void main() {
            gl_Position = pos;
        }`;
        this.fragCode = `
precision mediump float;

void main() {
  gl_FragColor = vec4(1, 0, 0, 1);
}`;
        this.programInfo = twgl.createProgramInfo(this.gl, [this.vertCode, this.fragCode]);
        this.bufferInfo = twgl.createBufferInfoFromArrays(this.gl, arrays);
        requestAnimationFrame(this.renderLoop.bind(this));
    }

    renderLoop(time) {
        twgl.resizeCanvasToDisplaySize(this.canvasElement);
        this.gl.viewport(0, 0, this.canvasElement.width, this.canvasElement.height);
        this.gl.clearColor(0, 0, 0, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT);
        this.gl.useProgram(this.programInfo.program);
        twgl.setBuffersAndAttributes(this.gl, this.programInfo, this.bufferInfo);
        twgl.drawBufferInfo(this.gl, this.bufferInfo);
        requestAnimationFrame(this.renderLoop.bind(this));
    }
}

module.exports = Snippet;