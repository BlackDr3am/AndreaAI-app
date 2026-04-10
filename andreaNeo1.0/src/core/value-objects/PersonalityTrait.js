export class PersonalityTrait {
  constructor(name, value, min = 0, max = 1) {
    this.name = name;
    this.value = Math.min(max, Math.max(min, value));
    this.min = min;
    this.max = max;
  }

  increase(amount) {
    this.value = Math.min(this.max, this.value + amount);
  }

  decrease(amount) {
    this.value = Math.max(this.min, this.value - amount);
  }

  toJSON() {
    return { name: this.name, value: this.value };
  }
}