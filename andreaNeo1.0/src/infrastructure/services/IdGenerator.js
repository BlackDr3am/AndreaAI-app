export class IdGenerator {
  static generate() {
    return Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9);
  }
}