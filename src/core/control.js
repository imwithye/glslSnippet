const RewindDataURI = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAACXBIWXMAAAsTAAALEwEAmpwYAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAAyklEQVR42mL8//8/Ay0AQAAxMdAIAAQQzQwGCCAGUFBgwySAHGz6AQIIn8H/0TBWQ0Fy2PQDBBAlBmfD5LDpBwggcg3ORpbDph8ggMgxOAddDpt+gAAi1eBsLOJYDQYIIFIMzsFmKC6DAQKIEVfSYmRk/E9CkmVEFwMIIFIySC4piRsggEgN4xxigwIggGiWKgACiNx0nEPIYIAAoiTn5eAzGCCAaFZWAAQQNUo3KWz6AQKIkVY1CEAA0aygBwggmhkMEEA0MxggwAA0PQ28iBY2AwAAAABJRU5ErkJggg==`;
const PlayDataURI = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAACXBIWXMAAAsTAAALEwEAmpwYAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAAxUlEQVR42mL8//8/Ay0AQAAxMdAIAAQQXoMZGRnrgZiDHIMBAogBFBS4MBCAiHp8anBhgAAixmCw4UDMQYrBAAFErMEkGw4QQKQYTFKwAAQQqQYTbThAAJFjMFHBAhBA5BpM0OUAAcSIL+cB0/B/AkmVEZccQABRkvMa8EkCBBDZYUwo8gACiGapAiCAaJaOAQKIpJxHSpYGCCCiywpSCyGAAKJZ6QYQQIQMriXHUBAGCCBGWlVNAAFEs6oJIIBoZjBAgAEAy/wZQBSOd0MAAAAASUVORK5CYII=`;
const PauseDataURI = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAACXBIWXMAAAsTAAALEwEAmpwYAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAAkUlEQVR42mL8//8/Ay0AQAAxMdAIAAQQzQwGCCCaGQwQQCy4JBgZGdEDnxFKo4gD44gRm36AAKKZiwECiGYGAwQQzQwGCCCaGQwQQDQzGCCAaGYwQADRzGCAAKKZwQABRDODAQKIZgYDBBDNDAYIIJoZDBBAjLQq6AECiGYuBgggmhkMEEA0MxgggGhmMECAAQDzUgsnj60IDAAAAABJRU5ErkJggg==`;
const FullScreenDataURI = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAACXBIWXMAAAsTAAALEwEAmpwYAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAAqklEQVR42mL8//8/Ay0AQAAxMdAIAAQQzQwGCCCaGQwQQCzoAoyMjLgCnRFKY5UHxhUjMh8ggGjmYoAAopnBAAFEM4MBAoiFCDWMpIQ1DAAEEM1cDBBALES4kFifoACAAKKZiwECCJuL/xPpMrzqAAKIhQzHEFVqAQQQE5EGkVwEAgQQzcIYIIBoZjBAANHMYIAAYqRVDQIQQDRzMUAA0cxggACimcEAAQYAdbYRL29c7wAAAAAASUVORK5CYII=`;

class Control {
  constructor(container) {
    this.element = document.createElement('div');
    this.element.classList.add('glslSnippet-control');
    container.appendChild(this.element);

    this.rewind = document.createElement('img');
    this.rewind.src = RewindDataURI;
    this.element.appendChild(this.rewind);

    this.play = document.createElement('img');
    this.play.src = PlayDataURI;
    this.element.appendChild(this.play);

    this.pause = document.createElement('img');
    this.pause.src = PauseDataURI;
    this.element.appendChild(this.pause);

    this.time = document.createElement("div");
    this.time.innerHTML = "0.00";
    this.element.appendChild(this.time);

    this.fps = document.createElement("div");
    this.fps.innerHTML = "0.00 fps";
    this.element.appendChild(this.fps);

    this.fullScreen = document.createElement('img');
    this.fullScreen.src = FullScreenDataURI;
    this.fullScreen.style.marginLeft = "auto";
    this.element.appendChild(this.fullScreen);
  }

  setTime(time) {
    this.time.innerHTML = time.toFixed(2);
  }

  setFPS(fps) {
    this.fps.innerHTML = `${Math.floor(fps)} fps`;
  }
}

module.exports = { Control };
