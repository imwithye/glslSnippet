require('codemirror/mode/css/css');
const CodeMirror = require('codemirror');

class Snippet {
    constructor(element, code) {
        this.element = element;

        this.editorElement = document.createElement('div');
        this.editorElement.style.width = "100%";
        this.editorElement.style.height = "400px";
        this.element.appendChild(this.editorElement);
        CodeMirror(this.editorElement, {});
    }
}

module.exports = Snippet;