export class User {
  constructor(id, email, name = null) {
    this.id = id;
    this.email = email;
    this.name = name;
  }

  toJSON() {
    return { id: this.id, email: this.email, name: this.name };
  }

  static fromJSON(data) {
    return new User(data.id, data.email, data.name);
  }
}