class Control {
  constructor(container) {
    this.element = document.createElement('div');
    this.element.classList.add('glslSnippet-control');
    container.appendChild(this.element);

    this.rewind = document.createElement('div');
    this.rewind.classList.add('glslSnippet-rewind');
    this.rewind.onclick = () => {
      if (this.handlers['rewind']) {
        this.handlers['rewind']();
      }
    };
    this.element.appendChild(this.rewind);

    this.play = document.createElement('div');
    this.play.classList.add('glslSnippet-play');
    this.play.hidden = true;
    this.play.onclick = () => {
      this.play.hidden = true;
      this.pause.hidden = false;
      if (this.handlers['play']) {
        this.handlers['play']();
      }
    };
    this.element.appendChild(this.play);

    this.pause = document.createElement('div');
    this.pause.classList.add('glslSnippet-pause');
    this.pause.onclick = () => {
      this.pause.hidden = true;
      this.play.hidden = false;
      if (this.handlers['pause']) {
        this.handlers['pause']();
      }
    };
    this.element.appendChild(this.pause);

    this.time = document.createElement('div');
    this.time.classList.add('glslSnippet-control-text');
    this.time.innerHTML = '0.00';
    this.element.appendChild(this.time);

    this.fps = document.createElement('div');
    this.fps.classList.add('glslSnippet-control-text');
    this.fps.innerHTML = '0.00 fps';
    this.element.appendChild(this.fps);

    this.handlers = {};
  }

  setTime(time) {
    this.time.innerHTML = time.toFixed(2);
  }

  setFPS(fps) {
    this.fps.innerHTML = `${Math.floor(fps)} fps`;
  }

  on(eventName, handler) {
    this.handlers[eventName] = handler;
  }
}

module.exports = { Control };
