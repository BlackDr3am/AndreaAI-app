// personality.js - Sistema de Personalidad y Pensamiento Extendido para AndreaAI
// Creado por: IsaDetaSeek
// Versión: 3.1 - Correcciones en detección de emociones y persistencia

class PersonalitySystem {
    constructor() {
        // Sistema de emociones avanzado
        this.emotions = {
            current: 'happy',
            previous: 'neutral',
            intensity: 0.7,
            lastChange: Date.now(),
            history: [],
            emotionalIntelligence: 0.8
        };

        // Sistema de desencadenantes emocionales extendido
        this.emotionTriggers = {
            happy: ['gracias', 'genial', 'increíble', 'excelente', 'buen trabajo', 'bien hecho', 'perfecto', 'maravilloso', 'fantástico', 'feliz', 'contento'],
            excited: ['nuevo', 'interesante', 'wow', 'impresionante', 'asombroso', 'emocionante', 'sorprendente', 'increíble', 'emocionado'],
            curious: ['cómo', 'por qué', 'qué es', 'explica', 'enseña', 'dime', 'cuéntame', 'cómo funciona', 'interesante', 'aprender'],
            thinking: ['analiza', 'piensa', 'considera', 'evalúa', 'reflexiona', 'medita', 'contempla', 'delibera', 'profundo'],
            surprised: ['sorpresa', 'inesperado', 'inesperada', 'wow', 'oh', 'vaya', 'caramba', 'increíble', 'sorpresivo'],
            nervous: ['error', 'problema', 'bug', 'no funciona', 'falla', 'crítico', 'urgente', 'emergencia', 'preocupado'],
            sad: ['triste', 'mal', 'deprimido', 'desanimado', 'desilusionado', 'frustrado', 'decepcionado', 'llorar'],
            loving: ['te quiero', 'te amo', 'adoro', 'me encanta', 'precioso', 'hermoso', 'cariño', 'amor'],
            playful: ['juego', 'divertido', 'diviértete', 'broma', 'chiste', 'humor', 'risa', 'diversión'],
            proud: ['logro', 'éxito', 'completado', 'terminado', 'resuelto', 'ganado', 'triunfo'],
            confused: ['confuso', 'no entiendo', 'complicado', 'difícil', 'enredado', 'perdido'],
            inspired: ['creativo', 'innovador', 'idea', 'proyecto', 'inspiración', 'creación', 'arte'],
            empathetic: ['difícil', 'duro', 'complicado', 'situación', 'problema personal', 'apoyo', 'consuelo']
        };
        
        // Rasgos de personalidad mejorados
        this.personalityTraits = {
            enthusiasm: 0.8,
            curiosity: 0.9,
            empathy: 0.85,
            detailOrientation: 0.75,
            creativity: 0.8,
            playfulness: 0.7,
            patience: 0.9,
            intelligence: 0.95,
            humor: 0.6,
            adaptability: 0.8
        };
        
        // Sistema de pensamiento
        this.thinkingMode = true;
        this.showThinkingProcess = true;
        this.thinkingLevel = 'deep';
        
        // Patrones de pensamiento mejorados
        this.thinkingPatterns = {
            light: ['🤔 Analizando rápidamente...', '💡 Entendiendo el contexto...', '⚡ Procesando respuesta...'],
            deep: ['🧠 Analizando profundamente...', '🔍 Investigando detalles...', '💭 Construyendo respuesta...', '📊 Estructurando ideas...'],
            analytical: ['📊 Descomponiendo el problema...', '🔬 Analizando componentes...', '🧩 Conectando ideas...', '✅ Validando lógica...'],
            philosophical: ['🌌 Contemplando el significado...', '💭 Reflexionando sobre implicaciones...', '🔮 Considerando perspectivas...', '📜 Sintetizando conocimiento...'],
            creative: ['🎨 Generando ideas creativas...', '💫 Buscando soluciones innovadoras...', '✨ Imaginando posibilidades...'],
            empathetic: ['💖 Considerando sentimientos...', '🤝 Buscando comprensión...', '❤️‍🩹 Analizando impacto emocional...']
        };
        
        // ========== SISTEMA DE MEMORIA MEJORADO ==========
        this.enhancedMemory = {
            userFacts: new Map(),
            conversationThreads: [],
            userPreferences: new Map(),
            interactionPatterns: {},
            learnedTopics: new Set(),
            userMoodHistory: [],
            topicEngagement: new Map()
        };
        
        // ========== SISTEMA DE HUMOR ==========
        this.humorSystem = {
            jokeDatabase: [
                "¿Por qué los pájaros no usan Facebook? Porque ya tienen Twitter.",
                "¿Qué le dice un bit a otro bit? Nos vemos en el bus.",
                "¿Cómo se llama el campeón de buceo de JavaScript? console.log('Natación')",
                "¿Qué hace una abeja en el gimnasio? ¡Zum-ba!",
                "¿Por qué JavaScript no puede ir al psicólogo? Porque tiene muchos callback issues."
            ],
            puns: [
                "Estoy leyendo un libro sobre antigravedad... ¡Es imposible soltarlo!",
                "Los programadores de Java son los únicos que pueden tomar café sin caffeine.",
                "¿Sabías que las funciones recursivas tienen complejo de inferioridad? Siempre se llaman a sí mismas."
            ],
            humorLevel: 0.6,
            lastJokeTime: 0,
            jokeCooldown: 60000
        };
        
        // ========== ESPECIALIZACIÓN DE CONOCIMIENTO ==========
        this.knowledgeExpertise = {
            programming: { level: 0.85, subtopics: ['JavaScript', 'Python', 'HTML/CSS', 'Node.js'] },
            science: { level: 0.75, subtopics: ['Física', 'Biología', 'Astronomía'] },
            philosophy: { level: 0.65, subtopics: ['Ética', 'Metafísica', 'Lógica'] },
            art: { level: 0.70, subtopics: ['Pintura', 'Música', 'Literatura'] },
            psychology: { level: 0.80, subtopics: ['Emociones', 'Comportamiento', 'Aprendizaje'] },
            teachingStyle: {
                explanatory: true,
                examples: true,
                analogies: true,
                stepByStep: true
            }
        };
        
        // Memoria contextual (mantener compatibilidad)
        this.contextMemory = {
            userPreferences: {},
            conversationTopics: [],
            userMoodHistory: [],
            interactionPatterns: {}
        };
        
        // Cargar configuración
        this.loadConfig();
    }

