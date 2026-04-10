export class WriterModePanel {
  constructor(eventBus, facade, writerEffect) {
    this.eventBus = eventBus;
    this.facade = facade;
    this.writerEffect = writerEffect;
    this.panel = document.getElementById('writer-mode-section');
    this.promptInput = document.getElementById('writer-prompt');
    this.outputDiv = document.getElementById('writer-output');
    this.generateBtn = document.getElementById('writer-generate-btn');
    this.exitBtn = document.getElementById('exit-writer-mode');
    this.copyBtn = document.getElementById('copy-writer-output');
    this.init();
  }

  init() {
    this.generateBtn?.addEventListener('click', () => this.generate());
    this.exitBtn?.addEventListener('click', () => this.facade.exitWriterMode());
    this.copyBtn?.addEventListener('click', () => this.copyOutput());
    this.eventBus.on('writerModeChanged', ({ active, prompt }) => {
      this.panel.style.display = active ? 'block' : 'none';
      document.getElementById('chat-section').style.display = active ? 'none' : 'block';
      if (prompt) this.promptInput.value = prompt;
      if (!active) this.outputDiv.innerHTML = '';
    });
    this.eventBus.on('writerTextGenerated', ({ output }) => {
      this.writerEffect.typeInElement(this.outputDiv, output);
    });
  }

  async generate() {
    const prompt = this.promptInput.value.trim();
    if (!prompt) return;
    await this.facade.generateWriterText(prompt);
  }

  copyOutput() {
    const text = this.outputDiv.innerText;
    if (text) {
      navigator.clipboard.writeText(text);
      alert('Texto copiado al portapapeles');
    }
  }
}