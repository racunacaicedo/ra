/* ===================================================================== */
/* ADVANCED CHATBOT MODULE - advanced-chatbot.js */
/* ===================================================================== */

class AdvancedChatbot {
    constructor() {
        this.isListening = false;
        this.isSpeaking = false;
        this.conversationContext = [];
        this.userLanguage = 'es-ES';
        this.botPersonality = this.initializeBotPersonality();
        this.apiConfig = {
            openai: {
                apiKey: null,
                model: 'gpt-3.5-turbo',
                maxTokens: 500
            },
            elevenlabs: {
                apiKey: null,
                voiceId: 'EXAVITQu4vr4xnSDxMaL'
            }
        };

        this.speechSupport = {
            recognition: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
            synthesis: 'speechSynthesis' in window
        };

        this.isInitialized = false;
    }

    initializeBotPersonality() {
        return {
            name: "Roberto AI Assistant",
            role: "Asistente personal de Roberto Acuña Caicedo, especialista en IA",
            personality: "Profesional, amigable, conocedor y orientado a soluciones",
            knowledge: {
                roberto: {
                    experience: "25+ años de experiencia",
                    education: "PhD en Ingeniería, Magister en Sistemas, Magister en Docencia",
                    positions: "CEO de Creinti, Presidente de FEIA",
                    books: ["Tesis y artículos científicos con IA", "El poder del Prompt"],
                    location: "Manabí, Ecuador",
                    languages: ["Español", "Inglés"],
                    specialties: ["Consultoría IA", "Capacitación", "Investigación", "Implementación"]
                },
                services: {
                    empresas: ["Auditoría IA", "Implementación de soluciones", "Capacitación empresarial"],
                    instituciones: ["IA para servicios públicos", "Programas educativos"],
                    investigadores: ["Colaboración en investigación", "Servicios académicos"],
                    profesionales: ["Recursos educativos", "Consultoría individual"]
                },
                contact: {
                    whatsapp: "+593 098 712 1170",
                    email: "contacto@robertoacunacaicedo.com",
                    linkedin: "roberto-acuña-627",
                    location: "Manabí, Ecuador"
                }
            }
        };
    }

    init() {
        if (this.isInitialized) {
            console.log('Chatbot avanzado ya está inicializado');
            return;
        }

        this.createAdvancedInterface();
        this.setupSpeechRecognition();
        this.setupSpeechSynthesis();
        this.bindAdvancedEvents();
        this.loadApiKeys();
        this.isInitialized = true;

        console.log('🤖 Chatbot AI Avanzado inicializado');
    }