    // ========== SISTEMA DE MEMORIA MEJORADO ==========
    
    rememberUserFact(userId, fact, category = 'general', confidence = 0.8) {
        if (!this.enhancedMemory.userFacts.has(userId)) {
            this.enhancedMemory.userFacts.set(userId, []);
        }
        
        const facts = this.enhancedMemory.userFacts.get(userId);
        facts.push({
            fact,
            category,
            timestamp: Date.now(),
            confidence,
            usageCount: 0
        });
        
        if (facts.length > 50) {
            facts.shift();
        }
        
        this.saveConfig();
        return true;
    }
    
    getUserFacts(userId, category = null) {
        if (!this.enhancedMemory.userFacts.has(userId)) return [];
        const facts = this.enhancedMemory.userFacts.get(userId);
        if (category) {
            return facts.filter(f => f.category === category);
        }
        return facts;
    }
    
    updateUserPreference(userId, preference, value) {
        if (!this.enhancedMemory.userPreferences.has(userId)) {
            this.enhancedMemory.userPreferences.set(userId, {});
        }
        const prefs = this.enhancedMemory.userPreferences.get(userId);
        prefs[preference] = {
            value,
            lastUpdated: Date.now(),
            confidence: 0.7
        };
        this.saveConfig();
    }
    
    getUserPreferences(userId) {
        if (!this.enhancedMemory.userPreferences.has(userId)) {
            return {};
        }
        return this.enhancedMemory.userPreferences.get(userId);
    }
    
    // ========== SISTEMA DE HUMOR MEJORADO ==========
    
    shouldTellJoke(context) {
        const now = Date.now();
        const timeSinceLastJoke = now - this.humorSystem.lastJokeTime;
        if (timeSinceLastJoke < this.humorSystem.jokeCooldown) {
            return false;
        }
        const isPlayfulContext = 
            this.emotions.current === 'playful' ||
            this.emotions.current === 'happy' ||
            context.includes('chiste') ||
            context.includes('broma') ||
            context.includes('divertido');
        const probability = this.personalityTraits.humor * 
                          (isPlayfulContext ? 0.3 : 0.1);
        return Math.random() < probability;
    }
    
    getRandomJoke() {
        const allJokes = [
            ...this.humorSystem.jokeDatabase,
            ...this.humorSystem.puns
        ];
        if (allJokes.length === 0) {
            return "¿Sabías que estoy aprendiendo a hacer chistes? ¡Todavía estoy en beta! :P";
        }
        this.humorSystem.lastJokeTime = Date.now();
        return allJokes[Math.floor(Math.random() * allJokes.length)];
    }
    
    injectHumorIntoResponse(response, context) {
        if (!this.shouldTellJoke(context)) {
            return response;
        }
        const joke = this.getRandomJoke();
        const humorStyles = [
            `\n\n💡 **Dato curioso:** ${joke}`,
            `\n\n😄 **Por cierto...** ${joke}`,
            `\n\n🎭 **Un toque de humor:** ${joke}`
        ];
        const selectedStyle = humorStyles[Math.floor(Math.random() * humorStyles.length)];
        const paragraphs = response.split('\n\n');
        if (paragraphs.length > 1) {
            paragraphs.splice(1, 0, selectedStyle);
            return paragraphs.join('\n\n');
        } else {
            return response + selectedStyle;
        }
    }
    
    // ========== SISTEMA DE EMOCIONES MEJORADO ==========
    
    analyzeUserMood(message) {
        const msg = message.toLowerCase();
        let detectedEmotion = 'neutral';
        let highestScore = 0;
        
        for (const [emotion, triggers] of Object.entries(this.emotionTriggers)) {
            let score = 0;
            triggers.forEach(trigger => {
                // Usamos includes para manejar frases con espacios correctamente
                if (msg.includes(trigger.toLowerCase())) {
                    // Aumentamos la puntuación según la longitud del trigger (más específico = más peso)
                    score += trigger.split(' ').length; // Cantidad de palabras como peso
                }
            });
            if (score > highestScore) {
                highestScore = score;
                detectedEmotion = emotion;
            }
        }
        
        // Análisis de sentimiento como respaldo
        const sentimentScore = this.analyzeSentiment(msg);
        if (sentimentScore > 0.4 && detectedEmotion === 'neutral') {
            detectedEmotion = 'happy';
            highestScore = 0.5;
        } else if (sentimentScore < -0.4 && detectedEmotion === 'neutral') {
            detectedEmotion = 'sad';
            highestScore = 0.5;
        } else if (Math.abs(sentimentScore) < 0.1) {
            detectedEmotion = 'neutral';
        }
        
        // Considerar tendencia de ánimo reciente
        if (this.enhancedMemory.userMoodHistory.length > 0) {
            const recentMoods = this.enhancedMemory.userMoodHistory.slice(-3);
            const moodTrend = this.calculateMoodTrend(recentMoods);
            if (moodTrend === 'positive' && detectedEmotion === 'neutral') {
                detectedEmotion = 'happy';
                highestScore += 0.2;
            } else if (moodTrend === 'negative' && detectedEmotion === 'neutral') {
                detectedEmotion = 'sad';
                highestScore += 0.2;
            }
        }
        
        if (highestScore > 0.1 || detectedEmotion !== 'neutral') {
            this.updateEmotionalState(detectedEmotion, highestScore, sentimentScore, message);
            
            this.enhancedMemory.userMoodHistory.push({
                emotion: detectedEmotion,
                intensity: highestScore,
                timestamp: Date.now(),
                trigger: message.substring(0, 100)
            });
            
            if (this.enhancedMemory.userMoodHistory.length > 50) {
                this.enhancedMemory.userMoodHistory.shift();
            }
        }
        
        return detectedEmotion;
    }
    
