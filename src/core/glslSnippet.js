const { Editor } = require('./editor');
const { Canvas } = require('./canvas');
const { debounce } = require('../util');

class Snippet {
  constructor(element, code) {
    this.element = element;
    this.editor = new Editor(this.element, code);
    this.canvas = new Canvas(this.element);
    this.setFragmentCode(code);

    this.editor.on(
      'change',
      debounce(() => this.setFragmentCode(this.editor.getValue()), 1000)
    );

    this.time = 0;
    requestAnimationFrame(this.render.bind(this));
  }

  setFragmentCode(code) {
    const errors = this.canvas.setFragmentCode(code);
    if (errors.length == 0) {
      this.editor.clearErrors();
      return;
    }
    this.editor.setErrors(errors);
  }

  render() {
    if (this.time == null || this.time <= 0) {
      this.time = performance.now();
      this.draw(0);
    } else {
      const t = performance.now();
      const deltaTime = t - this.time;
      this.time += deltaTime;
      this.draw(deltaTime);
    }
    requestAnimationFrame(this.render.bind(this));
  }

  draw(deltaTime) {
    this.canvas.draw(deltaTime);
  }
}

module.exports = Snippet;
