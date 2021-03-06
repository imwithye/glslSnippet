const ace = require('ace-builds/src-min-noconflict/ace');
require('ace-builds/src-min-noconflict/mode-glsl');
require('ace-builds/src-min-noconflict/theme-eclipse');

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

  setErrors(errors) {
    const rowLength = this.editor.getSession().getLength();
    this.editor.getSession().setAnnotations(
      errors.map((e) => {
        let row = e.lineno;
        if (row > rowLength) row = rowLength - 1;
        return {
          row: row,
          column: 0,
          text: e.errMsg,
          type: 'error',
        };
      })
    );
  }

  clearErrors() {
    this.editor.getSession().clearAnnotations();
  }
}

module.exports = { Editor };
