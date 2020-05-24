const Snippet = require('./core/glslSnippet');

function mount(element) {
  const code = element.innerText;
  element.innerHTML = '';
  return new Snippet(element, code);
}

(function () {
  const elements = document.getElementsByClassName('glslSnippet');
  for (var i = 0; i < elements.length; i++) {
    mount(elements[i]);
  }
})();

module.exports = { mount };
