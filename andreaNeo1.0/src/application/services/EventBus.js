// EventBus.js - Singleton aplicado
export class EventBus {
  static #instance = null;

  constructor() {
    if (EventBus.#instance) return EventBus.#instance;
    this.listeners = new Map();
    EventBus.#instance = this;
  }

  static getInstance() {
    if (!EventBus.#instance) {
      EventBus.#instance = new EventBus();
    }
    return EventBus.#instance;
  }

  on(event, callback, context = null) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event).push({ callback, context });
  }

  off(event, callback) {
    if (!this.listeners.has(event)) return;
    const filtered = this.listeners.get(event).filter(l => l.callback !== callback);
    this.listeners.set(event, filtered);
  }

  emit(event, data) {
    if (!this.listeners.has(event)) return;
    this.listeners.get(event).forEach(({ callback, context }) => {
      callback.call(context, data);
    });
  }
}