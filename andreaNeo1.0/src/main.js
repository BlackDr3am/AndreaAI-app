// main.js - Punto de entrada con funciones globales
import { EventBus } from './application/services/EventBus.js';
import { ChatFacade } from './application/services/ChatFacade.js';
import { PersonalitySystem } from './core/services/PersonalitySystem.js';
import { DeepThinking } from './core/services/thinking/DeepThinking.js';
import { OpenRouterClient } from './infrastructure/api/OpenRouterClient.js';
import { SupabaseClient } from './infrastructure/api/SupabaseClient.js';
import { ConversationRepository } from './infrastructure/repositories/ConversationRepository.js';
import { WriterHistoryRepository } from './infrastructure/repositories/WriterHistoryRepository.js';
import { PersonalityConfigRepository } from './infrastructure/repositories/PersonalityConfigRepository.js';
import { StorageRepository } from './infrastructure/repositories/StorageRepository.js';
import { IdGenerator } from './infrastructure/services/IdGenerator.js';
import { UIHelper } from './ui/helpers/UIHelper.js';
import { TypingEffect } from './ui/helpers/TypingEffect.js';
import { WriterEffect } from './ui/helpers/WriterEffect.js';
import { ThemeManager } from './ui/ThemeManager.js';
import { ToolSystem } from './plugins/ToolSystem.js';
import { config } from './shared/constants/config.js';

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Repositorios
  const storageRepo = new StorageRepository();
  const conversationRepo = new ConversationRepository(storageRepo);
  const writerHistoryRepo = new WriterHistoryRepository(storageRepo);
  const personalityConfigRepo = new PersonalityConfigRepository(storageRepo);

  // Servicios externos
  const openRouterClient = new OpenRouterClient(config.openRouter);
  const supabaseClient = new SupabaseClient(config.supabase);

  // EventBus (Singleton)
  const eventBus = EventBus.getInstance();

  // Sistema de personalidad
  const thinkingStrategy = new DeepThinking();
  const personalitySystem = new PersonalitySystem(eventBus, thinkingStrategy, personalityConfigRepo);

  // Fachada
  const chatFacade = new ChatFacade(
    eventBus, personalitySystem, openRouterClient, supabaseClient,
    conversationRepo, writerHistoryRepo, IdGenerator
  );

  // UI Helpers
  const typingEffect = new TypingEffect(3);
  const writerEffect = new WriterEffect(3);
  const uiHelper = new UIHelper(chatFacade, typingEffect, writerEffect, eventBus);

  // Theme y Tools (los componentes Sidebar y WriterModePanel son opcionales si el HTML ya tiene la estructura)
  const themeManager = new ThemeManager(storageRepo);
  const toolSystem = new ToolSystem(storageRepo, eventBus, themeManager, chatFacade);

  // Inicializar
  uiHelper.init();
  themeManager.applyTheme();
  toolSystem.init();
  chatFacade.startNewChat();

  // Registrar funciones globales que el HTML espera
  window.toggleTheme = () => themeManager.toggleTheme();
  window.toggleSidebar = () => uiHelper.toggleSidebar();
  window.resetAll = () => chatFacade.startNewChat();
  window.copyCodeToClipboard = (btn) => {
    const codeBlock = btn.closest('.code-block-wrapper')?.querySelector('code');
    if (codeBlock) {
      navigator.clipboard.writeText(codeBlock.textContent);
      btn.textContent = '✅ Copiado!';
      setTimeout(() => btn.textContent = '📋 Copiar', 2000);
    }
  };
  window.clearConversationHistory = () => {
    if (confirm('¿Eliminar todo el historial?')) {
      conversationRepo.clear();
      chatFacade.startNewChat();
      uiHelper.showNotification('Historial eliminado', 'info');
    }
  };
  window.toggleNightMode = () => toolSystem.toggleNightMode();
  window.toggleFocusMode = () => toolSystem.toggleFocusMode();
  window.toggleQuickTheme = () => toolSystem.cycleQuickTheme();
  window.setTheme = (mode) => themeManager.setTheme(mode);
  window.clearBackground = () => themeManager.clearBackground();
  window.applyBackgroundPreset = (preset) => themeManager.applyBackgroundPreset(preset);

  console.log('✅ AndreaAI con arquitectura de patrones lista');
});