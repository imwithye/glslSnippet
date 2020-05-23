const Snippet = require("./core/glslSnippet");

function edit(element) {
    const code = element.innerText;
    element.innerHTML = "";
    return new Snippet(element, code);
}

module.exports = { edit };