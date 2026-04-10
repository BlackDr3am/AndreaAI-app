export class ThemeManager {
  constructor(storageRepo) {
    this.storage = storageRepo;
    this.currentTheme = this.storage.get('theme') || 'dark';
    this.backgroundImage = this.storage.get('background_image') || null;
    this.backgroundOpacity = this.storage.get('background_opacity') || 0.8;
  }

  applyTheme() {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${this.currentTheme}-theme`);
    this.applyBackground();
  }

  applyBackground() {
    if (this.backgroundImage && this.backgroundImage !== 'null' && this.backgroundImage.trim() !== '') {
      document.body.style.backgroundImage = `url(${this.backgroundImage})`;
      document.body.style.backgroundColor = `rgba(0,0,0,${1 - this.backgroundOpacity})`;
      document.body.style.backgroundBlendMode = 'multiply';
      document.body.classList.add('background-image');
    } else {
      document.body.style.backgroundImage = '';
      document.body.style.backgroundColor = '';
      document.body.classList.remove('background-image');
    }
  }

  setTheme(theme) {
    this.currentTheme = theme;
    this.storage.set('theme', theme);
    this.applyTheme();
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  setBackground(imageData, opacity = 0.8) {
    this.backgroundImage = imageData;
    this.backgroundOpacity = opacity;
    this.storage.set('background_image', imageData);
    this.storage.set('background_opacity', opacity);
    this.applyBackground();
  }

  clearBackground() {
    this.backgroundImage = null;
    this.storage.remove('background_image');
    this.applyBackground();
  }

  applyBackgroundPreset(preset) {
    if (preset === 'gradient') {
      const gradientData = 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#667eea"/>
            <stop offset="100%" stop-color="#764ba2"/>
          </linearGradient></defs>
          <rect width="100%" height="100%" fill="url(#g)"/>
        </svg>
      `);
      this.setBackground(gradientData, 0.8);
    } else if (preset === 'grid') {
      const gridData = 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#grid)"/>
        </svg>
      `);
      this.setBackground(gridData, 0.8);
    } else if (preset === 'none') {
      this.clearBackground();
    }
  }
}