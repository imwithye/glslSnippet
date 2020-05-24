const ace = require('brace');
require('brace/mode/glsl');
require('brace/theme/solarized_light');

class Editor {
    constructor(container, code, options) {
        this.element = document.createElement('div');
        this.element.classList.add("glslSnippet-editor");
        container.appendChild(this.element);
        this.editor = ace.edit(this.element);
        this.editor.getSession().setMode('ace/mode/glsl');
        this.editor.setTheme('ace/theme/solarized_light');
        this.editor.setFontSize("16px");
        this.editor.setOptions({
            autoScrollEditorIntoView: true,
            maxLines: 64
        });
        this.editor.renderer.setScrollMargin(10, 10, 10, 10);
        this.setValue(`${code.trim()}\n`);
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
        return this.editor.session.getValue();
    }

    setValue(content) {
        this.editor.setValue(content, 1);
    }
}

module.exports = { Editor };