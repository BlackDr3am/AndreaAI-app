export class LoadConversationUseCase {
  constructor(facade, conversationRepo) {
    this.facade = facade;
    this.conversationRepo = conversationRepo;
  }

  execute(id) {
    const conv = this.conversationRepo.findById(id);
    if (conv) {
      this.facade.setCurrentConversation(conv);
    }
    return conv;
  }
}