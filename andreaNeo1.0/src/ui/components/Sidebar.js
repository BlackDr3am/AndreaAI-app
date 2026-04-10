export class Sidebar {
  constructor(eventBus, conversationRepo, writerHistoryRepo, facade) {
    this.eventBus = eventBus;
    this.conversationRepo = conversationRepo;
    this.writerHistoryRepo = writerHistoryRepo;
    this.facade = facade;
    this.init();
  }

  init() {
    this.renderConversations();
    this.renderWriterHistory();
    this.eventBus.on('conversationChanged', () => this.renderConversations());
    this.eventBus.on('writerTextGenerated', () => this.renderWriterHistory());
    this.setupDeleteButtons();
  }

  renderConversations() {
    const list = document.getElementById('conversation-history-list');
    if (!list) return;
    const conversations = this.conversationRepo.getAll();
    if (conversations.length === 0) {
      list.innerHTML = '<div class="text-center p-3 opacity-50">Sin historial</div>';
      return;
    }
    list.innerHTML = conversations.map(conv => `
      <div class="conversation-item" data-id="${conv.id}">
        <div class="conv-info">
          <i class="far fa-comment-alt"></i>
          <div class="conv-details">
            <span class="conv-title">${this.escapeHtml(conv.title)}</span>
            <span class="conv-time">${new Date(conv.timestamp).toLocaleTimeString()}</span>
          </div>
        </div>
        <button class="btn-delete-conv" data-id="${conv.id}" title="Borrar">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `).join('');
    this.attachConversationEvents(list);
  }

  attachConversationEvents(container) {
    container.querySelectorAll('.conversation-item').forEach(item => {
      const id = item.dataset.id;
      const deleteBtn = item.querySelector('.btn-delete-conv');
      deleteBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('¿Borrar esta conversación?')) {
          this.facade.deleteConversation(id);
        }
      });
      item.addEventListener('click', () => {
        this.facade.loadConversation(id);
      });
    });
  }

  renderWriterHistory() {
    const list = document.getElementById('writer-history-list-sidebar');
    if (!list) return;
    const history = this.writerHistoryRepo.getAll();
    if (history.length === 0) {
      list.innerHTML = '<div class="empty">No hay conversaciones</div>';
      return;
    }
    list.innerHTML = history.map(conv => `
      <div class="writer-history-item" data-id="${conv.id}">
        <span class="writer-history-prompt">${this.escapeHtml(conv.prompt.substring(0, 30))}${conv.prompt.length > 30 ? '...' : ''}</span>
        <span class="writer-history-time">${new Date(conv.timestamp).toLocaleTimeString()}</span>
        <button class="writer-delete-btn" data-id="${conv.id}" title="Eliminar"><i class="fas fa-trash-alt"></i></button>
      </div>
    `).join('');
    this.attachWriterEvents(list);
  }

  attachWriterEvents(container) {
    container.querySelectorAll('.writer-history-item').forEach(item => {
      const id = item.dataset.id;
      const deleteBtn = item.querySelector('.writer-delete-btn');
      deleteBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('¿Eliminar esta conversación del modo escritora?')) {
          this.writerHistoryRepo.delete(id);
          this.renderWriterHistory();
        }
      });
      item.addEventListener('click', () => {
        const conv = this.writerHistoryRepo.findById(id);
        if (conv) this.facade.enterWriterMode(conv.prompt, true);
      });
    });
  }

  setupDeleteButtons() {
    // Ya manejado en los eventos específicos
  }

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}