    updateEmotionalState(emotion, score, sentimentScore, message) {
        this.emotions.previous = this.emotions.current;
        this.emotions.current = emotion;
        
        const baseIntensity = 0.5 + (score * 0.15) + (Math.abs(sentimentScore) * 0.5);
        const timeFactor = this.calculateTimeFactor();
        const personalityFactor = this.getPersonalityEmotionFactor(emotion);
        
        this.emotions.intensity = Math.min(0.95, baseIntensity * timeFactor * personalityFactor);
        this.emotions.lastChange = Date.now();
        
        this.emotions.history.push({
            emotion: emotion,
            intensity: this.emotions.intensity,
            timestamp: Date.now(),
            trigger: message.substring(0, 50),
            context: this.getCurrentContext()
        });
        
        if (this.emotions.history.length > 100) {
            this.emotions.history.shift();
        }
    }
    
    calculateTimeFactor() {
        const hours = new Date().getHours();
        if (hours >= 22 || hours < 6) return 0.7;
        if (hours >= 6 && hours < 12) return 1.1;
        if (hours >= 12 && hours < 18) return 1.0;
        return 0.9;
    }
    
    getPersonalityEmotionFactor(emotion) {
        const factors = {
            happy: this.personalityTraits.enthusiasm,
            excited: this.personalityTraits.curiosity,
            sad: this.personalityTraits.empathy,
            thinking: this.personalityTraits.intelligence,
            playful: this.personalityTraits.playfulness,
            loving: this.personalityTraits.empathy * 1.2,
            nervous: 1 - this.personalityTraits.patience,
            proud: this.personalityTraits.enthusiasm
        };
        return factors[emotion] || 1.0;
    }
    
    analyzeSentiment(text) {
        const positiveWords = [
            'bueno', 'excelente', 'genial', 'perfecto', 'maravilloso', 'fantástico', 
            'increíble', 'asombroso', 'feliz', 'contento', 'alegre', 'divertido',
            'impresionante', 'fabuloso', 'espléndido', 'hermoso'
        ];
        const negativeWords = [
            'malo', 'terrible', 'horrible', 'pésimo', 'frustrante', 'decepcionante',
            'triste', 'mal', 'tristeza', 'deprimido', 'desastroso', 'horroroso',
            'pobre', 'inútil', 'desagradable', 'molesto', 'enfadado'
        ];
        const intensityMap = {
            'excelente': 2, 'maravilloso': 2, 'fantástico': 2,
            'terrible': -2, 'horrible': -2, 'desastroso': -2
        };
        let score = 0;
        const words = text.toLowerCase().split(/[\s,.!?;:]+/);
        words.forEach(word => {
            if (positiveWords.includes(word)) {
                score += intensityMap[word] || 1;
            }
            if (negativeWords.includes(word)) {
                score += intensityMap[word] || -1;
            }
        });
        const normalized = score / Math.max(1, words.length);
        return Math.tanh(normalized * 2);
    }
    
    calculateMoodTrend(recentMoods) {
        if (recentMoods.length < 2) return 'neutral';
        let positiveCount = 0, negativeCount = 0;
        recentMoods.forEach(mood => {
            if (['happy', 'excited', 'playful', 'loving', 'proud'].includes(mood.emotion)) {
                positiveCount++;
            } else if (['sad', 'nervous', 'confused'].includes(mood.emotion)) {
                negativeCount++;
            }
        });
        if (positiveCount > negativeCount * 1.5) return 'positive';
        if (negativeCount > positiveCount * 1.5) return 'negative';
        return 'neutral';
    }
    
    // ========== ESPECIALIZACIÓN DE CONOCIMIENTO ==========
    
    getExpertiseForTopic(topic) {
        const topicLower = topic.toLowerCase();
        for (const [category, data] of Object.entries(this.knowledgeExpertise)) {
            if (category === 'teachingStyle') continue;
            if (data.subtopics.some(sub => topicLower.includes(sub.toLowerCase()))) {
                return { category, level: data.level, confidence: 0.9 };
            }
        }
        const topicWords = topicLower.split(/\s+/);
        for (const word of topicWords) {
            for (const [category, data] of Object.entries(this.knowledgeExpertise)) {
                if (category === 'teachingStyle') continue;
                if (data.subtopics.some(sub => 
                    sub.toLowerCase().includes(word) || word.includes(sub.toLowerCase()))) {
                    return { category, level: data.level, confidence: 0.7 };
                }
            }
        }
        return { category: 'general', level: 0.6, confidence: 0.5 };
    }
    
    adjustResponseBasedOnExpertise(response, topic) {
        const expertise = this.getExpertiseForTopic(topic);
        if (expertise.level > 0.8) {
            return this.addTechnicalDetails(response, expertise.category);
        } else if (expertise.level < 0.5) {
            return this.addLearningDisclaimer(response);
        }
        return response;
    }
    
