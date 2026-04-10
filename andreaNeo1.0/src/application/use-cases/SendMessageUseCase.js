// SendMessageUseCase.js
export class SendMessageUseCase {
  constructor(facade, personality, apiClient, supabase, conversationRepo, idGenerator) {
    this.facade = facade;
    this.personality = personality;
    this.apiClient = apiClient;
    this.supabase = supabase;
    this.conversationRepo = conversationRepo;
    this.idGenerator = idGenerator;
  }

  async execute(userText) {
    // Guardar en Supabase si usuario autenticado
    if (this.supabase.currentUser) {
      await this.supabase.saveQuestion(userText);
    }

    // Añadir mensaje del usuario a la UI (la fachada emite evento)
    this.facade.addMessageToCurrent('user', userText);

    // Analizar emoción y aprender
    this.personality.analyzeUserMood(userText);

    // Construir contexto y llamar a la API
    const systemPrompt = this.personality.getSystemPrompt();
    const messages = [
      { role: 'system', content: systemPrompt },
      ...this.facade.getCurrentMessages().slice(-12).map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.content
      }))
    ];
    const aiResponse = await this.apiClient.chat(messages);
    const enhanced = this.personality.enhanceResponse(aiResponse, userText);

    // Mostrar respuesta con efecto máquina de escribir
    this.facade.eventBus.emit('aiResponseReady', { text: enhanced });

    // Guardar mensaje de IA
    this.facade.addMessageToCurrent('ai', enhanced);

    return enhanced;
  }
}