export class GenerateWriterTextUseCase {
  constructor(facade, apiClient, writerHistoryRepo, idGenerator) {
    this.facade = facade;
    this.apiClient = apiClient;
    this.writerHistoryRepo = writerHistoryRepo;
    this.idGenerator = idGenerator;
  }

  async execute(prompt) {
    const systemMessage = "Eres Andrea en modo escritora. Genera únicamente el texto solicitado, sin añadir explicaciones.";
    const response = await this.apiClient.chat([
      { role: 'system', content: systemMessage },
      { role: 'user', content: prompt }
    ]);
    this.facade.writerOutput = response;
    // Guardar en historial
    const conv = {
      id: this.idGenerator.generate(),
      prompt,
      output: response,
      timestamp: Date.now()
    };
    this.writerHistoryRepo.save(conv);
    this.facade.eventBus.emit('writerTextGenerated', { prompt, output: response });
    return response;
  }
}