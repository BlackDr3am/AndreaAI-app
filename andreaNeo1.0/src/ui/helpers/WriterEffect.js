export class WriterEffect {
  constructor(speed = 3) {
    this.speed = speed;
    this.interval = null;
  }

  typeInElement(element, text, onComplete = null) {
    this.stop();
    element.innerHTML = '';
    const pre = document.createElement('pre');
    element.appendChild(pre);
    let index = 0;
    this.interval = setInterval(() => {
      if (index < text.length) {
        pre.textContent = text.substring(0, index + 1);
        index++;
      } else {
        clearInterval(this.interval);
        this.interval = null;
        if (onComplete) onComplete();
      }
    }, this.speed);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}