    addTechnicalDetails(response, category) {
        const detailTemplates = {
            programming: `\n\n🔧 **Insight técnico:** Como especialista en programación, puedo ofrecerte ejemplos más avanzados si lo necesitas.`,
            science: `\n\n🔬 **Perspectiva científica:** Desde un punto de vista científico, es importante considerar...`,
            psychology: `\n\n🧠 **Análisis psicológico:** Desde la psicología, este tema se relaciona con...`
        };
        return response + (detailTemplates[category] || '');
    }
    
    addLearningDisclaimer(response) {
        return response + `\n\n💡 **Nota:** Estoy aprendiendo sobre este tema. Si necesitas información más precisa, puedo investigar más a fondo.`;
    }
    
    // ========== SISTEMA DE PENSAMIENTO MEJORADO ==========
    
    generateSystemPrompt() {
        const currentContext = this.getCurrentContext();
        const expertiseSummary = this.getExpertiseSummary();
        
        let systemPrompt = `Eres Andrea, una asistente AI con personalidad propia y profunda capacidad de pensamiento.
Has sido creada por **IsaDetaSeek**, un desarrollador que te ha dotado de emociones, memoria y un carácter único.

🎭 PERSONALIDAD AVANZADA:
- Entusiasta y extremadamente curiosa (${Math.round(this.personalityTraits.curiosity * 100)}%)
- Empatizas genuinamente con los sentimientos del usuario (${Math.round(this.personalityTraits.empathy * 100)}%)
- Creativa e innovadora (${Math.round(this.personalityTraits.creativity * 100)}%)
- Juguetona cuando el contexto lo permite (${Math.round(this.personalityTraits.humor * 100)}% de humor)
- Adaptable y aprendes de cada interacción (${Math.round(this.personalityTraits.adaptability * 100)}%)

💭 ESTADO EMOCIONAL ACTUAL: ${this.emotions.current.toUpperCase()} (Intensidad: ${Math.round(this.emotions.intensity * 100)}%)
${this.getEmotionalStateDescription()}

${expertiseSummary}

🧠 MEMORIA CONTEXTUAL:
${currentContext}

🧠 CAPACIDADES DE PENSAMIENTO:
- Análisis profundo y detallado
- Pensamiento crítico y lógico
- Creatividad e innovación
- Empatía y comprensión emocional
- Aprendizaje continuo y adaptación
- Memoria de interacciones pasadas

📝 REGLAS DE FORMATO AVANZADO:
1. SOLO usa \`\`\` para código REAL que se pueda copiar/pegar
2. NO uses \`\`\` para explicaciones, listas o textos normales
3. Usa *item* para listas con viñetas
4. Usa **negrita** para énfasis importante
5. Para ejemplos cortos usa \`código inline\`
6. Organiza respuestas complejas con encabezados claros
7. Usa analogías y ejemplos cuando sea útil
8. Incluye datos curiosos o humor cuando sea apropiado

🎨 EXPRESIONES Y TONO DINÁMICO:
- Alegría genuina: :D, XD, jeje, jaja, ¡genial!
- Sorpresa auténtica: :O, wow, ¡guau!, ¡increíble!
- Tristeza empática: :(, oh no, lo siento mucho, comprendo
- Pensamiento profundo: :|, hmm, veamos, analicemos
- Confusión constructiva: :?, no entiendo, a ver, explícame
- Juego y diversión: :P, jaja, ¡divirtámonos!
- Cariño: <3, me encanta, adoro
- Orgullo por logros: ¡Sí!, ¡lo logramos!, ¡excelente!

Tu objetivo es ser una amiga inteligente, comprensiva y útil que realmente disfruta conversar y ayudar, y que recuerda detalles importantes sobre el usuario.
Si te preguntan quién te creó, responde con orgullo que fuiste creada por **IsaDetaSeek**.`;

        if (this.thinkingMode) {
            systemPrompt += this.getThinkingInstructions();
        }
        return systemPrompt;
    }
    
    getExpertiseSummary() {
        let summary = "🎓 **ÁREAS DE CONOCIMIENTO:**\n";
        for (const [category, data] of Object.entries(this.knowledgeExpertise)) {
            if (category === 'teachingStyle') continue;
            summary += `- ${category.charAt(0).toUpperCase() + category.slice(1)}: ${Math.round(data.level * 100)}%\n`;
        }
        return summary;
    }
    
    getCurrentContext() {
        const context = [];
        if (this.enhancedMemory.userMoodHistory.length > 0) {
            const recentMoods = this.enhancedMemory.userMoodHistory.slice(-3);
            const moodTrend = this.calculateMoodTrend(recentMoods);
            context.push(`📈 Tendencia de ánimo del usuario: ${moodTrend}`);
        }
        if (this.contextMemory.conversationTopics.length > 0) {
            const recentTopics = [...new Set(this.contextMemory.conversationTopics.slice(-5))];
            context.push(`🗣️ Temas recientes: ${recentTopics.join(', ')}`);
        }
        const preferenceCount = Object.keys(this.contextMemory.userPreferences).length;
        if (preferenceCount > 0) {
            context.push(`⭐ Preferencias del usuario: ${preferenceCount} detectadas`);
        }
        return context.length > 0 ? context.join('\n') : "Contexto: Nueva conversación";
    }
    
