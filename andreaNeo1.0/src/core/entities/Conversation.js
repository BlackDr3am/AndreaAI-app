import { Message } from './Message.js';

export class Conversation {
  constructor(id, title, messages = [], timestamp = null) {
    this.id = id;
    this.title = title;
    this.messages = messages.map(m => m instanceof Message ? m : Message.fromJSON(m));
    this.timestamp = timestamp || Date.now();
  }

  addMessage(message) {
    this.messages.push(message);
    if (this.messages.length === 1 && message.sender === 'user') {
      this.title = message.content.substring(0, 35) + (message.content.length > 35 ? '...' : '');
    }
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      messages: this.messages.map(m => m.toJSON()),
      timestamp: this.timestamp
    };
  }

  static fromJSON(data) {
    return new Conversation(data.id, data.title, data.messages, data.timestamp);
  }
}