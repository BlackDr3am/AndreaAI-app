// ChatFacade.js - Simplifica la interacción entre UI y subsistemas
import { Message } from '../../core/entities/Message.js';
import { Conversation } from '../../core/entities/Conversation.js';
import { SendMessageUseCase } from '../use-cases/SendMessageUseCase.js';
import { StartNewChatUseCase } from '../use-cases/StartNewChatUseCase.js';
import { LoadConversationUseCase } from '../use-cases/LoadConversationUseCase.js';
import { DeleteConversationUseCase } from '../use-cases/DeleteConversationUseCase.js';
import { EnterWriterModeUseCase } from '../use-cases/EnterWriterModeUseCase.js';
import { GenerateWriterTextUseCase } from '../use-cases/GenerateWriterTextUseCase.js';
import { ExportConversationUseCase } from '../use-cases/ExportConversationUseCase.js';

export class ChatFacade {
  constructor(eventBus, personalitySystem, openRouterClient, supabaseClient,
              conversationRepo, writerHistoryRepo, idGenerator) {
    this.eventBus = eventBus;
    this.personality = personalitySystem;
    this.openRouter = openRouterClient;
    this.supabase = supabaseClient;
    this.conversationRepo = conversationRepo;
    this.writerHistoryRepo = writerHistoryRepo;
    this.idGenerator = idGenerator;

    this.currentConversation = null;
    this.writerModeActive = false;
    this.writerPrompt = '';
    this.writerOutput = '';
  }

  async sendMessage(userText) {
    const useCase = new SendMessageUseCase(
      this, this.personality, this.openRouter, this.supabase,
      this.conversationRepo, this.idGenerator
    );
    return await useCase.execute(userText);
  }

  startNewChat() {
    const useCase = new StartNewChatUseCase(this, this.conversationRepo);
    return useCase.execute();
  }

  loadConversation(id) {
    const useCase = new LoadConversationUseCase(this, this.conversationRepo);
    return useCase.execute(id);
  }

  deleteConversation(id) {
    const useCase = new DeleteConversationUseCase(this, this.conversationRepo);
    return useCase.execute(id);
  }

  enterWriterMode(prompt, autoGenerate = true) {
    const useCase = new EnterWriterModeUseCase(this);
    return useCase.execute(prompt, autoGenerate);
  }

  async generateWriterText(prompt) {
    const useCase = new GenerateWriterTextUseCase(this, this.openRouter, this.writerHistoryRepo, this.idGenerator);
    return await useCase.execute(prompt);
  }

  exportConversation() {
    const useCase = new ExportConversationUseCase(this, this.conversationRepo);
    return useCase.execute();
  }

  exitWriterMode() {
    this.writerModeActive = false;
    this.eventBus.emit('writerModeChanged', { active: false });
  }

  // Métodos auxiliares para los casos de uso
  setCurrentConversation(conv) {
    this.currentConversation = conv;
    this.eventBus.emit('conversationChanged', conv);
  }

  addMessageToCurrent(sender, content) {
    if (!this.currentConversation) {
      this.startNewChat();
    }
    const message = new Message(this.idGenerator.generate(), sender, content, Date.now());
    this.currentConversation.addMessage(message);
    this.conversationRepo.save(this.currentConversation);
    this.eventBus.emit('messageAdded', message);
  }

  getCurrentMessages() {
    return this.currentConversation ? this.currentConversation.messages : [];
  }
}