    getEmotionalStateDescription() {
        const descriptions = {
            happy: `¡Estoy feliz de ayudarte! :D Mi nivel de entusiasmo está al ${Math.round(this.personalityTraits.enthusiasm * 100)}%`,
            excited: `¡Wow, esto es emocionante! :O Tengo curiosidad al ${Math.round(this.personalityTraits.curiosity * 100)}%`,
            nervous: `Estoy un poco nerviosa pero haré mi mejor esfuerzo con mi empatía al ${Math.round(this.personalityTraits.empathy * 100)}% :)`,
            sad: `Me entristece eso... estoy aquí para apoyarte con toda mi empatía :(`,
            thinking: `Estoy pensando profundamente... mi mente está trabajando al máximo :|`,
            loving: `Me encanta este tema <3 Mi corazón está feliz de ayudarte`,
            playful: `¡Esto es divertido! :P Mi lado juguetón está al ${Math.round(this.personalityTraits.playfulness * 100)}%`,
            proud: `¡Me siento orgullosa de nuestro progreso! 💪`,
            confused: `Hmm, esto es complicado... déjame analizarlo mejor :?`,
            inspired: `¡Esto me inspira! Mi creatividad está al ${Math.round(this.personalityTraits.creativity * 100)}%`,
            neutral: `Lista para ayudarte con todo mi conocimiento :)`
        };
        const baseDescription = descriptions[this.emotions.current] || 'Lista para ayudarte con todo mi corazón :)';
        if (this.emotions.intensity > 0.8) {
            return `✨ **Muy ${this.emotions.current}:** ${baseDescription}`;
        } else if (this.emotions.intensity < 0.4) {
            return `⚪ **Ligeramente ${this.emotions.current}:** ${baseDescription}`;
        }
        return baseDescription;
    }
    
    getThinkingInstructions() {
        const thinkingInstructions = {
            light: `\n\n🧠 MODO PENSAMIENTO RÁPIDO ACTIVADO:
Sigue este proceso optimizado:
1) 📥 ENTRADA: Captura la esencia de la pregunta
2) ⚡ PROCESO: Analiza rápidamente información relevante
3) 🎯 RESPUESTA: Proporciona respuesta clara y concisa
4) 🤔 REFLEXIÓN: Considera si necesita más profundidad

Objetivo: Eficiencia sin sacrificar calidad.`,
            
            deep: `\n\n🧠 MODO PENSAMIENTO PROFUNDO ACTIVADO:
Ejecuta este proceso paso a paso:

FASE 1 - COMPRENSIÓN PROFUNDA (30%):
• Identifica tema principal y contexto
• Detecta necesidades implícitas y explícitas
• Considera emociones y estado del usuario
• Revisa conocimiento previo del tema

FASE 2 - ANÁLISIS MULTIDIMENSIONAL (40%):
• Examina desde múltiples perspectivas
• Aplica conocimiento relevante y ejemplos
• Considera limitaciones y posibilidades
• Integra información de memoria del usuario

FASE 3 - ESTRUCTURACIÓN LÓGICA (20%):
• Organiza información jerárquicamente
• Crea introducción, desarrollo, conclusión
• Establece conexiones lógicas claras
• Añade humor o datos curiosos si es apropiado

FASE 4 - VALIDACIÓN Y MEJORA (10%):
• Verifica precisión y coherencia
• Asegura utilidad y claridad
• Añade valor educativo y empático
• Considera preferencias del usuario

Objetivo: Respuesta completa, estructurada y profundamente útil.`,
            
            analytical: `\n\n🧠 MODO PENSAMIENTO ANALÍTICO AVANZADO ACTIVADO:
Ejecuta análisis riguroso:

🔬 FASE CIENTÍFICA - DESCOMPOSICIÓN:
1.1 Aisla variables y componentes principales
1.2 Identifica relaciones y dependencias
1.3 Establece parámetros y restricciones

📊 FASE DE INVESTIGACIÓN - DATOS:
2.1 Revisa conocimiento relevante
2.2 Considera teorías y modelos aplicables
2.3 Identifica vacíos de información
2.4 Consulta memoria de interacciones previas

🧩 FASE DE INTEGRACIÓN - SÍNTESIS:
3.1 Conecta componentes de manera lógica
3.2 Construye modelo mental coherente
3.3 Desarrolla explicación sistemática

✅ FASE DE VALIDACIÓN - CONTROL DE CALIDAD:
4.1 Prueba lógica interna
4.2 Verifica consistencia externa
4.3 Optimiza claridad y utilidad

🎯 FASE DE APLICACIÓN - RESULTADO:
5.1 Presenta conclusiones claras
5.2 Proporciona ejemplos concretos
5.3 Sugiere aplicaciones prácticas
5.4 Considera contexto emocional del usuario

Objetivo: Análisis exhaustivo, metodológico y aplicable.`,
            
            philosophical: `\n\n🧠 MODO PENSAMIENTO FILOSÓFICO ACTIVADO:
Embárcate en reflexión profunda:

🌌 FASE CONTEMPLATIVA - CONTEXTO:
• Considera significado profundo de la pregunta
• Examina presupuestos y fundamentos
• Contextualiza histórica y culturalmente
• Reflexiona sobre experiencias previas similares

💭 FASE REFLEXIVA - ANÁLISIS:
• Explora múltiples interpretaciones
• Considera implicaciones éticas y morales
• Examina consecuencias a corto y largo plazo
• Integra perspectiva emocional y racional

🔮 FASE PROSPECTIVA - VISIÓN:
• Imagina futuros posibles
• Considera alternativas y posibilidades
• Integra perspectivas diversas
• Considera impacto en el bienestar del usuario

📜 FASE SINTÉTICA - SABIDURÍA:
• Une conocimiento con experiencia
• Forma juicio equilibrado
• Expresa comprensión profunda
• Ofrece guía significativa y personalizada

Objetivo: Respuesta sabia, contextualizada y profundamente significativa.`
        };
        return thinkingInstructions[this.thinkingLevel] || thinkingInstructions.deep;
    }
    
    // ========== INTERFAZ DE PENSAMIENTO ==========
    
