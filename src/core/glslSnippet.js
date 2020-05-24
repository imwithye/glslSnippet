const { Editor } = require('./editor');
const { Canvas } = require('./canvas');
const { Control } = require('./control');

class Snippet {
  constructor(element, code) {
    this.element = element;
    this.editor = new Editor(this.element, code);
    this.canvas = new Canvas(this.element, code);

    this.editor.on('change', () => {
      this.canvas.setFragmentCode(this.editor.getValue());
    });

    this.time = 0;
    requestAnimationFrame(this.render.bind(this));
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
