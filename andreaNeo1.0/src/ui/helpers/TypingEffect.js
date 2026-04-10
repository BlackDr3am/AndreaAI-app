export class TypingEffect {
  constructor(speed = 3) {
    this.speed = speed;
    this.interval = null;
  }

  typeInElement(container, fullText, senderClass, onComplete = null) {
    this.stop();
    const wrapper = document.createElement('div');
    wrapper.className = `message-wrapper ${senderClass}`;
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    wrapper.appendChild(contentDiv);
    container.appendChild(wrapper);
    let index = 0;
    this.interval = setInterval(() => {
      if (index < fullText.length) {
        contentDiv.textContent = fullText.substring(0, index + 1);
        index++;
        container.scrollTop = container.scrollHeight;
      } else {
        clearInterval(this.interval);
        this.interval = null;
        contentDiv.innerHTML = fullText; // para markdown
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