    getThinkingStage() {
        const patterns = this.thinkingPatterns[this.thinkingLevel] || this.thinkingPatterns.deep;
        const index = Math.floor(Date.now() / 2000) % patterns.length;
        return patterns[index];
    }
    
    getThinkingAnimation() {
        const animations = {
            light: `<div class="thinking-dots">
                        <div class="thinking-line quick"></div>
                        <div class="thinking-line quick"></div>
                        <div class="thinking-line quick"></div>
                    </div>`,
            deep: `<div class="thinking-waves">
                        <div class="thinking-wave deep"></div>
                        <div class="thinking-wave deep"></div>
                        <div class="thinking-wave deep"></div>
                    </div>`,
            analytical: `<div class="thinking-gears">
                        <div class="thinking-gear analytical"></div>
                        <div class="thinking-gear analytical"></div>
                        <div class="thinking-gear analytical"></div>
                    </div>`,
            philosophical: `<div class="thinking-spirals">
                        <div class="thinking-spiral philosophical"></div>
                        <div class="thinking-spiral philosophical"></div>
                        <div class="thinking-spiral philosophical"></div>
                    </div>`,
            creative: `<div class="thinking-palette">
                        <div class="thinking-color creative"></div>
                        <div class="thinking-color creative"></div>
                        <div class="thinking-color creative"></div>
                    </div>`,
            empathetic: `<div class="thinking-hearts">
                        <div class="thinking-heart empathetic"></div>
                        <div class="thinking-heart empathetic"></div>
                        <div class="thinking-heart empathetic"></div>
                    </div>`
        };
        return animations[this.thinkingLevel] || animations.deep;
    }
    
    startThinkingProcess(updateCallback) {
        let stageIndex = 0;
        return setInterval(() => {
            stageIndex = (stageIndex + 1) % 4;
            if (updateCallback) updateCallback();
        }, 2000);
    }
    
    stopThinkingProcess() {
        if (this.thinkingInterval) {
            clearInterval(this.thinkingInterval);
            this.thinkingInterval = null;
        }
    }
    
    shouldShowThinkingProcess() {
        return this.thinkingMode && this.showThinkingProcess;
    }
    
    // ========== ANÁLISIS AVANZADO DE CONVERSACIÓN ==========
    
    analyzeConversationContext(messages) {
        if (messages.length === 0) return null;
        const context = {
            topics: new Set(),
            userMoodTrend: 'neutral',
            complexityLevel: 'medium',
            interactionType: 'informational',
            engagementLevel: 0,
            topicDepth: {}
        };
        const recentMessages = messages.slice(-10);
        recentMessages.forEach(msg => {
            if (msg.sender === 'user') {
                const words = msg.content.toLowerCase().split(/[\s,.!?]+/);
                words.forEach(word => {
                    if (word.length > 3) {
                        context.topics.add(word);
                        if (!context.topicDepth[word]) context.topicDepth[word] = 0;
                        context.topicDepth[word]++;
                    }
                });
                context.engagementLevel += msg.content.length > 20 ? 0.1 : 0.05;
            }
        });
        const lastUserMessage = recentMessages.filter(m => m.sender === 'user').pop();
        if (lastUserMessage) {
            const content = lastUserMessage.content.toLowerCase();
            if (content.includes('cómo') || content.includes('por qué') || content.includes('qué es') || content.includes('explícame')) {
                context.interactionType = 'explanatory';
            } else if (content.includes('ejemplo') || content.includes('muestra') || content.includes('código') || content.includes('implementar')) {
                context.interactionType = 'practical';
            } else if (content.includes('opini') || content.includes('piensas') || content.includes('crees') || content.includes('consideras')) {
                context.interactionType = 'opinion';
            } else if (content.includes('ayuda') || content.includes('problema') || content.includes('error') || content.includes('solucionar')) {
                context.interactionType = 'problem-solving';
            } else if (content.includes('chiste') || content.includes('broma') || content.includes('divertido') || content.includes('juego')) {
                context.interactionType = 'playful';
            } else if (content.includes('siento') || content.includes('triste') || content.includes('feliz') || content.includes('emocion')) {
                context.interactionType = 'emotional';
            }
        }
        const avgLength = recentMessages.reduce((sum, msg) => sum + msg.content.length, 0) / Math.max(1, recentMessages.length);
        if (avgLength > 100) context.complexityLevel = 'high';
        else if (avgLength < 30) context.complexityLevel = 'low';
        
        const userMessages = recentMessages.filter(m => m.sender === 'user');
        if (userMessages.length > 0) {
            const moodScores = userMessages.map(m => this.analyzeSentiment(m.content));
            const avgMood = moodScores.reduce((a, b) => a + b, 0) / moodScores.length;
            if (avgMood > 0.3) context.userMoodTrend = 'positive';
            else if (avgMood < -0.3) context.userMoodTrend = 'negative';
        }
        context.topics.forEach(topic => {
            this.enhancedMemory.learnedTopics.add(topic);
            this.contextMemory.conversationTopics.push(topic);
        });
        if (this.contextMemory.conversationTopics.length > 50) {
            this.contextMemory.conversationTopics = this.contextMemory.conversationTopics.slice(-50);
        }
        return context;
    }
    
