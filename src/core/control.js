class Control {
    constructor(container) {
        this.element = document.createElement('div');
        this.element.classList.add("glslSnippet-control");
        container.appendChild(this.element);
        this.element.innerHTML = "Controls buttons";
    }
}

module.exports = { Control };