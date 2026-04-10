export class StorageRepository {
  constructor(prefix = 'andrea_') {
    this.prefix = prefix;
  }

  get(key) {
    const value = localStorage.getItem(this.prefix + key);
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  set(key, value) {
    const toStore = typeof value === 'object' ? JSON.stringify(value) : value;
    localStorage.setItem(this.prefix + key, toStore);
  }

  remove(key) {
    localStorage.removeItem(this.prefix + key);
  }
}