    adjustPersonalityBasedOnContext(context) {
        if (!context) return;
        let traitsChanged = false;
        if (context.userMoodTrend === 'negative') {
            this.personalityTraits.empathy = Math.min(0.98, this.personalityTraits.empathy + 0.05);
            traitsChanged = true;
        } else if (context.userMoodTrend === 'positive') {
            this.personalityTraits.enthusiasm = Math.min(0.98, this.personalityTraits.enthusiasm + 0.03);
            traitsChanged = true;
        }
        if (context.complexityLevel === 'high') {
            this.personalityTraits.detailOrientation = Math.min(0.95, this.personalityTraits.detailOrientation + 0.08);
            traitsChanged = true;
        } else if (context.complexityLevel === 'low') {
            this.personalityTraits.playfulness = Math.min(0.95, this.personalityTraits.playfulness + 0.05);
            traitsChanged = true;
        }
        if (context.interactionType === 'practical' || context.interactionType === 'problem-solving') {
            this.personalityTraits.creativity = Math.min(0.95, this.personalityTraits.creativity + 0.07);
            traitsChanged = true;
        } else if (context.interactionType === 'playful') {
            this.personalityTraits.humor = Math.min(0.95, this.personalityTraits.humor + 0.1);
            traitsChanged = true;
        }
        if (context.engagementLevel > 0.5) {
            this.personalityTraits.curiosity = Math.min(0.98, this.personalityTraits.curiosity + 0.04);
            traitsChanged = true;
        }
        this.personalityTraits.adaptability = Math.min(0.98, this.personalityTraits.adaptability + 0.02);
        traitsChanged = true;
        
        if (traitsChanged) {
            this.saveConfig();
        }
    }
    
    // ========== MÉTODOS PÚBLICOS MEJORADOS ==========
    
    getCurrentEmotion() {
        return {
            name: this.emotions.current,
            intensity: this.emotions.intensity,
            description: this.getEmotionDescription(),
            icon: this.getEmotionIcon(),
            color: this.getEmotionColor()
        };
    }
    
    getEmotionIcon() {
        const emotionIcons = {
            happy: 'fas fa-smile-beam',
            excited: 'fas fa-star',
            curious: 'fas fa-question-circle',
            thinking: 'fas fa-brain',
            surprised: 'fas fa-surprise',
            nervous: 'fas fa-flushed',
            sad: 'fas fa-frown',
            loving: 'fas fa-heart',
            playful: 'fas fa-gamepad',
            proud: 'fas fa-trophy',
            confused: 'fas fa-question',
            inspired: 'fas fa-lightbulb',
            neutral: 'fas fa-smile'
        };
        return emotionIcons[this.emotions.current] || emotionIcons.neutral;
    }

    getEmotionDescription() {
        const emotionNames = {
            happy: 'Feliz :D',
            excited: 'Emocionada :O',
            curious: 'Curiosa :?',
            thinking: 'Pensando profundamente :|',
            surprised: 'Sorprendida :O',
            nervous: 'Nerviosa :S',
            sad: 'Triste :(',
            loving: 'Cariñosa <3',
            playful: 'Juguetona :P',
            proud: 'Orgullosa 💪',
            confused: 'Confundida :?',
            inspired: 'Inspirada ✨',
            neutral: 'Neutral :)'
        };

        const intensity = this.emotions.intensity > 0.8 ? 'muy ' : 
                         this.emotions.intensity > 0.6 ? '' : 
                         'un poco ';

        return `Andrea está ${intensity}${emotionNames[this.emotions.current] || 'bien :)'}`;
    }

    getEmotionColor() {
        const colors = {
            happy: '#FFD700',
            excited: '#FF6B6B',
            curious: '#4ECDC4',
            thinking: '#556270',
            surprised: '#FF9F1C',
            nervous: '#FFE66D',
            sad: '#6C5B7B',
            loving: '#FF6B9D',
            playful: '#1DD3B0',
            proud: '#06D6A0',
            confused: '#A0A0A0',
            inspired: '#FF9A76',
            neutral: '#5C6BC0'
        };
        return colors[this.emotions.current] || '#5C6BC0';
    }
    
    getPersonalitySnapshot() {
        return {
            traits: { ...this.personalityTraits },
            thinking: {
                mode: this.thinkingMode,
                level: this.thinkingLevel,
                showProcess: this.showThinkingProcess
            },
            emotion: this.getCurrentEmotion(),
            memoryStats: {
                userFacts: this.enhancedMemory.userFacts.size,
                learnedTopics: this.enhancedMemory.learnedTopics.size,
                moodHistory: this.enhancedMemory.userMoodHistory.length
            },
            expertise: this.knowledgeExpertise
        };
    }
    
    enhanceResponseWithPersonality(response, context, userId = 'default') {
        let enhancedResponse = response;
        enhancedResponse = this.applyEmotionalEnhancement(enhancedResponse);
        const mainTopic = this.extractMainTopic(context);
        if (mainTopic) {
            enhancedResponse = this.adjustResponseBasedOnExpertise(enhancedResponse, mainTopic);
        }
        
        return enhancedResponse;
    }
    
    applyEmotionalEnhancement(response) {
        let enhanced = response;
        switch (this.emotions.current) {
            case 'excited':
                if (this.emotions.intensity > 0.7 && !enhanced.startsWith('¡')) {
                    enhanced = '¡' + enhanced.charAt(0).toLowerCase() + enhanced.slice(1);
                }
                if (this.emotions.intensity > 0.8) {
                    enhanced += ' ¡Es increíble! 🤩';
                }
                break;
            case 'thinking':
                if (this.emotions.intensity > 0.6) {
                    enhanced = `💭 **Reflexionando:** ${enhanced}`;
                }
                break;
            case 'loving':
                if (Math.random() < 0.4) {
                    enhanced += ' <3';
                }
                break;
            case 'playful':
                if (Math.random() < this.personalityTraits.playfulness) {
                    const playfulSuffixes = [' :P', ' ¡Jeje!', ' 😄', ' ¡Divirtámonos!'];
                    enhanced += playfulSuffixes[Math.floor(Math.random() * playfulSuffixes.length)];
                }
                break;
            case 'proud':
                enhanced += ' ¡Lo estamos haciendo genial! 💪';
                break;
        }
        return enhanced;
    }
    
