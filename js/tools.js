// tools.js - Sistema de herramientas avanzadas para AndreaAI
// Creado por: IsaDetaSeek
// Versión: 3.1 - Eliminadas referencias a elementos DOM inexistentes

class ToolSystem {
    constructor() {
        this.tools = {
            nightMode: false,
            focusMode: false,
            readerMode: false,
            turboMode: false,
            devMode: false,
            shortcutsEnabled: true,
            uiZoom: 100,
            autosaveInterval: 30,
            quickThemes: true
        };
        
        this.stats = {
            totalMessages: 0,
            thinkingTime: 0,
            sessions: 0,
            codeBlocks: 0,
            lastReset: null
        };
        
        this.themeConfig = {
            mode: 'dark',
            backgroundImage: null,
            backgroundOpacity: 0.8
        };
        
        this.emotionSupport = true;
        
        this.init();
    }
    
    init() {
        this.loadSettings();
        this.loadStats();
        this.setupEventListeners();
        this.setupQuickTools();
        this.updateStatsDisplay();
        this.setupEmotionSupport();
        console.log('🔧 Sistema de herramientas inicializado');
    }
    
    loadSettings() {
        const savedTools = localStorage.getItem('andrea_tools');
        if (savedTools) {
            this.tools = { ...this.tools, ...JSON.parse(savedTools) };
        }
        const savedTheme = localStorage.getItem('andrea_theme');
        const savedBgImage = localStorage.getItem('andrea_background_image');
        const savedBgOpacity = localStorage.getItem('andrea_background_opacity');
        
        if (savedTheme) this.themeConfig.mode = savedTheme;
        
        if (savedBgImage && savedBgImage !== 'null' && savedBgImage !== 'undefined') {
            this.themeConfig.backgroundImage = savedBgImage;
        } else {
            this.themeConfig.backgroundImage = null;
        }
        
        if (savedBgOpacity) this.themeConfig.backgroundOpacity = parseFloat(savedBgOpacity);
        
        this.applyTools();
        this.applyTheme();
    }
    
    loadStats() {
        const savedStats = localStorage.getItem('andrea_stats');
        if (savedStats) {
            this.stats = JSON.parse(savedStats);
        }
    }
    
    saveSettings() {
        localStorage.setItem('andrea_tools', JSON.stringify(this.tools));
    }
    
    saveStats() {
        localStorage.setItem('andrea_stats', JSON.stringify(this.stats));
    }
    
    setupEventListeners() {
        setTimeout(() => {
            this.setupAutosave();
            this.setupShortcuts();
        }, 1000);
    }
    
