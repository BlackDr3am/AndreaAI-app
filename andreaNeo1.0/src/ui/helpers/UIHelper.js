// UIHelper.js - Coordina la interfaz de usuario
import { adjustTextareaHeight, scrollToBottom } from '../../shared/utils/domHelpers.js';
import { enhancedFormatResponse } from '../../shared/utils/formatters.js';

export class UIHelper {
  constructor(chatFacade, typingEffect, writerEffect, eventBus) {
    this.facade = chatFacade;
    this.typingEffect = typingEffect;
    this.writerEffect = writerEffect;
    this.eventBus = eventBus;
    this.chatBox = document.getElementById('chat-box');
    this.userInput = document.getElementById('user-input');
    this.sendBtn = document.getElementById('send-btn');
    this.sidebar = document.getElementById('sidebar');
    this.mobileOverlay = document.getElementById('mobile-overlay');
  }

  init() {
    this.setupEventListeners();
    this.subscribeToEvents();
    this.loadInitialState();  // ← método esperado por tu código
  }

  // Alias para compatibilidad (ambos nombres funcionan)
  loadInitialState() {
    this.loadInitialUI();
  }

  loadInitialUI() {
    this.resetTextareaHeight();
    this.toggleWriterModeUI(false);
    if (this.chatBox && this.chatBox.children.length === 0) {
      this.chatBox.innerHTML = `<div class="empty-state">
        <img class="icon-format" src="icon_AI.png" alt="AI">
        <p>Welcome, I'm Andrea</p>
        <p>Select a conversation from history or start a new one.</p>
      </div>`;
    }
  }

  subscribeToEvents() {
    this.eventBus.on('aiResponseReady', (data) => {
      this.typingEffect.typeInElement(this.chatBox, data.text, 'ai', () => {
        this.facade.addMessageToCurrent('ai', data.text);
      });
    });
    this.eventBus.on('messageAdded', (message) => {
      if (message.sender !== 'ai') this.appendMessage(message);
    });
    this.eventBus.on('conversationChanged', (conv) => {
      this.renderConversation(conv);
    });
    this.eventBus.on('writerModeChanged', ({ active }) => {
      this.toggleWriterModeUI(active);
    });
  }

  setupEventListeners() {
    if (this.sendBtn) {
      this.sendBtn.addEventListener('click', () => this.sendMessage());
    }
    if (this.userInput) {
      this.userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });
      this.userInput.addEventListener('input', (e) => {
        adjustTextareaHeight(e.target);
      });
    }

    const newChatBtn = document.getElementById('new-chat-btn');
    if (newChatBtn) newChatBtn.addEventListener('click', () => this.facade.startNewChat());

    const clearAllBtn = document.getElementById('clear-all-history');
    if (clearAllBtn) clearAllBtn.addEventListener('click', () => window.clearConversationHistory?.());

    const historyToggle = document.getElementById('history-toggle');
    if (historyToggle) {
      historyToggle.addEventListener('click', () => this.toggleHistory());
    }

    // Sidebar toggles
    const headerToggle = document.getElementById('sidebar-toggle-header');
    const footerToggle = document.getElementById('sidebar-toggle-footer');
    if (headerToggle) headerToggle.addEventListener('click', () => this.toggleSidebar());
    if (footerToggle) footerToggle.addEventListener('click', () => this.toggleSidebar());
    if (this.mobileOverlay) this.mobileOverlay.addEventListener('click', () => this.toggleSidebar());
  }

  async sendMessage() {
    const text = this.userInput?.value.trim();
    if (!text) return;
    if (this.userInput) this.userInput.value = '';
    this.resetTextareaHeight();
    await this.facade.sendMessage(text);
  }

  appendMessage(message) {
    if (!this.chatBox) return;
    const wrapper = document.createElement('div');
    wrapper.className = `message-wrapper ${message.sender}`;
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    if (message.sender === 'ai') {
      contentDiv.innerHTML = enhancedFormatResponse(message.content);
    } else {
      contentDiv.textContent = message.content;
    }
    wrapper.appendChild(contentDiv);
    this.chatBox.appendChild(wrapper);
    scrollToBottom(this.chatBox);
  }

  renderConversation(conv) {
    if (!this.chatBox) return;
    this.chatBox.innerHTML = '';
    if (!conv || conv.messages.length === 0) {
      this.chatBox.innerHTML = `<div class="empty-state">
        <img class="icon-format" src="icon_AI.png" alt="AI">
        <p>Welcome, I'm Andrea</p>
        <p>Select a conversation from history or start a new one.</p>
      </div>`;
      return;
    }
    conv.messages.forEach(msg => this.appendMessage(msg));
  }

  toggleWriterModeUI(active) {
    const chatSection = document.getElementById('chat-section');
    const writerSection = document.getElementById('writer-mode-section');
    if (chatSection) chatSection.style.display = active ? 'none' : 'block';
    if (writerSection) writerSection.style.display = active ? 'block' : 'none';
  }

  toggleSidebar() {
    if (!this.sidebar) return;
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      this.sidebar.classList.toggle('active');
      if (this.mobileOverlay) this.mobileOverlay.classList.toggle('active');
    } else {
      this.sidebar.classList.toggle('collapsed');
    }
  }

  toggleHistory() {
    const content = document.getElementById('history-content');
    const icon = document.getElementById('history-icon');
    if (content) {
      const expanded = content.style.display !== 'none';
      content.style.display = expanded ? 'none' : 'block';
      if (icon) icon.style.transform = expanded ? 'rotate(0deg)' : 'rotate(-90deg)';
    }
  }

  resetTextareaHeight() {
    if (this.userInput) this.userInput.style.height = 'auto';
  }

  showNotification(msg, type = 'info') {
    const n = document.createElement('div');
    n.className = `notification ${type}`;
    n.textContent = msg;
    n.style.cssText = `
      position: fixed; top: 20px; right: 20px;
      background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'};
      color: white; padding: 12px 24px; border-radius: 8px;
      z-index: 10000; animation: slideIn 0.3s;
    `;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 3000);
  }
}