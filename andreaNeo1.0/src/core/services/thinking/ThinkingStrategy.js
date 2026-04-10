// ThinkingStrategy.js - Clase base abstracta
export class ThinkingStrategy {
  buildSystemPrompt(personalitySystem) {
    const analysis = this.analyze(personalitySystem);
    const processed = this.process(analysis);
    return this.format(processed);
  }

  analyze(personalitySystem) {
    throw new Error('Method analyze() must be implemented');
  }

  process(analysis) {
    throw new Error('Method process() must be implemented');
  }

  format(processed) {
    throw new Error('Method format() must be implemented');
  }
}