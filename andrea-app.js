// andrea-app.js - Versión 5.6 "Supabase integrado con corrección de null"
// Creado por: IsaDetaSeek

// ========== CONFIGURACIÓN DE SUPABASE (GLOBAL) ==========
const SUPABASE_URL = 'https://hhdcobkizdzpqbcdpnea.supabase.co';   // <- REEMPLAZA CON TU URL
const SUPABASE_ANON_KEY = 'sb_publishable_8QakOu7YlXMKq2nSRjBocw_ap3zVPmQ'; // <- REEMPLAZA CON TU ANON KEY

// Inicializar cliente de Supabase y guardarlo en window con nombre único
if (!window._supabaseClient) {
    window._supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
window.supabaseClient = window._supabaseClient;  // Variable global limpia

// ========== CLASE PRINCIPAL ==========
class AndreaApp {
    constructor() {
        // ---------- Estado interno ----------
        this.state = {
            messages: [],
            isTyping: false,
            currentConversationId: null,
            historyExpanded: true,
            typingEffectInterval: null,
            writerInterval: null
        };

        // Configuración de API (la clave por defecto está ofuscada)
        const savedModel = localStorage.getItem('andrea_selected_model') || 'openrouter/free';
        const defaultApiKey = atob('c2stb3ItdjEtYjYyMmEwYTFlYjg3MjcxMzg3ZmM3ZjJmMjQxYmQ2MGMyNGMxN2UxMGY1NGIyZWI2ZTI0YTY4NjZlZTUwMWY3ZA==');
        const savedApiKey = localStorage.getItem('andrea_api_key') || defaultApiKey;

        this.apiConfig = {
            apiKey: savedApiKey,
            model: savedModel,
            baseUrl: 'https://openrouter.ai/api/v1/chat/completions',
            temperature: 0.7,
            maxTokens: 7000
        };

        // Sistemas externos
        this.personality = new PersonalitySystem();

        this.conversationMetrics = {
            engagementLevel: 0,
            topicDepth: {},
            userInterestAreas: [],
            responseQuality: [],
            conversationStart: Date.now(),
            messageCount: 0,
            averageResponseTime: 0,
            emotionTimeline: []
        };

        this.learningSystem = {
            interactionPatterns: {},
            responseEffectiveness: [],
            userFeedbackMemory: [],
            adaptationRate: 0.1
        };

        this.currentUserId = this.getOrCreateUserId();

        // Historial de conversaciones normales
        this.conversationHistory = [];

        // Modo Escritora
        this.writerMode = {
            active: false,
            history: [],
            currentConversationId: null,
            prompt: '',
            output: ''
        };

        // Inicializar helpers
        this.ui = new UIHelper(this);
        this.typingEffect = new TypingEffect(this);
        this.writerEffect = new WriterEffect(this);

        // Supabase
        this.supabase = window.supabaseClient;
        this.currentUser = null;

        this.init();
    }

    // ========== INICIALIZACIÓN ==========
    init() {
        this.setupEventListeners();
        this.setupAdminControls();
        this.loadConversationHistory();
        this.setupThinkingControls();
        this.setupPersonalityControls();
        this.loadThemeConfig();
        this.updateModelDisplay();
        this.loadWriterHistory();
        this.initSupabaseAuth();
        console.log('🚀 AndreaApp Ready - Engine:', this.apiConfig.model);
        console.log('🧠 Personality System Loaded:', this.personality.getPersonalitySnapshot());
    }

    initSupabaseAuth() {
        // Escuchar cambios en la sesión
        this.supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                this.currentUser = session.user;
                this.ui.updateAuthUI(this.currentUser);
                console.log('✅ Usuario autenticado:', this.currentUser.email);
            } else {
                this.currentUser = null;
                this.ui.updateAuthUI(null);
                console.log('🔓 Usuario no autenticado');
            }
        });

        // Verificar sesión actual
        this.supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                this.currentUser = session.user;
                this.ui.updateAuthUI(this.currentUser);
            }
        });
    }

    getOrCreateUserId() {
        let userId = localStorage.getItem('andrea_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('andrea_user_id', userId);
        }
        return userId;
    }

    updateModelDisplay() {
        const display = document.getElementById('current-model-display');
        if (display) display.textContent = this.apiConfig.model;
    }

    loadThemeConfig() {
        const savedTheme = localStorage.getItem('andrea_theme') || 'dark';
        document.body.classList.add(`${savedTheme}-theme`);
    }

    // ========== CONFIGURACIÓN DE CONTROLES ==========
    setupAdminControls() {
        const displayBadge = document.getElementById('current-model-display');
        const currentModel = this.apiConfig.model;
        if (displayBadge) displayBadge.textContent = currentModel;
    }

    setupThinkingControls() {
        const thinkingBtn = document.getElementById('toggle-thinking');
        if (thinkingBtn) {
            thinkingBtn.addEventListener('click', () => {
                const isNowOn = this.personality.toggleThinkingMode();
                thinkingBtn.classList.toggle('active', isNowOn);
                this.ui.showNotification(`Pensamiento profundo ${isNowOn ? 'activado' : 'desactivado'}`, 'info');
            });
            thinkingBtn.classList.toggle('active', this.personality.thinkingMode);
        }
    }

    setupPersonalityControls() {
        const diagBtn = document.getElementById('personality-diagnostic');
        if (diagBtn) {
            diagBtn.addEventListener('click', () => this.showPersonalityDiagnostic());
        }

        const thinkingLevelSelect = document.getElementById('thinking-level-select');
        if (thinkingLevelSelect) {
            thinkingLevelSelect.value = this.personality.thinkingLevel;
            thinkingLevelSelect.addEventListener('change', (e) => {
                this.personality.setThinkingLevel(e.target.value);
                this.ui.showNotification(`Modo de pensamiento cambiado a: ${e.target.value}`, 'success');
            });
        }

        const humorBtn = document.getElementById('toggle-humor');
        if (humorBtn) {
            humorBtn.addEventListener('click', () => {
                const currentHumor = this.personality.personalityTraits.humor;
                const newHumor = currentHumor === 0 ? 0.7 : 0;
                this.personality.personalityTraits.humor = newHumor;
                humorBtn.classList.toggle('active', newHumor > 0);
                this.personality.saveConfig();
                this.ui.showNotification(`Humor ${newHumor > 0 ? 'activado' : 'desactivado'}`, 'info');
            });
            humorBtn.classList.toggle('active', this.personality.personalityTraits.humor > 0);
        }
    }

    showPersonalityDiagnostic() {
        const snapshot = this.personality.getPersonalitySnapshot();
        const diagnostics = this.personality.getDiagnostics();

        const modal = document.createElement('div');
        modal.className = 'personality-modal';
        modal.style = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #1a1a2e;
            border: 2px solid #4cc9f0;
            border-radius: 15px;
            padding: 25px;
            z-index: 10000;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            color: white;
            font-family: Arial, sans-serif;
        `;

        modal.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="color: #4cc9f0; margin: 0;">🧠 Diagnóstico de Personalidad</h2>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: #fff; font-size: 24px; cursor: pointer;">×</button>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h3 style="color: #72efdd;">Estado Emocional</h3>
                <p>${snapshot.emotion.description}</p>
                <div style="background: #16213e; padding: 10px; border-radius: 8px; margin-top: 10px;">
                    Intensidad: ${Math.round(snapshot.emotion.intensity * 100)}%
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h3 style="color: #72efdd;">Rasgos de Personalidad</h3>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                    ${Object.entries(snapshot.traits).map(([trait, value]) => `
                        <div style="background: #16213e; padding: 8px; border-radius: 6px;">
                            <div style="display: flex; justify-content: space-between;">
                                <span>${trait}:</span>
                                <span>${Math.round(value * 100)}%</span>
                            </div>
                            <div style="height: 6px; background: #0f3460; border-radius: 3px; margin-top: 5px;">
                                <div style="height: 100%; width: ${value * 100}%; background: #4cc9f0; border-radius: 3px;"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h3 style="color: #72efdd;">Estadísticas de Memoria</h3>
                <p>Hechos recordados: ${diagnostics.memoryStats.totalFacts}</p>
                <p>Preferencias detectadas: ${diagnostics.memoryStats.totalPreferences}</p>
                <p>Temas aprendidos: ${diagnostics.memoryStats.learnedTopics}</p>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h3 style="color: #72efdd;">Métricas de Conversación</h3>
                <p>Mensajes en esta sesión: ${this.conversationMetrics.messageCount}</p>
                <p>Nivel de engagement: ${Math.round(this.conversationMetrics.engagementLevel * 100)}%</p>
            </div>
            
            <button onclick="window.app.resetPersonality()" style="background: #e63946; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 10px;">
                Reiniciar Personalidad
            </button>
        `;

        document.body.appendChild(modal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    resetPersonality() {
        if (confirm('¿Estás seguro de querer reiniciar la personalidad de Andrea? Se perderán todos los datos aprendidos.')) {
            localStorage.removeItem('andrea_personality_config');
            this.personality = new PersonalitySystem();
            this.ui.showNotification('Personalidad reiniciada', 'info');
            document.querySelector('.personality-modal')?.remove();
        }
    }

    // ========== EVENT LISTENERS ==========
    setupEventListeners() {
        // Enviar mensaje
        const sendBtn = document.getElementById('send-btn');
        const userInput = document.getElementById('user-input');
        if (sendBtn) sendBtn.addEventListener('click', () => this.sendMessage());
        if (userInput) {
            userInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
            userInput.addEventListener('input', (e) => {
                this.ui.adjustTextareaHeight(e.target);
            });
        }

        // Botón Nuevo Chat
        const newChatBtn = document.getElementById('new-chat-btn');
        if (newChatBtn) newChatBtn.addEventListener('click', () => this.startNewChat());

        // Colapsar historial
        const historyToggle = document.getElementById('history-toggle');
        if (historyToggle) historyToggle.addEventListener('click', () => this.toggleHistoryUI());

        // Borrar todo el historial
        const clearAllBtn = document.getElementById('clear-all-history');
        if (clearAllBtn) clearAllBtn.addEventListener('click', () => this.clearFullHistory());

        // Sidebar toggles
        const toggles = [
            document.getElementById('sidebar-toggle-header'),
            document.getElementById('sidebar-toggle-footer'),
            document.getElementById('mobile-overlay')
        ];
        toggles.forEach(t => {
            if (t) t.addEventListener('click', () => this.toggleSidebarUI());
        });

        // Delegación de eventos para el historial normal
        const historyList = document.getElementById('conversation-history-list');
        if (historyList) {
            historyList.addEventListener('click', (e) => {
                const deleteBtn = e.target.closest('.btn-delete-conv');
                if (deleteBtn) {
                    e.stopPropagation();
                    this.deleteConversation(deleteBtn.dataset.id);
                    return;
                }

                const convItem = e.target.closest('.conversation-item');
                if (convItem && !e.target.closest('.btn-delete-conv')) {
                    const id = convItem.dataset.convId;
                    if (id) this.loadConversation(id);
                }
            });
        }

        // --- Eventos del Modo Escritora ---
        const writerGenerateBtn = document.getElementById('writer-generate-btn');
        if (writerGenerateBtn) writerGenerateBtn.addEventListener('click', () => this.generateWriterText());

        const exitWriterBtn = document.getElementById('exit-writer-mode');
        if (exitWriterBtn) exitWriterBtn.addEventListener('click', () => this.exitWriterMode());

        const copyWriterBtn = document.getElementById('copy-writer-output');
        if (copyWriterBtn) copyWriterBtn.addEventListener('click', () => {
            const output = document.getElementById('writer-output').innerText;
            navigator.clipboard.writeText(output).then(() => {
                this.ui.showNotification('Texto copiado', 'success');
            });
        });

        // Delegación para el historial del modo escritora en sidebar
        const writerHistorySidebar = document.getElementById('writer-history-list-sidebar');
        if (writerHistorySidebar) {
            writerHistorySidebar.addEventListener('click', (e) => {
                const deleteBtn = e.target.closest('.writer-delete-btn');
                if (deleteBtn) {
                    e.stopPropagation();
                    const id = deleteBtn.dataset.id;
                    this.deleteWriterConversation(id);
                    return;
                }

                const item = e.target.closest('.writer-history-item');
                if (item && !e.target.closest('.writer-delete-btn')) {
                    const id = item.dataset.id;
                    this.loadWriterConversation(id);
                }
            });
        }

        // Botón nueva conversación escritora
        const newWriterChat = document.getElementById('new-writer-chat');
        if (newWriterChat) {
            newWriterChat.addEventListener('click', () => {
                this.enterWriterMode('');
            });
        }

        // Toggle para colapsar sección de escritora en sidebar
        const writerModeToggle = document.getElementById('writer-mode-toggle');
        if (writerModeToggle) {
            writerModeToggle.addEventListener('click', () => {
                const content = document.getElementById('writer-mode-content');
                const icon = document.getElementById('writer-mode-icon');
                const expanded = content.style.display !== 'none';
                content.style.display = expanded ? 'none' : 'block';
                icon.style.transform = expanded ? 'rotate(0deg)' : 'rotate(-90deg)';
            });
        }

        // Botón de logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) logoutBtn.addEventListener('click', () => this.logout());
    }

    // ========== MÉTODOS DE AUTENTICACIÓN ==========
    async logout() {
        const { error } = await this.supabase.auth.signOut();
        if (error) {
            console.error('Error al cerrar sesión:', error);
            this.ui.showNotification(error.message, 'error');
        } else {
            this.ui.showNotification('Sesión cerrada', 'success');
            // Recargar la página para resetear el estado
            window.location.href = 'login_register.html';
        }
    }

    // ========== GUARDAR PREGUNTA EN SUPABASE ==========
    async saveUserQuestion(question) {
        if (!this.currentUser) {
            console.log('Usuario no autenticado, no se guarda pregunta');
            return;
        }
        try {
            const { data, error } = await this.supabase
                .from('user_questions')
                .insert({
                    user_id: this.currentUser.id,
                    email: this.currentUser.email,
                    question: question
                });
            if (error) {
                console.error('Error guardando pregunta:', error);
            } else {
                console.log('Pregunta guardada en Supabase');
            }
        } catch (err) {
            console.error('Excepción guardando pregunta:', err);
        }
    }

    // ========== MÉTODOS DE INTERFAZ (UI) ==========
    toggleSidebarUI() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('mobile-overlay');
        if (window.innerWidth > 768) {
            sidebar.classList.toggle('collapsed');
        } else {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        }
    }

    toggleHistoryUI() {
        const content = document.getElementById('history-content');
        const icon = document.getElementById('history-icon');
        this.state.historyExpanded = !this.state.historyExpanded;
        if (content) content.style.display = this.state.historyExpanded ? 'block' : 'none';
        if (icon) icon.style.transform = this.state.historyExpanded ? 'rotate(0deg)' : 'rotate(-90deg)';
    }

    // ========== LÓGICA DE MENSAJES ==========
    async sendMessage() {
        const input = document.getElementById('user-input');
        const text = input.value.trim();
        if (!text || this.state.isTyping) return;

        // Detectar si es solicitud de modo escritora
        if (this.detectWriterModeRequest(text)) {
            this.showWriterModePrompt(text);
            input.value = '';
            return;
        }

        await this.sendMessageNormal(text);
    }

    async sendMessageNormal(text) {
        const input = document.getElementById('user-input');
        input.value = '';

        // Guardar pregunta en Supabase si el usuario está autenticado
        await this.saveUserQuestion(text);

        // Añadir mensaje del usuario inmediatamente
        this.appendMessage('user', text);
        this.state.isTyping = true;

        const userEmotion = this.personality.analyzeUserMood(text);
        this.conversationMetrics.messageCount++;
        this.conversationMetrics.engagementLevel += text.length > 50 ? 0.15 : 0.08;
        this.conversationMetrics.emotionTimeline.push({
            timestamp: Date.now(),
            userEmotion,
            intensity: this.personality.emotions.intensity
        });

        this.learnFromUserMessage(text, userEmotion);
        this.ui.showTypingIndicator();

        try {
            const response = await this.fetchAIResponse(text);
            this.ui.hideTypingIndicator();
            const enhancedResponse = this.personality.enhanceResponseWithPersonality(
                response,
                text,
                this.currentUserId
            );
            // Usar efecto máquina de escribir
            this.typingEffect.typeMessage('ai', enhancedResponse);
            this.saveConversationHistory();
            this.learnFromAIResponse(enhancedResponse, text);
            this.personality.saveConfig(); // Guardar cambios de personalidad
        } catch (error) {
            this.ui.hideTypingIndicator();
            this.appendMessage('ai', "Lo siento, encontré un error conectándome con el motor. ¿Podrías intentarlo de nuevo? :(");
            console.error('Error en fetchAIResponse:', error);
        } finally {
            this.state.isTyping = false;
        }
    }

    async fetchAIResponse(userMessage) {
        const startTime = Date.now();
        const conversationContext = this.personality.analyzeConversationContext(this.state.messages);
        this.personality.adjustPersonalityBasedOnContext(conversationContext);
        this.personality.saveConfig(); // Guardar ajustes
        const systemPrompt = this.personality.generateSystemPrompt();

        const apiMessages = [{ role: "system", content: systemPrompt }];

        this.state.messages.slice(-12).forEach(m => {
            apiMessages.push({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.content
            });
        });

        const userFacts = this.personality.getUserFacts(this.currentUserId);
        if (userFacts.length > 0) {
            const recentFacts = userFacts.slice(-3);
            const memoryContext = recentFacts.map(f =>
                `[Recuerdo previo: "${f.fact.substring(0, 80)}..."]`
            ).join('\n');
            if (memoryContext) {
                apiMessages.splice(1, 0, {
                    role: "system",
                    content: `CONTEXTO DE MEMORIA DEL USUARIO:\n${memoryContext}\n\nUsa esta información para personalizar tu respuesta cuando sea relevante.`
                });
            }
        }

        const response = await fetch(this.apiConfig.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiConfig.apiKey}`
            },
            body: JSON.stringify({
                model: this.apiConfig.model,
                messages: apiMessages,
                temperature: this.apiConfig.temperature,
                max_tokens: this.apiConfig.maxTokens
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        const responseTime = Date.now() - startTime;
        this.conversationMetrics.averageResponseTime =
            (this.conversationMetrics.averageResponseTime * (this.conversationMetrics.messageCount - 1) + responseTime)
            / this.conversationMetrics.messageCount;

        this.extractAndRememberFacts(userMessage, data.choices[0].message.content);
        return data.choices[0].message.content;
    }

    learnFromUserMessage(message, emotion) {
        const preferencePatterns = [
            { pattern: /me gusta|me encanta|adoro/i, type: 'like' },
            { pattern: /no me gusta|odio|detesto/i, type: 'dislike' },
            { pattern: /prefiero|mejor que/i, type: 'preference' },
            { pattern: /quiero aprender|me interesa|quiero saber/i, type: 'interest' }
        ];

        preferencePatterns.forEach(pattern => {
            if (pattern.pattern.test(message)) {
                const topic = this.extractTopicFromMessage(message);
                if (topic) {
                    this.personality.updateUserPreference(
                        this.currentUserId,
                        topic,
                        pattern.type === 'dislike' ? 'negative' : 'positive'
                    );
                }
            }
        });

        const factPatterns = [
            /(tengo|soy|estoy) (\w+ ){1,3}(años|año)/i,
            /(vivo en|soy de) (\w+ ){1,3}/i,
            /(estudio|trabajo en|soy) (\w+ ){1,3}/i,
            /(mi hobby|me gusta|disfruto) (\w+ ){1,3}/i
        ];

        factPatterns.forEach(pattern => {
            const match = message.match(pattern);
            if (match) {
                this.personality.rememberUserFact(
                    this.currentUserId,
                    match[0],
                    'personal',
                    0.9
                );
            }
        });
        this.personality.saveConfig(); // Guardar después de aprender
    }

    learnFromAIResponse(aiResponse, userMessage) {
        const responseLength = aiResponse.length;
        const hasCode = aiResponse.includes('```');
        const hasExamples = aiResponse.includes('ejemplo') || aiResponse.includes('por ejemplo');
        const hasEmotion = /:[D|)|(]|<3|💭|✨/.test(aiResponse);

        const effectivenessScore =
            (responseLength > 100 ? 0.3 : 0.1) +
            (hasCode ? 0.2 : 0) +
            (hasExamples ? 0.3 : 0) +
            (hasEmotion ? 0.2 : 0);

        this.learningSystem.responseEffectiveness.push({
            score: effectivenessScore,
            timestamp: Date.now(),
            userMessageLength: userMessage.length
        });

        if (this.learningSystem.responseEffectiveness.length > 50) {
            this.learningSystem.responseEffectiveness.shift();
        }

        let traitsChanged = false;
        if (effectivenessScore > 0.7) {
            if (hasCode) {
                this.personality.personalityTraits.detailOrientation += 0.02;
                traitsChanged = true;
            }
            if (hasExamples) {
                this.personality.personalityTraits.creativity += 0.02;
                traitsChanged = true;
            }
            if (hasEmotion) {
                this.personality.personalityTraits.empathy += 0.02;
                traitsChanged = true;
            }
        }
        if (traitsChanged) {
            this.personality.saveConfig();
        }
    }

    extractTopicFromMessage(message) {
        const words = message.toLowerCase().split(/\s+/);
        const importantWords = words.filter(word =>
            word.length > 4 &&
            !['gusta', 'encanta', 'quiero', 'aprender', 'saber', 'interesa'].includes(word)
        );
        return importantWords[0] || null;
    }

    extractAndRememberFacts(userMessage, aiResponse) {
        const factPatterns = [
            /(es |son |fue )([^.!?]+\.)/gi,
            /(El|La|Los|Las) ([^.!?]+) (es|son)/gi,
            /([A-Z][^.!?]+ funciona)/gi
        ];
        const extractedFacts = [];
        factPatterns.forEach(pattern => {
            const matches = aiResponse.match(pattern);
            if (matches) {
                matches.forEach(match => {
                    if (match.length > 20 && match.length < 200) {
                        extractedFacts.push(match);
                    }
                });
            }
        });
        if (extractedFacts.length > 0) {
            const topic = this.extractTopicFromMessage(userMessage) || 'general';
            extractedFacts.slice(0, 2).forEach(fact => {
                this.personality.rememberUserFact(
                    this.currentUserId,
                    fact,
                    topic,
                    0.7
                );
            });
            this.personality.saveConfig();
        }
    }

    appendMessage(sender, content, save = true) {
        const chatBox = document.getElementById('chat-box');
        const emptyState = chatBox.querySelector('.empty-state');
        if (emptyState) emptyState.remove();

        const wrapper = document.createElement('div');
        wrapper.className = `message-wrapper ${sender}`;

        if (sender === 'ai') {
            const emotion = this.personality.getCurrentEmotion();
            wrapper.setAttribute('data-emotion', emotion.name);
            wrapper.setAttribute('data-intensity', emotion.intensity.toFixed(2));
        }

        const formatted = sender === 'ai' ? this.enhancedFormatResponse(content) : content;
        wrapper.innerHTML = `<div class="message-content">${formatted}</div>`;
        chatBox.appendChild(wrapper);
        this.ui.scrollToBottom();

        if (save && (sender === 'user' || sender === 'ai')) {
            this.state.messages.push({ sender, content });
        }
    }

    enhancedFormatResponse(text) {
        let fmt = text
            .replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
                return `<div class="code-block-wrapper">
                    <div class="code-header">
                        <span class="code-lang">${lang || 'código'}</span>
                        <button class="copy-code-btn" onclick="copyCodeToClipboard(this)">📋 Copiar</button>
                    </div>
                    <pre><code>${this.escapeHtml(code)}</code></pre>
                </div>`;
            })
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
            .replace(/^\s*[\-\*]\s+(.+)$/gm, '<li>$1</li>')
            .replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
            .replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
            .replace(/^#\s+(.+)$/gm, '<h1>$1</h1>')
            .replace(/^\s*---\s*$/gm, '<hr>')
            .replace(/\n/g, '<br>');

        fmt = fmt.replace(/(<li>.*?<\/li>)+/g, (match) => {
            return `<ul>${match}</ul>`;
        });
        return fmt;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ========== GESTIÓN DEL HISTORIAL NORMAL ==========
    loadConversationHistory() {
        const saved = localStorage.getItem('andrea_conversation_history');
        this.conversationHistory = saved ? JSON.parse(saved) : [];
        this.renderConversationHistory();
    }

    saveConversationHistory() {
        if (this.state.messages.length === 0) return;

        const firstUserMsg = this.state.messages.find(m => m.sender === 'user');
        const title = firstUserMsg ? firstUserMsg.content.substring(0, 35) + '...' : 'Nueva Conversación';

        const conversation = {
            id: this.state.currentConversationId || Date.now().toString(),
            title: title,
            messages: [...this.state.messages],
            timestamp: new Date().toISOString(),
            metrics: {
                messageCount: this.state.messages.length,
                duration: Date.now() - this.conversationMetrics.conversationStart,
                topics: Array.from(this.personality.enhancedMemory?.learnedTopics || []).slice(-5)
            }
        };

        const index = this.conversationHistory.findIndex(c => String(c.id) === String(conversation.id));
        if (index !== -1) {
            this.conversationHistory[index] = conversation;
        } else {
            this.state.currentConversationId = conversation.id;
            this.conversationHistory.unshift(conversation);
        }

        localStorage.setItem('andrea_conversation_history', JSON.stringify(this.conversationHistory));
        this.renderConversationHistory();
    }

    renderConversationHistory() {
        const list = document.getElementById('conversation-history-list');
        if (!list) return;

        if (this.conversationHistory.length === 0) {
            list.innerHTML = '<div class="text-center p-3 opacity-50">Sin historial</div>';
            return;
        }

        list.innerHTML = this.conversationHistory.map(conv => {
            const date = new Date(conv.timestamp);
            const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const activeClass = String(this.state.currentConversationId) === String(conv.id) ? 'active' : '';
            return `
                <div class="conversation-item ${activeClass}" data-conv-id="${conv.id}">
                    <div class="conv-info">
                        <i class="far fa-comment-alt"></i>
                        <div class="conv-details">
                            <span class="conv-title">${conv.title}</span>
                            <span class="conv-time">${timeString} • ${conv.messages.length} mensajes</span>
                        </div>
                    </div>
                    <div class="conv-actions">
                        <button class="btn-delete-conv" data-id="${conv.id}" title="Borrar">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    loadConversation(id) {
        const conv = this.conversationHistory.find(c => String(c.id) === String(id));
        if (conv) {
            this.state.currentConversationId = conv.id;
            this.state.messages = [...conv.messages];
            this.conversationMetrics.conversationStart = new Date(conv.timestamp).getTime();
            this.conversationMetrics.messageCount = conv.messages.length;
            const chatBox = document.getElementById('chat-box');
            chatBox.innerHTML = '';
            this.displayMessages();
            this.renderConversationHistory();

            if (window.innerWidth <= 768) {
                this.toggleSidebarUI();
            }
        }
    }

    deleteConversation(id) {
        if (!confirm('¿Borrar esta conversación?')) return;
        this.conversationHistory = this.conversationHistory.filter(c => String(c.id) !== String(id));
        localStorage.setItem('andrea_conversation_history', JSON.stringify(this.conversationHistory));

        if (String(this.state.currentConversationId) === String(id)) {
            this.startNewChat();
        } else {
            this.renderConversationHistory();
        }
        this.ui.showNotification('Conversación eliminada', 'info');
    }

    clearFullHistory() {
        if (!confirm('¿Borrar TODO el historial?')) return;
        localStorage.removeItem('andrea_conversation_history');
        this.conversationHistory = [];
        this.startNewChat();
    }

    startNewChat() {
        this.state.messages = [];
        this.state.currentConversationId = null;
        this.conversationMetrics = {
            engagementLevel: 0,
            topicDepth: {},
            userInterestAreas: [],
            responseQuality: [],
            conversationStart: Date.now(),
            messageCount: 0,
            averageResponseTime: 0,
            emotionTimeline: []
        };
        const chatBox = document.getElementById('chat-box');
        chatBox.innerHTML = `
            <div class="empty-state">
                <img class="icon-format" src="icon_AI.png" alt="AI">
                <h2>Nueva Conversación</h2>
                <p>¡Hola! Soy Andrea, tu asistente con personalidad. ¿En qué puedo ayudarte hoy? :)</p>
                <div class="empty-state-tips">
                    <p><strong>💡 Consejos:</strong></p>
                    <ul>
                        <li>Pregúntame sobre cualquier tema</li>
                        <li>Pídeme que analice algo profundamente</li>
                        <li>Cuéntame tus preferencias para que pueda recordarlas</li>
                        <li>¡No dudes en pedir un chiste si quieres animar la conversación!</li>
                    </ul>
                </div>
            </div>`;
        this.renderConversationHistory();
    }

    displayMessages() {
        const chatBox = document.getElementById('chat-box');
        chatBox.innerHTML = '';
        this.state.messages.forEach(m => this.appendMessage(m.sender, m.content, false));
    }

    // ========== MÉTODOS DEL MODO ESCRITORA ==========
    detectWriterModeRequest(text) {
        const writerPatterns = [
            /\b(escribe|genera|crea|redacta)\s+(un|una|el|la)\s+(poema|cuento|historia|código|script|archivo|función|clase)\b/i,
            /\b(escribe|genera|crea|redacta)\s+(código|script|archivo)\s+(para|de)\b/i,
            /\b(quiero|necesito)\s+(que\s+escribas|que\s+generes|un\s+poema|un\s+código)\b/i,
            /\b(puedes\s+escribir|puedes\s+generar)\s+(un|una)\b/i,
            /\b(código\s+de\s+ejemplo|ejemplo\s+de\s+código)\b/i
        ];
        const lower = text.toLowerCase();
        return writerPatterns.some(pattern => pattern.test(lower));
    }

    showWriterModePrompt(originalText) {
        const modal = document.createElement('div');
        modal.className = 'writer-mode-prompt';
        modal.innerHTML = `
            <div class="writer-prompt-content">
                <p>¿Quieres que Andrea entre en el modo escritura para generar el texto con formato?</p>
                <div class="writer-prompt-buttons">
                    <button id="writer-prompt-yes">Sí, entrar al modo escritura</button>
                    <button id="writer-prompt-no">No, responder normalmente</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('writer-prompt-yes').addEventListener('click', () => {
            modal.remove();
            this.enterWriterMode(originalText);
        });

        document.getElementById('writer-prompt-no').addEventListener('click', () => {
            modal.remove();
            this.sendMessageNormal(originalText);
        });
    }

    enterWriterMode(prompt, autoGenerate = true) {
        this.writerMode.active = true;
        this.writerMode.prompt = prompt;
        document.getElementById('chat-section').style.display = 'none';
        document.getElementById('writer-mode-section').style.display = 'block';
        document.getElementById('writer-prompt').value = prompt;
        document.getElementById('writer-output').innerHTML = '';
        if (autoGenerate && prompt.trim()) {
            this.generateWriterText();
        }
    }

    exitWriterMode() {
        this.writerMode.active = false;
        document.getElementById('chat-section').style.display = 'block';
        document.getElementById('writer-mode-section').style.display = 'none';
    }

    async generateWriterText() {
        const prompt = document.getElementById('writer-prompt').value;
        if (!prompt) return;

        const outputDiv = document.getElementById('writer-output');
        outputDiv.innerHTML = '<p class="loading">Generando...</p>';

        const systemMessage = "Eres Andrea en modo escritora. Debes generar únicamente el texto solicitado por el usuario, sin añadir explicaciones, comentarios, ni ningún otro texto adicional. El usuario te dará instrucciones sobre qué escribir. Tú debes responder exclusivamente con el contenido solicitado, en el formato apropiado (texto plano, código, JSON, etc.). No uses markdown ni formato adicional a menos que se te pida explícitamente.";
        const apiMessages = [
            { role: "system", content: systemMessage },
            { role: "user", content: prompt }
        ];

        try {
            const response = await fetch(this.apiConfig.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiConfig.apiKey}`
                },
                body: JSON.stringify({
                    model: this.apiConfig.model,
                    messages: apiMessages,
                    temperature: 0.5,
                    max_tokens: 4000
                })
            });

            if (!response.ok) throw new Error(`API error: ${response.status}`);

            const data = await response.json();
            const generatedText = data.choices[0].message.content;

            this.writerEffect.typeOutput(generatedText);
            this.saveWriterConversation(prompt, generatedText);
        } catch (error) {
            outputDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
            console.error(error);
        }
    }

    saveWriterConversation(prompt, output) {
        const conv = {
            id: Date.now().toString(),
            prompt,
            output,
            timestamp: new Date().toISOString()
        };
        this.writerMode.history.unshift(conv);
        if (this.writerMode.history.length > 50) this.writerMode.history.pop();
        localStorage.setItem('andrea_writer_history', JSON.stringify(this.writerMode.history));
        this.renderWriterHistory();
    }

    renderWriterHistory() {
        const listSidebar = document.getElementById('writer-history-list-sidebar');
        if (!listSidebar) return;

        const history = this.writerMode.history;
        listSidebar.innerHTML = history.map(conv => {
            const date = new Date(conv.timestamp);
            const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return `
                <div class="writer-history-item" data-id="${conv.id}">
                    <span class="writer-history-prompt">${conv.prompt.substring(0, 30)}${conv.prompt.length > 30 ? '...' : ''}</span>
                    <span class="writer-history-time">${timeString}</span>
                    <button class="writer-delete-btn" data-id="${conv.id}" title="Eliminar"><i class="fas fa-trash-alt"></i></button>
                </div>
            `;
        }).join('');

        if (history.length === 0) {
            listSidebar.innerHTML = '<div class="empty">No hay conversaciones</div>';
        }
    }

    loadWriterHistory() {
        const saved = localStorage.getItem('andrea_writer_history');
        if (saved) {
            this.writerMode.history = JSON.parse(saved);
            this.renderWriterHistory();
        }
    }

    loadWriterConversation(id) {
        const conv = this.writerMode.history.find(c => c.id === id);
        if (conv) {
            this.writerMode.currentConversationId = id;
            this.writerMode.prompt = conv.prompt;
            this.writerMode.output = conv.output;
            if (!this.writerMode.active) {
                this.enterWriterMode(conv.prompt, false);
            } else {
                document.getElementById('writer-prompt').value = conv.prompt;
                document.getElementById('writer-output').innerHTML = `<pre>${this.escapeHtml(conv.output)}</pre>`;
            }
        }
    }

    deleteWriterConversation(id) {
        if (!confirm('¿Eliminar esta conversación del modo escritora?')) return;
        this.writerMode.history = this.writerMode.history.filter(c => c.id !== id);
        localStorage.setItem('andrea_writer_history', JSON.stringify(this.writerMode.history));
        this.renderWriterHistory();
        if (this.writerMode.currentConversationId === id) {
            document.getElementById('writer-prompt').value = '';
            document.getElementById('writer-output').innerHTML = '';
            this.writerMode.currentConversationId = null;
            this.writerMode.prompt = '';
            this.writerMode.output = '';
        }
        this.ui.showNotification('Conversación eliminada', 'info');
    }

    // ========== UTILIDADES ADICIONALES ==========
    getConversationStats() {
        return {
            totalMessages: this.state.messages.length,
            userMessages: this.state.messages.filter(m => m.sender === 'user').length,
            aiMessages: this.state.messages.filter(m => m.sender === 'ai').length,
            currentEmotion: this.personality.getCurrentEmotion(),
            personalityTraits: this.personality.personalityTraits,
            conversationMetrics: this.conversationMetrics
        };
    }

    exportConversationData() {
        const data = {
            conversation: this.state.messages,
            personalitySnapshot: this.personality.getPersonalitySnapshot(),
            conversationMetrics: this.conversationMetrics,
            learningData: this.learningSystem,
            timestamp: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `andrea_conversation_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// ========== CLASES HELPER ==========
class UIHelper {
    constructor(app) {
        this.app = app;
    }

    adjustTextareaHeight(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }

    scrollToBottom() {
        const chatBox = document.getElementById('chat-box');
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    showNotification(msg, type = 'info') {
        const n = document.createElement('div');
        n.className = `notification ${type}`;
        n.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#1a5c1a' : type === 'error' ? '#5c1a1a' : '#1a3a5c'};
            border: 1px solid ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'};
            padding: 12px 24px;
            border-radius: 8px;
            color: #fff;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        n.textContent = msg;
        document.body.appendChild(n);
        setTimeout(() => n.remove(), 3000);
    }

    showTypingIndicator() {
        const chatBox = document.getElementById('chat-box');
        const div = document.createElement('div');
        div.id = 'typing-indicator';
        div.className = 'message-wrapper ai typing';

        const emotion = this.app.personality.getCurrentEmotion();
        const thinkingStage = this.app.personality.getThinkingStage();

        if (this.app.personality.thinkingMode) {
            div.innerHTML = `
                <div class="message-content thinking-deep">
                    <div class="typing-header">
                        <span class="typing-emotion" style="color: ${emotion.color}">
                            ${this.app.personality.getEmotionDescription()}
                        </span>
                        <span class="typing-stage">${thinkingStage}</span>
                    </div>
                </div>
            `;
        } else {
            div.innerHTML = `
                <div class="message-content thinking-simple">
                    <div class="typing-header">
                        <span class="typing-emotion" style="color: ${emotion.color}">
                            ${this.app.personality.getEmotionDescription()}
                        </span>
                    </div>
                    <div class="simple-spinner">
                        <span>.</span><span>.</span><span>.</span>
                    </div>
                </div>
            `;
        }

        chatBox.appendChild(div);
        this.scrollToBottom();

        if (this.app.personality.shouldShowThinkingProcess()) {
            this.app.thinkingInterval = this.app.personality.startThinkingProcess(() => {
                const stageElement = div.querySelector('.typing-stage');
                if (stageElement) {
                    stageElement.textContent = this.app.personality.getThinkingStage();
                }
            });
        }
    }

    hideTypingIndicator() {
        this.app.personality.stopThinkingProcess();
        if (this.app.thinkingInterval) {
            clearInterval(this.app.thinkingInterval);
            this.app.thinkingInterval = null;
        }
        const el = document.getElementById('typing-indicator');
        if (el) el.remove();
    }

    updateAuthUI(user) {
        const loggedOutDiv = document.getElementById('user-logged-out');
        const loggedInDiv = document.getElementById('user-logged-in');
        const userEmailSpan = document.getElementById('user-email-display');
        
        // Si algún elemento no existe (aún no está en el DOM), salimos sin error
        if (!loggedOutDiv || !loggedInDiv || !userEmailSpan) return;
        
        if (user) {
            loggedOutDiv.style.display = 'none';
            loggedInDiv.style.display = 'flex';
            userEmailSpan.textContent = user.email;
        } else {
            loggedOutDiv.style.display = 'flex';
            loggedInDiv.style.display = 'none';
        }
    }
}

class TypingEffect {
    constructor(app) {
        this.app = app;
        this.interval = null;
    }

    typeMessage(sender, fullContent, save = true) {
        if (sender !== 'ai') {
            this.app.appendMessage(sender, fullContent, save);
            return;
        }

        this.stop();

        const chatBox = document.getElementById('chat-box');
        const emptyState = chatBox.querySelector('.empty-state');
        if (emptyState) emptyState.remove();

        const wrapper = document.createElement('div');
        wrapper.className = `message-wrapper ${sender}`;
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        wrapper.appendChild(contentDiv);
        chatBox.appendChild(wrapper);
        this.app.ui.scrollToBottom();

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = fullContent;
        const plainText = tempDiv.textContent || tempDiv.innerText || '';

        let index = 0;
        const speed = 3;

        this.interval = setInterval(() => {
            if (index < plainText.length) {
                contentDiv.textContent = plainText.substring(0, index + 1);
                index++;
                this.app.ui.scrollToBottom();
            } else {
                clearInterval(this.interval);
                this.interval = null;
                contentDiv.innerHTML = fullContent;
                if (save) {
                    this.app.state.messages.push({ sender, content: fullContent });
                }
            }
        }, speed);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
}

class WriterEffect {
    constructor(app) {
        this.app = app;
        this.interval = null;
    }

    typeOutput(text) {
        const outputDiv = document.getElementById('writer-output');
        if (!outputDiv) return;

        this.stop();

        outputDiv.innerHTML = '';
        const pre = document.createElement('pre');
        outputDiv.appendChild(pre);

        let index = 0;
        const speed = 3;

        this.interval = setInterval(() => {
            if (index < text.length) {
                pre.textContent = text.substring(0, index + 1);
                index++;
            } else {
                clearInterval(this.interval);
                this.interval = null;
                this.app.writerMode.output = text;
            }
        }, speed);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
}

// ========== FUNCIONES GLOBALES ==========
window.app = new AndreaApp();

window.loadManual = (id) => {
    console.log("Forzando carga de conversación:", id);
    if (window.app) {
        window.app.loadConversation(id);
    } else {
        alert("Error: La aplicación no está lista");
    }
};

window.deleteManual = (id) => {
    if (window.app) window.app.deleteConversation(id);
};

window.resetAll = () => {
    if (confirm('¿Estás seguro de querer reiniciar la conversación actual?')) {
        window.app.startNewChat();
    }
};

window.clearConversationHistory = () => {
    if (confirm("¿Eliminar todo el historial de conversaciones?")) {
        localStorage.removeItem('andrea_conversation_history');
        window.app.conversationHistory = [];
        window.app.renderConversationHistory();
        window.app.ui.showNotification('Historial eliminado', 'info');
    }
};

window.copyCodeToClipboard = (button) => {
    const codeBlock = button.closest('.code-block-wrapper').querySelector('code');
    const text = codeBlock.textContent;
    navigator.clipboard.writeText(text).then(() => {
        const originalText = button.textContent;
        button.textContent = '✅ Copiado!';
        button.style.background = '#27ae60';
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Error al copiar:', err);
        button.textContent = '❌ Error';
        button.style.background = '#e74c3c';
    });
};

window.toggleSidebar = () => {
    if (window.app) window.app.toggleSidebarUI();
};

// Estilos adicionales
document.addEventListener('DOMContentLoaded', () => {
    const additionalStyles = `
        .typing { opacity: 0.8; }
        .typing-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-size: 0.9em; }
        .typing-emotion { font-weight: bold; }
        .typing-stage { color: #888; font-style: italic; }
        .thinking-animation { text-align: center; padding: 10px; }
        .empty-state-tips { margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 8px; text-align: left; }
        .empty-state-tips ul { margin: 10px 0 0 20px; padding: 0; }
        .empty-state-tips li { margin-bottom: 5px; }
        .code-header { display: flex; justify-content: space-between; align-items: center; background: #2d3748; padding: 8px 12px; border-radius: 6px 6px 0 0; font-family: monospace; }
        .code-lang { color: #a0aec0; font-size: 0.9em; }
        .copy-code-btn { background: #4a5568; border: none; color: white; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 0.8em; transition: background 0.2s; }
        .copy-code-btn:hover { background: #2d3748; }
        .conversation-item .conv-details { display: flex; flex-direction: column; }
        .conv-time { font-size: 0.8em; color: #888; margin-top: 2px; }
        .message-wrapper[data-intensity] { transition: opacity 0.3s; }
        .message-wrapper[data-intensity="1.00"] { border-left: 3px solid #ff6b6b; }
        .message-wrapper[data-intensity="0.80"] { border-left: 3px solid #4ecdc4; }
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    const styleSheet = document.createElement('style');
    styleSheet.textContent = additionalStyles;
    document.head.appendChild(styleSheet);
});