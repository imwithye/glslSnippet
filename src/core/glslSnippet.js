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
        })

        requestAnimationFrame(this.draw.bind(this));
    }

    draw(time) {
        this.canvas.draw(time);
        requestAnimationFrame(this.draw.bind(this));
    }
}

module.exports = Snippet;