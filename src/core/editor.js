const ace = require('brace');
require('brace/mode/glsl');
require('brace/theme/chrome');

class Editor {
    constructor(container, code, options) {
        this.section = document.createElement("div");
        this.section.classList.add("glslSnippet-section");
        container.appendChild(this.section);

        const title = document.createElement("div");
        this.section.classList.add("glslSnippet-title");
        title.innerHTML = "Shader";
        this.section.appendChild(title);

        this.element = document.createElement('div');
        this.element.classList.add("glslSnippet-editor");
        this.section.appendChild(this.element);

        this.editor = ace.edit(this.element);
        this.editor.getSession().setMode('ace/mode/glsl');
        this.editor.setTheme('ace/theme/chrome');
        this.editor.setFontSize("1rem");
        this.editor.setOptions({
            autoScrollEditorIntoView: true,
            maxLines: 32
        });
        this.setValue(`${code.trim()}\n`);
    }

    on(eventName, handler) {
        this.editor.on(eventName, handler)
    }

    getValue() {
        return this.editor.session.getValue();
    }

    setValue(content) {
        this.editor.setValue(content, 1);
    }
}

module.exports = { Editor };