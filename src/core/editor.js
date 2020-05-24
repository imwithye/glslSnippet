const ace = require('brace');
require('brace/mode/glsl');
require('brace/theme/eclipse');

class Editor {
  constructor(container, code, options) {
    this.element = document.createElement('div');
    this.element.classList.add('glslSnippet-editor');
    container.appendChild(this.element);

    this.editor = ace.edit(this.element);
    this.editor.getSession().setMode('ace/mode/glsl');
    this.editor.setTheme('ace/theme/eclipse');
    this.editor.setFontSize('0.8rem');
    this.editor.setShowPrintMargin(false);
    this.editor.setHighlightActiveLine(false);
    this.editor.getSession().setUseWrapMode(true);
    this.editor.getSession().setTabSize(4);
    this.editor.getSession().setUseSoftTabs(true);
    this.editor.setOptions({
      cursorStyle: 'slim',
      autoScrollEditorIntoView: true,
      maxLines: 32,
    });

    this.setValue(`${code.trim()}\n`);
  }

  on(eventName, handler) {
    this.editor.on(eventName, handler);
  }

  getValue() {
    return this.editor.session.getValue();
  }

  setValue(content) {
    this.editor.setValue(content, 1);
  }
}

module.exports = { Editor };
