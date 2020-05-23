require('codemirror/addon/search/search');
require('codemirror/addon/search/searchcursor');
require('codemirror/addon/comment/comment');
require('codemirror/addon/dialog/dialog');
require('codemirror/addon/edit/matchbrackets');
require('codemirror/addon/edit/closebrackets');
require('codemirror/addon/wrap/hardwrap');
require('codemirror/addon/fold/foldcode');
require('codemirror/addon/fold/foldgutter');
require('codemirror/addon/fold/indent-fold');
require('codemirror/addon/hint/show-hint');
require('codemirror/addon/hint/javascript-hint');
require('codemirror/addon/display/rulers');
require('codemirror/addon/display/panel');
require('codemirror/mode/clike/clike.js');
const CodeMirror = require('codemirror');
const twgl = require('twgl.js/dist/4.x/twgl-full');

const arrays = { pos: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0] };

class Snippet {
    constructor(element, code) {
        this.element = element;

        this.container = document.createElement('div');
        this.container.classList.add("glslSnippet-container");
        this.element.appendChild(this.container);

        this.editorElement = document.createElement('div');
        this.editorElement.classList.add("glslSnippet-editor");
        this.container.appendChild(this.editorElement);
        this.editor = CodeMirror(this.editorElement, {
            matchBrackets: true,
            autoCloseBrackets: true,
            showCursorWhenSelecting: true,
            viewportMargin: Infinity,
            lineNumbers: true,
            theme: "base16-light",
            mode: 'x-shader/x-fragment',
            dragDrop: false,
        });
        this.editor.setValue(code.trim());

        this.canvasElement = document.createElement('canvas');
        this.canvasElement.classList.add("glslSnippet-canvas");
        this.container.appendChild(this.canvasElement);

        this.editor.on('cursorActivity', (e) => {
            let height = e.heightAtLine(e.getCursor().line + 1, 'local') - this.canvasElement.clientHeight;
            this.canvasElement.style.top = height < 0 ? '0px' : `${height}px`;
        });

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