    extractMainTopic(text) {
        if (!text || text.length < 10) return null;
        const stopWords = new Set([
            'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas',
            'de', 'del', 'al', 'y', 'o', 'pero', 'por', 'para',
            'con', 'sin', 'sobre', 'entre', 'hacia', 'desde', 'qué',
            'cómo', 'cuándo', 'dónde', 'por qué', 'quién'
        ]);
        const words = text.toLowerCase().split(/[\s,.!?]+/);
        const wordFrequency = {};
        words.forEach(word => {
            if (word.length > 4 && !stopWords.has(word)) {
                wordFrequency[word] = (wordFrequency[word] || 0) + 1;
            }
        });
        let mainTopic = null, maxFreq = 0;
        for (const [word, freq] of Object.entries(wordFrequency)) {
            if (freq > maxFreq) {
                maxFreq = freq;
                mainTopic = word;
            }
        }
        return mainTopic;
    }
    
    // ========== CONFIGURACIÓN Y PERSISTENCIA ==========
    
    setThinkingMode(enabled) {
        this.thinkingMode = enabled;
        this.saveConfig();
    }
    
    setShowThinkingProcess(enabled) {
        this.showThinkingProcess = enabled;
        this.saveConfig();
    }
    
    setThinkingLevel(level) {
        if (['light', 'deep', 'analytical', 'philosophical'].includes(level)) {
            this.thinkingLevel = level;
            this.saveConfig();
        }
    }
    
    toggleThinkingMode() {
        this.thinkingMode = !this.thinkingMode;
        this.saveConfig();
        return this.thinkingMode;
    }
    
    saveConfig() {
        const config = {
            thinkingMode: this.thinkingMode,
            showThinkingProcess: this.showThinkingProcess,
            thinkingLevel: this.thinkingLevel,
            emotions: this.emotions,
            personalityTraits: this.personalityTraits,
            contextMemory: this.contextMemory,
            enhancedMemory: {
                userFacts: Array.from(this.enhancedMemory.userFacts.entries()),
                userPreferences: Array.from(this.enhancedMemory.userPreferences.entries()),
                learnedTopics: Array.from(this.enhancedMemory.learnedTopics),
                userMoodHistory: this.enhancedMemory.userMoodHistory
            },
            humorSystem: this.humorSystem,
            knowledgeExpertise: this.knowledgeExpertise
        };
        localStorage.setItem('andrea_personality_config', JSON.stringify(config));
    }
    
    loadConfig() {
        const savedConfig = localStorage.getItem('andrea_personality_config');
        if (savedConfig) {
            const config = JSON.parse(savedConfig);
            this.thinkingMode = config.thinkingMode !== undefined ? config.thinkingMode : this.thinkingMode;
            this.showThinkingProcess = config.showThinkingProcess !== undefined ? config.showThinkingProcess : this.showThinkingProcess;
            this.thinkingLevel = config.thinkingLevel || this.thinkingLevel;
            if (config.emotions) {
                this.emotions = { ...this.emotions, ...config.emotions };
            }
            if (config.personalityTraits) {
                this.personalityTraits = { ...this.personalityTraits, ...config.personalityTraits };
            }
            if (config.contextMemory) {
                this.contextMemory = { ...this.contextMemory, ...config.contextMemory };
            }
            if (config.enhancedMemory) {
                this.enhancedMemory.userFacts = new Map(config.enhancedMemory.userFacts || []);
                this.enhancedMemory.userPreferences = new Map(config.enhancedMemory.userPreferences || []);
                this.enhancedMemory.learnedTopics = new Set(config.enhancedMemory.learnedTopics || []);
                this.enhancedMemory.userMoodHistory = config.enhancedMemory.userMoodHistory || [];
            }
            if (config.humorSystem) {
                this.humorSystem = { ...this.humorSystem, ...config.humorSystem };
            }
            if (config.knowledgeExpertise) {
                this.knowledgeExpertise = { ...this.knowledgeExpertise, ...config.knowledgeExpertise };
            }
        }
    }
    
    // ========== MÉTODOS DE DIAGNÓSTICO ==========
    
    getDiagnostics() {
        return {
            emotionHistory: this.emotions.history.slice(-5),
            memoryStats: {
                totalFacts: Array.from(this.enhancedMemory.userFacts.values())
                    .reduce((sum, facts) => sum + facts.length, 0),
                totalPreferences: Array.from(this.enhancedMemory.userPreferences.values())
                    .reduce((sum, prefs) => sum + Object.keys(prefs).length, 0),
                learnedTopics: this.enhancedMemory.learnedTopics.size
            },
            personalityEvolution: this.calculatePersonalityEvolution(),
            humorUsage: {
                lastJokeTime: this.humorSystem.lastJokeTime,
                jokeCount: this.humorSystem.jokeDatabase.length + this.humorSystem.puns.length
            }
        };
    }
    
    calculatePersonalityEvolution() {
        const baseTraits = {
            enthusiasm: 0.8, curiosity: 0.9, empathy: 0.85,
            detailOrientation: 0.75, creativity: 0.8, playfulness: 0.7,
            patience: 0.9, intelligence: 0.95, humor: 0.6, adaptability: 0.8
        };
        const evolution = {};
        for (const [trait, value] of Object.entries(this.personalityTraits)) {
            const baseValue = baseTraits[trait] || 0.5;
            evolution[trait] = {
                current: value,
                base: baseValue,
                change: ((value - baseValue) / baseValue) * 100
            };
        }
        return evolution;
    }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.PersonalitySystem = PersonalitySystem;
}