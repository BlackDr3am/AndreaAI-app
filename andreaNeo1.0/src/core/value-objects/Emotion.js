export class Emotion {
  static VALID_EMOTIONS = ['happy', 'excited', 'curious', 'thinking', 'surprised', 'nervous', 'sad', 'loving', 'playful', 'proud', 'confused', 'inspired', 'neutral'];

  constructor(name, intensity) {
    if (!Emotion.VALID_EMOTIONS.includes(name)) throw new Error(`Invalid emotion: ${name}`);
    this.name = name;
    this.intensity = Math.min(0.95, Math.max(0, intensity));
  }

  get description() {
    const intensityText = this.intensity > 0.8 ? 'muy ' : (this.intensity > 0.6 ? '' : 'un poco ');
    return `Andrea está ${intensityText}${this.name}`;
  }

  get icon() {
    const icons = {
      happy: 'fas fa-smile-beam', excited: 'fas fa-star', curious: 'fas fa-question-circle',
      thinking: 'fas fa-brain', surprised: 'fas fa-surprise', nervous: 'fas fa-flushed',
      sad: 'fas fa-frown', loving: 'fas fa-heart', playful: 'fas fa-gamepad',
      proud: 'fas fa-trophy', confused: 'fas fa-question', inspired: 'fas fa-lightbulb',
      neutral: 'fas fa-smile'
    };
    return icons[this.name] || 'fas fa-smile';
  }

  get color() {
    const colors = {
      happy: '#FFD700', excited: '#FF6B6B', curious: '#4ECDC4', thinking: '#556270',
      surprised: '#FF9F1C', nervous: '#FFE66D', sad: '#6C5B7B', loving: '#FF6B9D',
      playful: '#1DD3B0', proud: '#06D6A0', confused: '#A0A0A0', inspired: '#FF9A76',
      neutral: '#5C6BC0'
    };
    return colors[this.name] || '#5C6BC0';
  }
}