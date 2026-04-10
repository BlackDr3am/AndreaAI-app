import { Conversation } from '../../core/entities/Conversation.js';

export class StartNewChatUseCase {
  constructor(facade, conversationRepo) {
    this.facade = facade;
    this.conversationRepo = conversationRepo;
  }

  execute() {
    const newId = this.facade.idGenerator.generate();
    const newConv = new Conversation(newId, 'Nueva Conversación', [], Date.now());
    this.facade.setCurrentConversation(newConv);
    this.conversationRepo.save(newConv);
    return newConv;
  }
}