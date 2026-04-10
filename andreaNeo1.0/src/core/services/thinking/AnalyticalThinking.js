import { ThinkingStrategy } from './ThinkingStrategy.js';

export class AnalyticalThinking extends ThinkingStrategy {
  analyze(ps) {
    return {
      emotion: ps.emotion,
      traits: Object.entries(ps.traits).map(([k, v]) => `${k}:${v.value}`),
      memorySize: ps.memory.size
    };
  }
  process(analysis) {
    return `📊 Análisis: ${analysis.traits.join(', ')} | Memoria: ${analysis.memorySize}`;
  }
  format(processed) {
    return `🔬 MODO ANALÍTICO\n${processed}\n`;
  }
}