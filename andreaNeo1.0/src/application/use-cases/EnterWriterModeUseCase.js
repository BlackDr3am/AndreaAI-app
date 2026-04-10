export class EnterWriterModeUseCase {
  constructor(facade) {
    this.facade = facade;
  }

  execute(prompt, autoGenerate = true) {
    this.facade.writerModeActive = true;
    this.facade.writerPrompt = prompt;
    this.facade.writerOutput = '';
    this.facade.eventBus.emit('writerModeChanged', { active: true, prompt });
    if (autoGenerate && prompt.trim()) {
      this.facade.generateWriterText(prompt);
    }
  }
}