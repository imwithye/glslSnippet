const { Editor } = require('./editor');
const { Canvas } = require('./canvas');
const { Control } = require('./control');

class Snippet {
    constructor(element, code) {
        this.element = element;

        this.control = new Control(this.element);

        this.container = document.createElement('div');
        this.container.classList.add("glslSnippet-container");
        this.element.appendChild(this.container);
        this.editor = new Editor(this.container, code);
        this.canvas = new Canvas(this.container);
        this.editor.on('cursorActivity', e => {
            const height = e.heightAtLine(e.getCursor().line + 1, 'local') - this.canvas.element.clientHeight;
            this.canvas.setTop(height);
        });
        this.editor.on('change', e => {
            this.canvas.setFragmentCode(e.getValue());
        })

        requestAnimationFrame(this.draw.bind(this));
    }

    draw(time) {
        this.canvas.draw(time);
        requestAnimationFrame(this.draw.bind(this));
    }
}

module.exports = Snippet;