const Snippet = require("./core/glslSnippet");

function edit(element) {
    const code = element.innerHTML;
    element.innerHTML = "";
    return new Snippet(element, code);
}

module.exports = { edit };