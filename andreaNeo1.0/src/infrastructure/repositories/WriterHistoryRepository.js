export class WriterHistoryRepository {
  constructor(storageRepo) {
    this.storage = storageRepo;
    this.key = 'writer_history';
  }

  getAll() {
    return this.storage.get(this.key) || [];
  }

  save(conversation) {
    const all = this.getAll();
    const index = all.findIndex(c => c.id === conversation.id);
    if (index !== -1) all[index] = conversation;
    else all.unshift(conversation);
    if (all.length > 50) all.pop();
    this.storage.set(this.key, all);
  }

  delete(id) {
    const all = this.getAll().filter(c => c.id !== id);
    this.storage.set(this.key, all);
  }

  findById(id) {
    return this.getAll().find(c => c.id === id);
  }
}