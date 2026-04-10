import { Conversation } from '../../core/entities/Conversation.js';

export class ConversationRepository {
  constructor(storageRepo) {
    this.storage = storageRepo;
    this.storageKey = 'conversation_history';
  }

  getAll() {
    const data = this.storage.get(this.storageKey) || [];
    return data.map(convData => Conversation.fromJSON(convData));
  }

  save(conversation) {
    const all = this.getAll();
    const index = all.findIndex(c => c.id === conversation.id);
    if (index !== -1) all[index] = conversation;
    else all.unshift(conversation);
    this.storage.set(this.storageKey, all.map(c => c.toJSON()));
  }

  delete(id) {
    const all = this.getAll().filter(c => c.id !== id);
    this.storage.set(this.storageKey, all.map(c => c.toJSON()));
  }

  findById(id) {
    return this.getAll().find(c => c.id === id);
  }

  clear() {
    this.storage.set(this.storageKey, []);
  }
}