    createAdvancedInterface() {
        // Eliminar modal existente si existe
        const existingModal = document.getElementById('aiChatbotModal');
        if (existingModal) {
            existingModal.remove();
        }

        const modalHTML = `
            <div class="ai-chatbot-modal advanced-chatbot" id="aiChatbotModal" style="display: none;">
                <div class="chatbot-container advanced-container">
                    <!-- Header mejorado -->
                    <div class="chatbot-header advanced-header">
                        <div class="chatbot-info">
                            <div class="chatbot-avatar">
                                <div class="avatar-animation"></div>
                                🤖
                            </div>
                            <div class="chatbot-details">
                                <h4>Roberto AI Assistant</h4>
                                <span class="status online">
                                    <span class="status-dot"></span>
                                    En línea • Con IA avanzada
                                </span>
                            </div>
                        </div>
                        <div class="header-controls">
                            <button class="control-btn settings-btn" id="chatbotSettings" title="Configuración">
                                ⚙️
                            </button>
                            <button class="control-btn voice-toggle" id="voiceToggle" title="Activar/Desactivar voz">
                                🔊
                            </button>
                            <button class="close-chatbot-btn" onclick="closeAIChatbot()">×</button>
                        </div>
                    </div>

                    <!-- Panel de configuración -->
                    <div class="settings-panel" id="settingsPanel" style="display: none;">
                        <div class="settings-content">
                            <h5>⚙️ Configuración del Asistente</h5>
                            <div class="setting-group">
                                <label>OpenAI API Key (opcional para respuestas avanzadas):</label>
                                <input type="password" id="openaiKey" placeholder="sk-..." class="api-input">
                                <small>Para respuestas más inteligentes y naturales</small>
                            </div>
                            <div class="setting-group">
                                <label>Idioma de reconocimiento de voz:</label>
                                <select id="voiceLanguage" class="voice-select">
                                    <option value="es-ES">Español (España)</option>
                                    <option value="es-MX">Español (México)</option>
                                    <option value="es-AR">Español (Argentina)</option>
                                    <option value="en-US">English (US)</option>
                                </select>
                            </div>
                            <div class="setting-group">
                                <label>Velocidad de voz del bot:</label>
                                <input type="range" id="speechRate" min="0.5" max="2" step="0.1" value="1" class="speed-slider">
                                <span id="speedValue">1.0x</span>
                            </div>
                            <button class="btn-save-settings" onclick="window.advancedChatbot.saveSettings()">
                                💾 Guardar configuración
                            </button>
                        </div>
                    </div>

                    <!-- Área de mensajes mejorada -->
                    <div class="chatbot-messages advanced-messages" id="chatbotMessages">
                        <div class="message bot-message welcome-message">
                            <div class="message-avatar">🤖</div>
                            <div class="message-content">
                                <div class="typing-animation" style="display: none;">
                                    <span></span><span></span><span></span>
                                </div>
                                <p>¡Hola! Soy el asistente personal avanzado de Roberto Acuña. 
                                   Puedo ayudarte con información detallada, agendar reuniones, y mucho más.</p>
                                <div class="advanced-options">
                                    <button class="option-btn" onclick="window.advancedChatbot.sendQuickMessage('¿Qué servicios ofrece Roberto?')">
                                        🔍 Servicios disponibles
                                    </button>
                                    <button class="option-btn" onclick="window.advancedChatbot.sendQuickMessage('Quiero agendar una reunión')">
                                        📅 Agendar reunión
                                    </button>
                                    <button class="option-btn" onclick="window.advancedChatbot.sendQuickMessage('Información sobre libros y recursos')">
                                        📚 Libros y recursos
                                    </button>
                                </div>
                                <div class="voice-hint">
                                    💡 <strong>Tip:</strong> Puedes hablar directamente usando el botón de micrófono
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Input avanzado con voz -->
                    <div class="chatbot-input advanced-input">
                        <div class="input-container">
                            <button class="voice-btn" id="voiceBtn" title="Mantén presionado para hablar">
                                🎤
                            </button>
                            <input type="text" id="chatbotInput" placeholder="Escribe tu pregunta o usa el micrófono..." 
                                   class="message-input">
                            <button class="send-btn" onclick="window.advancedChatbot.sendMessage()">
                                <span class="send-icon">📤</span>
                            </button>
                        </div>
                        <div class="voice-feedback" id="voiceFeedback" style="display: none;">
                            <div class="listening-animation">
                                <span class="wave"></span>
                                <span class="wave"></span>
                                <span class="wave"></span>
                            </div>
                            <span class="feedback-text">Escuchando...</span>
                        </div>
                        <div class="input-suggestions" id="inputSuggestions"></div>
                    </div>

                    <!-- Indicadores de estado -->
                    <div class="status-indicators">
                        <div class="indicator" id="apiStatus">
                            <span class="indicator-light offline"></span>
                            <span class="indicator-text">API: No configurada</span>
                        </div>
                        <div class="indicator" id="voiceStatus">
                            <span class="indicator-light ${this.speechSupport.recognition ? 'online' : 'offline'}"></span>
                            <span class="indicator-text">Voz: ${this.speechSupport.recognition ? 'Disponible' : 'No soportada'}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.addAdvancedStyles();
    }

    addAdvancedStyles() {
        if (document.querySelector('#advanced-chatbot-styles')) {
            return; // Ya existen los estilos
        }

        const styles = `
            <style id="advanced-chatbot-styles">
                .advanced-chatbot {
                    backdrop-filter: blur(20px);
                    background: rgba(0, 17, 34, 0.95);
                }

                .advanced-container {
                    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
                    border-radius: 20px;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
                    overflow: hidden;
                    max-width: 600px;
                    height: 700px;
                    display: flex;
                    flex-direction: column;
                }

                .advanced-header {
                    background: linear-gradient(135deg, #1e40af, #3b82f6);
                    padding: 20px;
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .chatbot-avatar {
                    position: relative;
                    width: 50px;
                    height: 50px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                }

                .avatar-animation {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    animation: avatarPulse 2s infinite;
                }

                @keyframes avatarPulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.7; }
                }

                .status {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 0.85rem;
                }

                .status-dot {
                    width: 8px;
                    height: 8px;
                    background: #10b981;
                    border-radius: 50%;
                    animation: statusBlink 1.5s infinite;
                }

                @keyframes statusBlink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }

                .header-controls {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                }

                .control-btn {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    width: 35px;
                    height: 35px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 1rem;
                }

                .control-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(1.1);
                }

                .settings-panel {
                    background: #f8fafc;
                    border-bottom: 1px solid #e2e8f0;
                    padding: 20px;
                    max-height: 300px;
                    overflow-y: auto;
                }

                .setting-group {
                    margin-bottom: 15px;
                }

                .setting-group label {
                    display: block;
                    font-weight: 600;
                    color: #374151;
                    margin-bottom: 5px;
                    font-size: 0.9rem;
                }

                .api-input, .voice-select {
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    font-size: 0.9rem;
                }

                .speed-slider {
                    width: 80%;
                    margin-right: 10px;
                }

                .btn-save-settings {
                    background: linear-gradient(135deg, #10b981, #059669);
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 0.9rem;
                    transition: all 0.3s ease;
                }

                .btn-save-settings:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
                }

                .advanced-messages {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                    background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
                }

                .welcome-message .message-content {
                    background: linear-gradient(135deg, #eff6ff, #dbeafe);
                    border: 1px solid #3b82f6;
                    border-radius: 15px;
                    padding: 15px;
                }

                .advanced-options {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    margin: 15px 0;
                }

                .option-btn {
                    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                    color: white;
                    border: none;
                    padding: 10px 15px;
                    border-radius: 10px;
                    cursor: pointer;
                    font-size: 0.9rem;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    text-align: left;
                }

                .option-btn:hover {
                    transform: translateX(5px);
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                }

                .voice-hint {
                    background: rgba(16, 185, 129, 0.1);
                    border: 1px solid rgba(16, 185, 129, 0.3);
                    border-radius: 8px;
                    padding: 10px;
                    margin-top: 10px;
                    font-size: 0.85rem;
                    color: #065f46;
                }

                .advanced-input {
                    padding: 20px;
                    background: white;
                    border-top: 1px solid #e5e7eb;
                }

                .input-container {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                    background: #f9fafb;
                    border: 2px solid #e5e7eb;
                    border-radius: 25px;
                    padding: 5px;
                    transition: all 0.3s ease;
                }

                .input-container:focus-within {
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }

                .voice-btn {
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                    color: white;
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 1.2rem;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                .voice-btn:hover {
                    transform: scale(1.1);
                    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
                }

                .voice-btn.listening {
                    background: linear-gradient(135deg, #10b981, #059669);
                    animation: voicePulse 1s infinite;
                }

                @keyframes voicePulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }

                .message-input {
                    flex: 1;
                    border: none;
                    background: transparent;
                    padding: 12px 15px;
                    font-size: 1rem;
                    outline: none;
                    border-radius: 20px;
                }

                .send-btn {
                    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                    color: white;
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .send-btn:hover {
                    transform: scale(1.1);
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                }

                .voice-feedback {
                    background: rgba(16, 185, 129, 0.1);
                    border: 1px solid rgba(16, 185, 129, 0.3);
                    border-radius: 10px;
                    padding: 10px;
                    margin-top: 10px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: #065f46;
                }

                .listening-animation {
                    display: flex;
                    gap: 3px;
                }

                .wave {
                    width: 4px;
                    height: 20px;
                    background: #10b981;
                    border-radius: 2px;
                    animation: wave 1.5s infinite ease-in-out;
                }

                .wave:nth-child(2) { animation-delay: 0.3s; }
                .wave:nth-child(3) { animation-delay: 0.6s; }

                @keyframes wave {
                    0%, 100% { transform: scaleY(0.5); opacity: 0.5; }
                    50% { transform: scaleY(1); opacity: 1; }
                }

                .status-indicators {
                    display: flex;
                    justify-content: space-between;
                    padding: 10px 20px;
                    background: #f8fafc;
                    border-top: 1px solid #e5e7eb;
                    font-size: 0.8rem;
                }

                .indicator {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }

                .indicator-light {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #ef4444;
                }

                .indicator-light.online {
                    background: #10b981;
                }

                .indicator-light.offline {
                    background: #ef4444;
                }

                .typing-animation {
                    display: flex;
                    gap: 4px;
                    padding: 10px 0;
                }

                .typing-animation span {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #3b82f6;
                    animation: typing 1.4s infinite ease-in-out;
                }

                .typing-animation span:nth-child(2) { animation-delay: 0.2s; }
                .typing-animation span:nth-child(3) { animation-delay: 0.4s; }

                @keyframes typing {
                    0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
                    40% { transform: scale(1); opacity: 1; }
                }

                .input-suggestions {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 5px;
                    margin-top: 10px;
                }

                .suggestion-chip {
                    background: #e5e7eb;
                    color: #374151;
                    padding: 5px 10px;
                    border-radius: 15px;
                    font-size: 0.8rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .suggestion-chip:hover {
                    background: #3b82f6;
                    color: white;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .advanced-container {
                        width: 95%;
                        height: 90vh;
                        max-width: none;
                    }

                    .advanced-options {
                        flex-direction: column;
                    }
                    
                    .option-btn {
                        width: 100%;
                    }
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    setupSpeechRecognition() {
        if (!this.speechSupport.recognition) {
            console.log('❌ Reconocimiento de voz no soportado');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();

        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = this.userLanguage;
        this.recognition.maxAlternatives = 1;

        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateVoiceUI(true);
        };

        this.recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            const input = document.getElementById('chatbotInput');
            if (finalTranscript) {
                input.value = finalTranscript;
                this.sendMessage();
            } else {
                input.value = interimTranscript;
            }
        };

        this.recognition.onerror = (event) => {
            console.error('Error en reconocimiento de voz:', event.error);
            this.handleVoiceError(event.error);
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.updateVoiceUI(false);
        };

        console.log('🎤 Reconocimiento de voz configurado');
    }

    setupSpeechSynthesis() {
        if (!this.speechSupport.synthesis) {
            console.log('❌ Síntesis de voz no soportada');
            return;
        }

        this.synthesis = window.speechSynthesis;
        this.voices = [];

        const loadVoices = () => {
            this.voices = this.synthesis.getVoices();
            console.log('🔊 Voces cargadas:', this.voices.length);
        };

        if (this.synthesis.onvoiceschanged !== undefined) {
            this.synthesis.onvoiceschanged = loadVoices;
        }
        loadVoices();

        console.log('🔊 Síntesis de voz configurada');
    }

    bindAdvancedEvents() {
        // Botón de voz
        const voiceBtn = document.getElementById('voiceBtn');
        if (voiceBtn && this.speechSupport.recognition) {
            voiceBtn.addEventListener('mousedown', () => this.startListening());
            voiceBtn.addEventListener('mouseup', () => this.stopListening());
            voiceBtn.addEventListener('mouseleave', () => this.stopListening());

            // Para móviles
            voiceBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.startListening();
            });
            voiceBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.stopListening();
            });
        }

        // Configuración
        const settingsBtn = document.getElementById('chatbotSettings');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.toggleSettings());
        }

        // Toggle de voz
        const voiceToggle = document.getElementById('voiceToggle');
        if (voiceToggle) {
            voiceToggle.addEventListener('click', () => this.toggleVoiceOutput());
        }

        // Input con Enter
        const input = document.getElementById('chatbotInput');
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });

            input.addEventListener('input', () => {
                this.showSuggestions(input.value);
            });
        }

        // Configuración de velocidad
        const speedSlider = document.getElementById('speechRate');
        const speedValue = document.getElementById('speedValue');
        if (speedSlider && speedValue) {
            speedSlider.addEventListener('input', (e) => {
                speedValue.textContent = e.target.value + 'x';
            });
        }

        console.log('🔗 Eventos avanzados configurados');
    }

    // [RESTO DE MÉTODOS CONTINÚAN IGUAL...]
    // Por brevedad, incluyo solo algunos métodos críticos

    startListening() {
        if (!this.speechSupport.recognition || this.isListening) return;

        try {
            this.recognition.start();
            const feedback = document.getElementById('voiceFeedback');
            if (feedback) feedback.style.display = 'flex';
        } catch (error) {
            console.error('Error al iniciar reconocimiento:', error);
        }
    }

    stopListening() {
        if (!this.speechSupport.recognition || !this.isListening) return;

        try {
            this.recognition.stop();
            const feedback = document.getElementById('voiceFeedback');
            if (feedback) feedback.style.display = 'none';
        } catch (error) {
            console.error('Error al detener reconocimiento:', error);
        }
    }

    async sendMessage() {
        const input = document.getElementById('chatbotInput');
        const message = input.value.trim();

        if (!message) return;

        this.addUserMessage(message);
        input.value = '';
        this.hideSuggestions();

        this.conversationContext.push({
            role: 'user',
            content: message,
            timestamp: new Date()
        });

        this.showTypingIndicator();

        try {
            const response = await this.generateAdvancedResponse(message);
            this.hideTypingIndicator();
            this.addBotMessage(response);

            if (this.shouldSpeak()) {
                this.speakMessage(response);
            }

        } catch (error) {
            this.hideTypingIndicator();
            console.error('Error generando respuesta:', error);
            this.addBotMessage("Disculpa, hubo un error procesando tu mensaje. ¿Podrías intentar de nuevo?");
        }
    }

    sendQuickMessage(message) {
        const input = document.getElementById('chatbotInput');
        if (input) {
            input.value = message;
            this.sendMessage();
        }
    }

    async generateAdvancedResponse(message) {
        // Verificar si hay API key de OpenAI
        if (this.apiConfig.openai.apiKey) {
            try {
                return await this.getOpenAIResponse(message);
            } catch (error) {
                console.error('Error con OpenAI:', error);
            }
        }

        return this.getIntelligentLocalResponse(message);
    }

    getIntelligentLocalResponse(message) {
        const msg = message.toLowerCase();
        const intent = this.detectIntent(msg);

        switch (intent) {
            case 'servicios':
                return this.getServicesResponse(msg);
            case 'precios':
                return this.getPricingResponse(msg);
            case 'disponibilidad':
                return this.getAvailabilityResponse(msg);
            case 'contacto':
                return this.getContactResponse(msg);
            case 'libros':
                return this.getBooksResponse(msg);
            case 'experiencia':
                return this.getExperienceResponse();
            case 'saludo':
                return this.getGreetingResponse();
            case 'despedida':
                return this.getFarewellResponse();
            default:
                return this.getDefaultResponse(message);
        }
    }

    detectIntent(message) {
        const intents = {
            servicios: ['servicio', 'consultoría', 'asesoría', 'implementación', 'auditoría', 'capacitación'],
            precios: ['precio', 'costo', 'cotización', 'tarifa', 'honorarios', '¿cuánto'],
            disponibilidad: ['disponible', 'agendar', 'reunión', 'cita', 'horario', 'tiempo'],
            contacto: ['contacto', 'whatsapp', 'email', 'teléfono', 'llamar', 'escribir'],
            libros: ['libro', 'publicación', 'tesis', 'prompt', 'recurso', 'leer'],
            experiencia: ['experiencia', 'trayectoria', 'curriculum', 'antecedentes', 'estudios'],
            saludo: ['hola', 'buenos días', 'buenas tardes', 'saludos', 'hey'],
            despedida: ['adiós', 'hasta luego', 'gracias', 'bye', 'nos vemos']
        };

        for (const [intent, keywords] of Object.entries(intents)) {
            if (keywords.some(keyword => message.includes(keyword))) {
                return intent;
            }
        }

        return 'general';
    }

    // Métodos de respuesta específicas (resumidos)
    getServicesResponse(message) {
        return `Roberto ofrece servicios especializados:

**🏢 Para Empresas:**
• Auditoría IA y estrategia
• Implementación de soluciones
• Capacitación empresarial

**🏛️ Para Instituciones:**
• IA para servicios públicos
• Programas educativos

**🎓 Para Investigadores:**
• Colaboración en investigación
• Servicios académicos

**👤 Para Profesionales:**
• Recursos educativos
• Consultoría individual

¿En cuál categoría te encuentras?`;
    }

    getPricingResponse() {
        return `Los precios varían según el proyecto:

**💼 Auditoría IA:** Desde $500 USD
**⚙️ Implementación:** $1,500 - $10,000 USD
**📚 Capacitación:** $200 USD/persona
**🤝 Consultoría:** $150 USD/hora

¿Te gustaría agendar una consulta gratuita?`;
    }

    getContactResponse() {
        return `Contacta a Roberto:

**📱 WhatsApp:** +593 098 712 1170
**📧 Email:** contacto@robertoacunacaicedo.com
**💼 LinkedIn:** roberto-acuña-627
**📍 Ubicación:** Manabí, Ecuador

¿Cuál prefieres para tu consulta?`;
    }

    // Métodos de UI
    addUserMessage(message) {
        const messagesContainer = document.getElementById('chatbotMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.innerHTML = `
            <div class="message-avatar">👤</div>
            <div class="message-content">
                <p>${this.escapeHtml(message)}</p>
            </div>
        `;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    addBotMessage(message) {
        const messagesContainer = document.getElementById('chatbotMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        messageDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <p>${message}</p>
            </div>
        `;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        this.conversationContext.push({
            role: 'assistant',
            content: message,
            timestamp: new Date()
        });
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatbotMessages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-message';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <div class="typing-animation">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const typing = document.getElementById('typing-indicator');
        if (typing) typing.remove();
    }

    updateVoiceUI(listening) {
        const voiceBtn = document.getElementById('voiceBtn');
        const feedback = document.getElementById('voiceFeedback');

        if (voiceBtn) {
            if (listening) {
                voiceBtn.classList.add('listening');
                voiceBtn.textContent = '🔴';
            } else {
                voiceBtn.classList.remove('listening');
                voiceBtn.textContent = '🎤';
            }
        }

        if (feedback) {
            feedback.style.display = listening ? 'flex' : 'none';
        }
    }

    toggleSettings() {
        const panel = document.getElementById('settingsPanel');
        if (panel) {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        }
    }

    saveSettings() {
        const openaiKey = document.getElementById('openaiKey')?.value;
        const voiceLanguage = document.getElementById('voiceLanguage')?.value;

        if (openaiKey) {
            this.apiConfig.openai.apiKey = openaiKey;
            this.updateAPIStatus(true);
            localStorage.setItem('chatbot_openai_key', openaiKey);
        }

        if (voiceLanguage) {
            this.userLanguage = voiceLanguage;
            if (this.recognition) {
                this.recognition.lang = voiceLanguage;
            }
            localStorage.setItem('chatbot_voice_language', voiceLanguage);
        }

        this.showSettingsSaved();
        setTimeout(() => this.toggleSettings(), 1000);
    }

    loadApiKeys() {
        const savedKey = localStorage.getItem('chatbot_openai_key');
        const savedLanguage = localStorage.getItem('chatbot_voice_language');

        if (savedKey) {
            this.apiConfig.openai.apiKey = savedKey;
            this.updateAPIStatus(true);
            const input = document.getElementById('openaiKey');
            if (input) input.value = savedKey;
        }

        if (savedLanguage) {
            this.userLanguage = savedLanguage;
            const select = document.getElementById('voiceLanguage');
            if (select) select.value = savedLanguage;
        }
    }

    updateAPIStatus(connected) {
        const status = document.getElementById('apiStatus');
        if (status) {
            const light = status.querySelector('.indicator-light');
            const text = status.querySelector('.indicator-text');

            if (connected) {
                light.className = 'indicator-light online';
                text.textContent = 'API: OpenAI conectada';
            } else {
                light.className = 'indicator-light offline';
                text.textContent = 'API: Respuestas locales';
            }
        }
    }

    showSettingsSaved() {
        const panel = document.getElementById('settingsPanel');
        const message = document.createElement('div');
        message.style.cssText = `
            background: #10b981;
            color: white;
            padding: 10px;
            border-radius: 6px;
            margin-top: 10px;
            text-align: center;
            font-weight: 600;
        `;
        message.textContent = '✅ Configuración guardada exitosamente';

        panel.appendChild(message);

        setTimeout(() => {
            message.remove();
        }, 2000);
    }

    // Métodos adicionales importantes
    shouldSpeak() {
        const voiceToggle = document.getElementById('voiceToggle');
        return voiceToggle && !voiceToggle.classList.contains('disabled');
    }

    toggleVoiceOutput() {
        const voiceToggle = document.getElementById('voiceToggle');
        if (voiceToggle) {
            voiceToggle.classList.toggle('disabled');

            if (voiceToggle.classList.contains('disabled')) {
                voiceToggle.textContent = '🔇';
                if (this.isSpeaking && this.synthesis) {
                    this.synthesis.cancel();
                }
            } else {
                voiceToggle.textContent = '🔊';
            }
        }
    }

    speakMessage(message) {
        if (!this.speechSupport.synthesis || this.isSpeaking) return;

        const cleanMessage = message
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/\[(.*?)\]\(.*?\)/g, '$1')
            .replace(/[🔸🔹📋💰📅📚🤝💡🙏🌟👋⭐🛒📖📘📱📧💼📍🌐⚡]/g, '')
            .replace(/\n\n/g, '. ')
            .replace(/\n/g, '. ')
            .trim();

        const utterance = new SpeechSynthesisUtterance(cleanMessage);

        const spanishVoice = this.voices.find(voice =>
            voice.lang.includes('es') || voice.lang.includes('ES')
        );

        if (spanishVoice) {
            utterance.voice = spanishVoice;
        }

        utterance.rate = parseFloat(document.getElementById('speechRate')?.value || 1);
        utterance.pitch = 1;
        utterance.volume = 0.8;

        utterance.onstart = () => {
            this.isSpeaking = true;
            this.updateSpeakingUI(true);
        };

        utterance.onend = () => {
            this.isSpeaking = false;
            this.updateSpeakingUI(false);
        };

        this.synthesis.speak(utterance);
    }

    updateSpeakingUI(speaking) {
        const voiceToggle = document.getElementById('voiceToggle');
        if (voiceToggle) {
            voiceToggle.style.opacity = speaking ? '0.6' : '1';
        }
    }

    showSuggestions(input) {
        // Implementación de sugerencias
    }

    hideSuggestions() {
        const suggestionsContainer = document.getElementById('inputSuggestions');
        if (suggestionsContainer) {
            suggestionsContainer.style.display = 'none';
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    handleVoiceError(error) {
        const errorMessages = {
            'network': 'Error de conexión. Verifica tu internet.',
            'not-allowed': 'Permisos de micrófono denegados.',
            'no-speech': 'No se detectó voz. Intenta de nuevo.',
            'audio-capture': 'Error en la captura de audio.',
            'service-not-allowed': 'Servicio de voz no disponible.'
        };

        const message = errorMessages[error] || 'Error de reconocimiento de voz';
        this.showVoiceError(message);
    }

    showVoiceError(message) {
        const feedback = document.getElementById('voiceFeedback');
        if (feedback) {
            feedback.innerHTML = `
                <div style="color: #dc2626; display: flex; align-items: center; gap: 8px;">
                    <span>❌</span>
                    <span>${message}</span>
                </div>
            `;

            setTimeout(() => {
                feedback.style.display = 'none';
            }, 3000);
        }
    }

    // Métodos de respuesta adicionales (versiones resumidas)
    getGreetingResponse() {
        return `¡Hola! Soy el asistente avanzado de Roberto Acuña.

Puedo ayudarte con:
• Información sobre servicios
• Agendar reuniones  
• Cotizaciones
• Recursos y libros

💡 Tip: Puedes hablarme usando el micrófono

¿En qué puedo ayudarte?`;
    }

    getFarewellResponse() {
        return `¡Gracias por tu tiempo!

Contacto directo:
• WhatsApp: +593 098 712 1170
• Email: contacto@robertoacunacaicedo.com

¡Que tengas un excelente día!`;
    }

    getDefaultResponse(message) {
        return `Entiendo tu consulta sobre "${message}".

Como asistente de Roberto, puedo ayudarte con:
• Información específica sobre servicios
• Cotizaciones personalizadas  
• Agendar reuniones
• Recursos educativos

Para consultas técnicas complejas:
• WhatsApp: +593 098 712 1170
• Email: contacto@robertoacunacaicedo.com

¿Hay algo específico en lo que pueda orientarte?`;
    }

    getAvailabilityResponse() {
        return `Roberto está disponible para:

✅ Reuniones virtuales (Zoom, Google Meet)
✅ Proyectos remotos internacionales
✅ Consultas presenciales (Ecuador)

⏰ Horarios:
• Lunes a Viernes: 9:00 AM - 6:00 PM (ECT)
• Sábados: 9:00 AM - 1:00 PM

📅 Para agendar:
• WhatsApp: +593 098 712 1170
• Email: contacto@robertoacunacaicedo.com

¿Prefieres virtual o presencial?`;
    }

    getBooksResponse() {
        return `Roberto ha publicado libros especializados:

📖 "Tesis y artículos científicos con IA"
• Metodologías de investigación con IA
• 15+ herramientas online
• ⭐ 4.8/5 estrellas

📘 "El poder del Prompt"  
• 105+ prompts profesionales
• Ejemplos por industria
• ⭐ 4.9/5 estrellas

Ambos disponibles en Amazon.

¿Te interesa algún libro en particular?`;
    }

    getExperienceResponse() {
        return `Roberto Acuña tiene sólida trayectoria:

🎓 Formación:
• PhD en Ingeniería (PUCP)
• Magister en Sistemas (ESPOL)
• Magister en Docencia (UNL)

💼 Experiencia:
• 25+ años en tecnología
• CEO de Creinti
• Presidente de FEIA

📊 Resultados:
• 2000+ profesionales capacitados
• 50+ proyectos implementados
• 15+ publicaciones científicas

¿Te interesa algún aspecto específico?`;
    }

    destroy() {
        if (this.recognition) {
            this.recognition.stop();
        }
        if (this.synthesis) {
            this.synthesis.cancel();
        }

        const modal = document.getElementById('aiChatbotModal');
        if (modal) {
            modal.remove();
        }

        const styles = document.getElementById('advanced-chatbot-styles');
        if (styles) {
            styles.remove();
        }

        console.log('🗑️ Chatbot avanzado destruido');
    }
}

// Exportar la clase
window.AdvancedChatbot = AdvancedChatbot;