export class Message {
  constructor(id, sender, content, timestamp) {
    this.id = id;
    this.sender = sender; // 'user' o 'ai'
    this.content = content;
    this.timestamp = timestamp || Date.now();
  }

  toJSON() {
    return {
      id: this.id,
      sender: this.sender,
      content: this.content,
      timestamp: this.timestamp
    };
  }

  static fromJSON(data) {
    return new Message(data.id, data.sender, data.content, data.timestamp);
  }
}