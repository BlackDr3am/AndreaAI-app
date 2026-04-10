export class DeleteConversationUseCase {
  constructor(facade, conversationRepo) {
    this.facade = facade;
    this.conversationRepo = conversationRepo;
  }

  execute(id) {
    this.conversationRepo.delete(id);
    if (this.facade.currentConversation && this.facade.currentConversation.id === id) {
      this.facade.startNewChat();
    }
  }
}