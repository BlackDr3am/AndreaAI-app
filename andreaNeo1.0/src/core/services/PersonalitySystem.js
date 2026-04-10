// PersonalitySystem.js - Emite eventos vía EventBus
import { Emotion } from '../value-objects/Emotion.js';
import { PersonalityTrait } from '../value-objects/PersonalityTrait.js';

export class PersonalitySystem {
  constructor(eventBus, thinkingStrategy, configRepo) {
    this.eventBus = eventBus;
    this.thinkingStrategy = thinkingStrategy;
    this.configRepo = configRepo;

    this.emotion = new Emotion('neutral', 0.5);
    this.traits = {
      enthusiasm: new PersonalityTrait('enthusiasm', 0.8),
      curiosity: new PersonalityTrait('curiosity', 0.9),
      empathy: new PersonalityTrait('empathy', 0.85),
      // ... otros rasgos
    };
    this.memory = new Map(); // userFacts, preferences, etc.
    this.loadConfig();
  }

  loadConfig() {
    const saved = this.configRepo.load();
    if (saved) {
      this.emotion = new Emotion(saved.emotion.name, saved.emotion.intensity);
      // restaurar rasgos, memoria...
    }
  }

  saveConfig() {
    this.configRepo.save({
      emotion: { name: this.emotion.name, intensity: this.emotion.intensity },
      traits: Object.fromEntries(Object.entries(this.traits).map(([k, v]) => [k, v.value])),
      memory: Array.from(this.memory.entries())
    });
  }

  analyzeUserMood(message) {
    const detected = this.#detectEmotion(message);
    if (detected !== this.emotion.name) {
      this.emotion = new Emotion(detected, Math.min(0.95, this.emotion.intensity + 0.1));
      this.eventBus.emit('emotionChanged', { emotion: this.emotion });
    }
    return this.emotion.name;
  }

  #detectEmotion(text) {
    // lógica original de detección (emotionTriggers)
    return 'happy'; // simplificado
  }

  getSystemPrompt() {
    // genera prompt usando thinkingStrategy
    return this.thinkingStrategy.buildSystemPrompt(this);
  }

  enhanceResponse(response, context) {
    // aplicar emociones, humor, etc.
    return response;
  }

  setThinkingStrategy(strategy) {
    this.thinkingStrategy = strategy;
    this.eventBus.emit('thinkingStrategyChanged', { strategy: strategy.constructor.name });
  }
}