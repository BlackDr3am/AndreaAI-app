import { ThinkingStrategy } from './ThinkingStrategy.js';

export class PhilosophicalThinking extends ThinkingStrategy {
  analyze(ps) {
    return { emotion: ps.emotion, context: 'profundo significado' };
  }
  process(analysis) {
    return `🌌 Reflexión filosófica sobre ${analysis.emotion.name}`;
  }
  format(processed) {
    return `💭 MODO FILOSÓFICO\n${processed}\n`;
  }
}