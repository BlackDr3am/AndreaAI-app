// DeepThinking.js
import { ThinkingStrategy } from './ThinkingStrategy.js';

export class DeepThinking extends ThinkingStrategy {
  analyze(ps) {
    return {
      emotion: ps.emotion,
      traits: ps.traits,
      memorySize: ps.memory.size,
      complexity: 'high'
    };
  }

  process(analysis) {
    const steps = [
      `💭 Estado emocional: ${analysis.emotion.name} (intensidad ${analysis.emotion.intensity})`,
      `🧠 Rasgos: ${Object.keys(analysis.traits).join(', ')}`,
      `📚 Memoria: ${analysis.memorySize} hechos recordados`,
      '🔍 Aplicando análisis profundo...'
    ];
    return steps.join('\n');
  }

  format(processed) {
    return `🧠 **MODO PENSAMIENTO PROFUNDO ACTIVADO**\n${processed}\n\n`;
  }
}