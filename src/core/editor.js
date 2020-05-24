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

class Editor {
    constructor(container, code, options) {
        this.element = document.createElement('div');
        this.element.classList.add("glslSnippet-editor");
        container.appendChild(this.element);
        this.editor = CodeMirror(this.element, {
            matchBrackets: true,
            autoCloseBrackets: true,
            indentUnit: 4,
            indentWithTabs: false,
            showCursorWhenSelecting: true,
            viewportMargin: Infinity,
            tabSize: 4,
            lineNumbers: true,
            theme: "base16-light",
            mode: 'x-shader/x-fragment',
            dragDrop: false,
        });
        this.editor.setValue(code.trim());
    }

    on(eventName, handler) {
        this.editor.on(eventName, handler)
    }

    heightAtLine() {
        return this.editor.heightAtLine();
    }

    getCursor() {
        return this.editor.getCursor();
    }

    getValue() {
        return this.editor.getValue();
    }

    setValue(content) {
        this.editor.setValue(content);
    }
}

module.exports = { Editor };