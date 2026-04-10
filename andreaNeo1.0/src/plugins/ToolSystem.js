export class ToolSystem {
  constructor(storageRepo, eventBus, themeManager, chatFacade) {
    this.storage = storageRepo;
    this.eventBus = eventBus;
    this.themeManager = themeManager;
    this.facade = chatFacade;
    this.tools = {
      nightMode: false,
      focusMode: false,
      readerMode: false,
      turboMode: false,
      devMode: false,
      shortcutsEnabled: true
    };
    this.loadSettings();
  }

  loadSettings() {
    const saved = this.storage.get('tools');
    if (saved) Object.assign(this.tools, saved);
  }

  saveSettings() {
    this.storage.set('tools', this.tools);
  }

  init() {
    this.applyTools();
    this.setupShortcuts();
  }

  applyTools() {
    if (this.tools.nightMode) this.toggleNightMode(true);
    if (this.tools.focusMode) this.toggleFocusMode(true);
    if (this.tools.readerMode) this.toggleReaderMode(true);
    if (this.tools.turboMode) this.toggleTurboMode(true);
    if (this.tools.devMode) this.toggleDevMode(true);
  }

  toggleNightMode(silent = false) {
    this.tools.nightMode = !this.tools.nightMode;
    document.body.classList.toggle('night-mode', this.tools.nightMode);
    if (!silent) this.showNotification(`Modo nocturno ${this.tools.nightMode ? 'activado' : 'desactivado'}`);
    this.saveSettings();
  }

  toggleFocusMode(silent = false) {
    this.tools.focusMode = !this.tools.focusMode;
    document.body.classList.toggle('focus-mode', this.tools.focusMode);
    if (!silent) this.showNotification(`Modo enfoque ${this.tools.focusMode ? 'activado' : 'desactivado'}`);
    this.saveSettings();
  }

  toggleReaderMode(silent = false) {
    this.tools.readerMode = !this.tools.readerMode;
    const chatSection = document.getElementById('chat-section');
    if (chatSection) chatSection.classList.toggle('reader-mode', this.tools.readerMode);
    if (!silent) this.showNotification(`Modo lectura ${this.tools.readerMode ? 'activado' : 'desactivado'}`);
    this.saveSettings();
  }

  async toggleTurboMode(silent = false) {
    this.tools.turboMode = !this.tools.turboMode;
    if (this.tools.turboMode) {
      const { LightThinking } = await import('../core/services/thinking/LightThinking.js');
      this.facade.personality.setThinkingStrategy(new LightThinking());
    } else {
      const { DeepThinking } = await import('../core/services/thinking/DeepThinking.js');
      this.facade.personality.setThinkingStrategy(new DeepThinking());
    }
    if (!silent) this.showNotification(`Modo turbo ${this.tools.turboMode ? 'activado' : 'desactivado'}`);
    this.saveSettings();
  }

  toggleDevMode(silent = false) {
    this.tools.devMode = !this.tools.devMode;
    document.body.classList.toggle('dev-mode', this.tools.devMode);
    if (!silent) this.showNotification(`Modo desarrollador ${this.tools.devMode ? 'activado' : 'desactivado'}`);
    this.saveSettings();
  }

  cycleQuickTheme() {
    const themes = ['default', 'cool', 'warm', 'dark', 'purple'];
    const body = document.body;
    let current = null;
    for (const t of themes) {
      if (body.classList.contains(`theme-${t}`)) {
        current = t;
        break;
      }
    }
    let nextIndex = current ? (themes.indexOf(current) + 1) % themes.length : 0;
    if (themes[nextIndex] === 'default') {
      body.classList.remove('theme-cool', 'theme-warm', 'theme-dark', 'theme-purple');
    } else {
      body.classList.remove('theme-cool', 'theme-warm', 'theme-dark', 'theme-purple');
      body.classList.add(`theme-${themes[nextIndex]}`);
    }
    this.showNotification(`Tema: ${themes[nextIndex]}`, 'success');
  }

  setupShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (!this.tools.shortcutsEnabled) return;
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.facade.startNewChat();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        this.themeManager.toggleTheme();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        this.toggleFocusMode();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        this.facade.startNewChat();
      }
    });
  }

  showNotification(msg, type = 'info') {
    const n = document.createElement('div');
    n.className = `notification ${type}`;
    n.textContent = msg;
    n.style.cssText = `
      position: fixed; bottom: 20px; right: 20px;
      background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'};
      color: white; padding: 12px 24px; border-radius: 8px;
      z-index: 10000; animation: fadeInUp 0.3s;
    `;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 3000);
  }
}