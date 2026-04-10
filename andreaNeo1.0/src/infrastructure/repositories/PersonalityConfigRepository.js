export class PersonalityConfigRepository {
  constructor(storageRepo) {
    this.storage = storageRepo;
    this.key = 'personality_config';
  }

  load() {
    return this.storage.get(this.key);
  }

  save(config) {
    this.storage.set(this.key, config);
  }
}