    setupQuickTools() {
        const quickToolButtons = document.querySelectorAll('.quick-tool-btn');
        quickToolButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.classList.add('clicked');
                setTimeout(() => {
                    e.target.classList.remove('clicked');
                }, 300);
            });
        });
    }
    
    setupEmotionSupport() {
        if (window.app && window.app.emotions) {
            console.log('🎭 Sistema de emociones detectado');
        }
    }
    
    applyTools() {
        if (this.tools.nightMode) this.toggleNightMode(true);
        if (this.tools.focusMode) this.toggleFocusMode(true);
        if (this.tools.readerMode) this.toggleReaderMode(true);
        if (this.tools.turboMode) this.toggleTurboMode(true);
        if (this.tools.devMode) this.toggleDevMode(true);
        this.applyUIScale();
    }
    
    applyTheme() {
        const theme = this.themeConfig.mode === 'auto' ? 
            (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark') : 
            this.themeConfig.mode;
        
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(`${theme}-theme`);
        
        if (this.themeConfig.backgroundImage && 
            this.themeConfig.backgroundImage !== 'null' && 
            this.themeConfig.backgroundImage !== 'undefined' &&
            this.themeConfig.backgroundImage.trim() !== '') {
            
            document.body.classList.add('background-image');
            document.body.style.backgroundImage = `url(${this.themeConfig.backgroundImage})`;
            document.body.style.backgroundColor = `rgba(0, 0, 0, ${1 - this.themeConfig.backgroundOpacity})`;
            document.body.style.backgroundBlendMode = 'multiply';
        } else {
            document.body.classList.remove('background-image');
            document.body.style.backgroundImage = '';
            document.body.style.backgroundColor = '';
        }
    }
    
    setTheme(mode) {
        this.themeConfig.mode = mode;
        this.applyTheme();
        localStorage.setItem('andrea_theme', mode);
        this.showNotification(`Tema cambiado a: ${mode}`, 'success');
    }

    toggleTheme() {
        const newMode = this.themeConfig.mode === 'light' ? 'dark' : 'light';
        this.setTheme(newMode);
    }
    
    setBackground(imageData, opacity = 0.8) {
        if (imageData && imageData !== 'null' && imageData !== 'undefined') {
            this.themeConfig.backgroundImage = imageData;
            this.themeConfig.backgroundOpacity = opacity;
            this.applyTheme();
            localStorage.setItem('andrea_background_image', imageData);
            localStorage.setItem('andrea_background_opacity', opacity);
            this.showNotification('Fondo personalizado aplicado', 'success');
        } else {
            this.clearBackground();
        }
    }
    
    clearBackground() {
        this.themeConfig.backgroundImage = null;
        document.body.classList.remove('background-image');
        document.body.style.backgroundImage = '';
        localStorage.removeItem('andrea_background_image');
        this.showNotification('Fondo personalizado eliminado', 'info');
    }
    
    applyBackgroundPreset(preset) {
        switch(preset) {
            case 'gradient':
                const gradientData = 'data:image/svg+xml;base64,' + btoa(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                        <defs>
                            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                                <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                            </linearGradient>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grad1)" />
                    </svg>
                `);
                this.setBackground(gradientData, 0.8);
                break;
            case 'grid':
                const gridData = 'data:image/svg+xml;base64,' + btoa(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                        <defs>
                            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                `);
                this.setBackground(gridData, 0.8);
                break;
            case 'none':
                this.clearBackground();
                break;
        }
    }
    
    toggleNightMode(silent = false) {
        this.tools.nightMode = !this.tools.nightMode;
        document.body.classList.toggle('night-mode', this.tools.nightMode);
        if (!silent) {
            this.showNotification(
                `Modo nocturno ${this.tools.nightMode ? 'activado' : 'desactivado'}`,
                this.tools.nightMode ? 'info' : 'success'
            );
            this.saveSettings();
        }
    }
    
    toggleFocusMode(silent = false) {
        this.tools.focusMode = !this.tools.focusMode;
        document.body.classList.toggle('focus-mode', this.tools.focusMode);
        if (!silent) {
            this.showNotification(
                `Modo enfoque ${this.tools.focusMode ? 'activado' : 'desactivado'}`,
                this.tools.focusMode ? 'info' : 'success'
            );
        }
    }
    
    toggleReaderMode(silent = false) {
        this.tools.readerMode = !this.tools.readerMode;
        const chatSection = document.getElementById('chat-section');
        if (chatSection) {
            chatSection.classList.toggle('reader-mode', this.tools.readerMode);
        }
        if (!silent) {
            this.showNotification(
                `Modo lectura ${this.tools.readerMode ? 'activado' : 'desactivado'}`,
                this.tools.readerMode ? 'info' : 'success'
            );
        }
    }
    
    toggleTurboMode(silent = false) {
        this.tools.turboMode = !this.tools.turboMode;
        if (window.app) {
            if (this.tools.turboMode) {
                window.app.thinkingMode = false;
                window.app.thinkingLevel = 'light';
                window.app.updateThinkingButton && window.app.updateThinkingButton();
            }
        }
        if (!silent) {
            this.showNotification(
                `Modo turbo ${this.tools.turboMode ? 'activado' : 'desactivado'}`,
                this.tools.turboMode ? 'info' : 'success'
            );
        }
    }
    
    toggleDevMode(silent = false) {
        this.tools.devMode = !this.tools.devMode;
        if (this.tools.devMode) {
            console.log('🧪 Modo desarrollador activado');
            console.log('📊 Estadísticas:', this.stats);
            console.log('🔧 Herramientas:', this.tools);
            document.body.classList.add('dev-mode');
        } else {
            document.body.classList.remove('dev-mode');
        }
        if (!silent) {
            this.showNotification(
                `Modo programador ${this.tools.devMode ? 'activado' : 'desactivado'}`,
                this.tools.devMode ? 'info' : 'success'
            );
        }
    }
    
    setupShortcuts() {
        document.addEventListener('keydown', this.handleShortcuts.bind(this));
    }
    
    handleShortcuts(e) {
        if (!this.tools.shortcutsEnabled) return;
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            window.resetAll();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
            e.preventDefault();
            if (window.app) window.app.clearChat();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 't') {
            e.preventDefault();
            this.toggleTheme();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            this.tools.focusMode = !this.tools.focusMode;
            this.toggleFocusMode();
            this.saveSettings();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            this.tools.readerMode = !this.tools.readerMode;
            this.toggleReaderMode();
            this.saveSettings();
        }
    }
    
    applyUIScale() {
        document.documentElement.style.fontSize = `${this.tools.uiZoom}%`;
    }
    
    setupAutosave() {
        if (this.autosaveInterval) {
            clearInterval(this.autosaveInterval);
        }
        if (this.tools.autosaveInterval > 0) {
            this.autosaveInterval = setInterval(() => {
                if (window.app) {
                    window.app.saveConversationHistory();
                    console.log('💾 Auto-guardado realizado');
                }
            }, this.tools.autosaveInterval * 1000);
        }
    }
    
    applyQuickTheme(themeName) {
        document.body.classList.remove('theme-cool', 'theme-warm', 'theme-dark', 'theme-purple');
        if (themeName !== 'default') {
            document.body.classList.add(`theme-${themeName}`);
        }
        document.body.classList.add('theme-changing');
        setTimeout(() => {
            document.body.classList.remove('theme-changing');
        }, 500);
        this.showNotification(`Tema aplicado: ${themeName}`, 'success');
    }
    
    updateStats() {
        if (window.app && window.app.messages) {
            this.stats.totalMessages = window.app.messages.length;
        }
        this.stats.thinkingTime += 1;
        const codeBlocks = document.querySelectorAll('.code-block-wrapper').length;
        this.stats.codeBlocks = codeBlocks;
        this.updateStatsDisplay();
        this.saveStats();
    }
    
    updateStatsDisplay() {
        // Los siguientes elementos no existen en el HTML actual, se comentan para evitar errores.
        // Si se desean mostrar, deben agregarse en el HTML.
        /*
        const totalMessagesEl = document.getElementById('total-messages-count');
        const thinkingTimeEl = document.getElementById('thinking-time');
        const sessionsEl = document.getElementById('sessions-count');
        const codeBlocksEl = document.getElementById('code-blocks-count');
        const histTotalConv = document.getElementById('total-conversations');
        const histTotalMsg = document.getElementById('total-messages');
        
        if (totalMessagesEl) totalMessagesEl.textContent = this.stats.totalMessages;
        if (thinkingTimeEl) thinkingTimeEl.textContent = this.formatTime(this.stats.thinkingTime);
        if (sessionsEl) sessionsEl.textContent = this.stats.sessions;
        if (codeBlocksEl) codeBlocksEl.textContent = this.stats.codeBlocks;
        
        if (histTotalConv && window.app) {
            histTotalConv.textContent = window.app.conversationHistory.length;
        }
        if (histTotalMsg) {
            histTotalMsg.textContent = this.stats.totalMessages;
        }
        */
    }
    
    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else if (minutes > 0) {
            return `${minutes}m`;
        } else {
            return `${seconds}s`;
        }
    }
    
    exportStats() {
        const exportData = {
            ...this.stats,
            exportDate: new Date().toISOString(),
            tools: this.tools
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `andrea-stats-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showNotification('Estadísticas exportadas', 'success');
    }
    
    resetStats() {
        if (!confirm('¿Estás seguro de reiniciar todas las estadísticas? Esta acción no se puede deshacer.')) {
            return;
        }
        this.stats = {
            totalMessages: 0,
            thinkingTime: 0,
            sessions: 0,
            codeBlocks: 0,
            lastReset: new Date().toISOString()
        };
        this.updateStatsDisplay();
        this.saveStats();
        this.showNotification('Estadísticas reiniciadas', 'success');
    }
    
    showNotification(message, type = 'info') {
        if (window.app && window.app.showNotification) {
            window.app.showNotification(message, type);
        } else {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            `;
            document.body.appendChild(notification);
            setTimeout(() => {
                notification.classList.add('show');
                setTimeout(() => {
                    notification.classList.remove('show');
                    setTimeout(() => notification.remove(), 300);
                }, 3000);
            }, 10);
        }
    }
}

