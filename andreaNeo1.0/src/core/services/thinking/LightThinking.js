import { ThinkingStrategy } from './ThinkingStrategy.js';

export class LightThinking extends ThinkingStrategy {
  analyze(ps) {
    return { emotion: ps.emotion.name, quickContext: 'rápido' };
  }
  process(analysis) {
    return `⚡ Modo rápido - Emoción: ${analysis.emotion}`;
  }
  format(processed) {
    return `🧠 PENSAMIENTO RÁPIDO\n${processed}\n`;
  }
}