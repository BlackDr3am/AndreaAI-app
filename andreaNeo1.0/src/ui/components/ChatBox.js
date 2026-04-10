import { enhancedFormatResponse } from '../../shared/utils/formatters.js';
import { scrollToBottom } from '../../shared/utils/domHelpers.js';

export class ChatBox {
  constructor(containerId, eventBus, typingEffect) {
    this.container = document.getElementById(containerId);
    this.eventBus = eventBus;
    this.typingEffect = typingEffect;
    this.subscribe();
  }

  subscribe() {
    this.eventBus.on('messageAdded', (msg) => this.renderMessage(msg, false));
    this.eventBus.on('aiResponseReady', (data) => {
      this.typingEffect.typeInElement(this.container, data.text, 'ai', () => {
        this.eventBus.emit('aiResponseFinished', data);
      });
    });
  }

  renderMessage(message, withEffect = false) {
    const wrapper = document.createElement('div');
    wrapper.className = `message-wrapper ${message.sender}`;
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    if (message.sender === 'ai') {
      contentDiv.innerHTML = enhancedFormatResponse(message.content);
    } else {
      contentDiv.textContent = message.content;
    }
    wrapper.appendChild(contentDiv);
    this.container.appendChild(wrapper);
    scrollToBottom(this.container);
  }

  clear() {
    this.container.innerHTML = '';
  }
}