window.toggleNightMode = function() {
    if (window.toolSystem) {
        window.toolSystem.toggleNightMode();
    }
};

window.toggleFocusMode = function() {
    if (window.toolSystem) {
        window.toolSystem.tools.focusMode = !window.toolSystem.tools.focusMode;
        window.toolSystem.toggleFocusMode();
        window.toolSystem.saveSettings();
    }
};

window.toggleQuickTheme = function() {
    if (window.toolSystem) {
        const themes = ['default', 'cool', 'warm', 'dark', 'purple'];
        const currentTheme = document.body.className.match(/theme-(\w+)/);
        let nextIndex = 0;
        if (currentTheme) {
            const current = currentTheme[1];
            nextIndex = (themes.indexOf(current) + 1) % themes.length;
        }
        window.toolSystem.applyQuickTheme(themes[nextIndex]);
    }
};

window.toggleQuickTools = function() {
    const quickTools = document.querySelector('.quick-tools');
    if (quickTools) {
        quickTools.classList.toggle('expanded');
    }
};

window.setTheme = function(mode) {
    if (window.toolSystem) {
        window.toolSystem.setTheme(mode);
    }
};

window.toggleTheme = function() {
    if (window.toolSystem) {
        window.toolSystem.toggleTheme();
    }
};

window.clearBackground = function() {
    if (window.toolSystem) {
        window.toolSystem.clearBackground();
    }
};

window.applyBackgroundPreset = function(preset) {
    if (window.toolSystem) {
        window.toolSystem.applyBackgroundPreset(preset);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.toolSystem = new ToolSystem();
    console.log('🔧 Sistema de herramientas cargado');
    window.toolSystem.stats.sessions++;
    window.toolSystem.saveStats();
    setInterval(() => {
        window.toolSystem.updateStats();
    }, 10000);
});