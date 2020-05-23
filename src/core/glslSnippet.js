require('codemirror/mode/css/css');
require('codemirror/mode/clike/clike.js');
const CodeMirror = require('codemirror');

class Snippet {
    constructor(element, code) {
        this.element = element;

        this.editorElement = document.createElement('div');
        this.editorElement.style.width = "100%";
        this.editorElement.style.height = "400px";
        this.element.appendChild(this.editorElement);
        this.editor = CodeMirror(this.editorElement, {
            lineNumbers: true,
            theme: "base16-light",
            mode: 'x-shader/x-fragment'
        });
        this.editor.setValue(code.trim());
    }
}

module.exports = Snippet;