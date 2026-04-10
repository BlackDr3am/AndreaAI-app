export class ExportConversationUseCase {
  constructor(facade, conversationRepo) {
    this.facade = facade;
    this.conversationRepo = conversationRepo;
  }

  execute() {
    const data = {
      conversation: this.facade.currentConversation?.toJSON(),
      personality: this.facade.personality.getSnapshot(),
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `andrea_export_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}