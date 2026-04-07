/* ===================================================================== */
/* SOLUCIÓN COMPLETA PARA EL CHATBOT - CHATBOT-FIX.JS */
/* ===================================================================== */

// 1. ASEGURAR QUE LAS FUNCIONES GLOBALES SIEMPRE EXISTAN
(function() {
    'use strict';

    console.log('🔧 Iniciando corrección del chatbot...');

    // Variables globales
    let chatbotInitialized = false;
    let chatbotQueue = [];

    // 2. FUNCIONES GLOBALES INMEDIATAS (SIEMPRE DISPONIBLES)
    window.openAIChatbot = function() {
        console.log('🚀 openAIChatbot llamada');

        // Si el chatbot avanzado está listo, usarlo
        if (window.advancedChatbot && window.advancedChatbot.isInitialized) {
            console.log('✅ Usando chatbot avanzado');
            openAdvancedChatbot();
            return;
        }

        // Si la clase existe pero no está inicializada, inicializar
        if (typeof AdvancedChatbot !== 'undefined' && !window.advancedChatbot) {
            console.log('🔄 Inicializando chatbot avanzado...');
            try {
                window.advancedChatbot = new AdvancedChatbot();
                window.advancedChatbot.init();

                // Intentar abrir después de la inicialización
                setTimeout(() => {
                    openAdvancedChatbot();
                }, 500);
                return;
            } catch (error) {
                console.error('❌ Error inicializando chatbot avanzado:', error);
            }
        }

        // Fallback: chatbot básico
        console.log('🔄 Usando chatbot básico como fallback');
        openBasicChatbot();
    };

    window.closeAIChatbot = function() {
        console.log('❌ closeAIChatbot llamada');

        // Intentar cerrar chatbot avanzado
        const advancedModal = document.getElementById('aiChatbotModal');
        if (advancedModal) {
            advancedModal.style.display = 'none';
            document.body.style.overflow = '';
            return;
        }

        // Fallback: cerrar modal básico
        const basicModal = document.getElementById('basicChatbotModal');
        if (basicModal) {
            basicModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    };

    // 3. FUNCIÓN PARA ABRIR CHATBOT AVANZADO
    function openAdvancedChatbot() {
        const modal = document.getElementById('aiChatbotModal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';

            setTimeout(() => {
                const input = document.getElementById('chatbotInput');
                if (input) input.focus();
            }, 300);

            // Analytics
            trackChatbotEvent('Advanced Chatbot', 'Open');
        } else {
            console.warn('⚠️ Modal del chatbot avanzado no encontrado');
            openBasicChatbot();
        }
    }

    // 4. CHATBOT BÁSICO COMO FALLBACK
    function openBasicChatbot() {
        console.log('🔧 Creando chatbot básico...');

        // Remover modal existente si existe
        const existingModal = document.getElementById('basicChatbotModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Crear modal básico
        const modalHTML = `
            <div id="basicChatbotModal" class="ai-chatbot-modal" style="
                display: flex;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                z-index: 10000;
                align-items: center;
                justify-content: center;
            ">
                <div style="
                    background: white;
                    border-radius: 15px;
                    width: 90%;
                    max-width: 500px;
                    max-height: 80vh;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
                ">
                    <!-- Header -->
                    <div style="
                        background: linear-gradient(135deg, #1e40af, #3b82f6);
                        padding: 20px;
                        color: white;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-radius: 15px 15px 0 0;
                    ">
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <div style="
                                width: 50px;
                                height: 50px;
                                background: rgba(255, 255, 255, 0.2);
                                border-radius: 50%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 1.5rem;
                            ">🤖</div>
                            <div>
                                <h4 style="margin: 0; font-size: 1.2rem;">Asistente de Roberto</h4>
                                <span style="font-size: 0.9rem; opacity: 0.9;">En línea</span>
                            </div>
                        </div>
                        <button onclick="closeAIChatbot()" style="
                            background: rgba(255, 255, 255, 0.2);
                            border: none;
                            color: white;
                            width: 35px;
                            height: 35px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-size: 1.2rem;
                        ">×</button>
                    </div>

                    <!-- Mensajes -->
                    <div id="basicChatMessages" style="
                        flex: 1;
                        padding: 20px;
                        overflow-y: auto;
                        background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
                    ">
                        <div style="
                            background: linear-gradient(135deg, #eff6ff, #dbeafe);
                            border: 1px solid #3b82f6;
                            border-radius: 15px;
                            padding: 15px;
                            margin-bottom: 15px;
                        ">
                            <p style="margin: 0 0 15px 0; color: #1e40af; font-weight: 600;">
                                ¡Hola! Soy el asistente de Roberto Acuña. ¿En qué puedo ayudarte?
                            </p>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                <button onclick="sendBasicMessage('¿Qué servicios ofrece Roberto?')" style="
                                    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                                    color: white;
                                    border: none;
                                    padding: 10px 15px;
                                    border-radius: 10px;
                                    cursor: pointer;
                                    font-size: 0.9rem;
                                    text-align: left;
                                ">📋 Servicios disponibles</button>
                                <button onclick="sendBasicMessage('Quiero agendar una reunión')" style="
                                    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                                    color: white;
                                    border: none;
                                    padding: 10px 15px;
                                    border-radius: 10px;
                                    cursor: pointer;
                                    font-size: 0.9rem;
                                    text-align: left;
                                ">📅 Agendar reunión</button>
                                <button onclick="sendBasicMessage('Información sobre libros y recursos')" style="
                                    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                                    color: white;
                                    border: none;
                                    padding: 10px 15px;
                                    border-radius: 10px;
                                    cursor: pointer;
                                    font-size: 0.9rem;
                                    text-align: left;
                                ">📚 Libros y recursos</button>
                            </div>
                        </div>
                    </div>

                    <!-- Input -->
                    <div style="
                        padding: 20px;
                        background: white;
                        border-top: 1px solid #e5e7eb;
                        border-radius: 0 0 15px 15px;
                    ">
                        <div style="
                            display: flex;
                            gap: 10px;
                            align-items: center;
                            background: #f9fafb;
                            border: 2px solid #e5e7eb;
                            border-radius: 25px;
                            padding: 5px;
                        ">
                            <input type="text" id="basicChatInput" placeholder="Escribe tu pregunta..." style="
                                flex: 1;
                                border: none;
                                background: transparent;
                                padding: 12px 15px;
                                font-size: 1rem;
                                outline: none;
                            " onkeypress="if(event.key==='Enter') sendBasicMessage()">
                            <button onclick="sendBasicMessage()" style="
                                background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                                color: white;
                                border: none;
                                width: 40px;
                                height: 40px;
                                border-radius: 50%;
                                cursor: pointer;
                                font-size: 1.2rem;
                            ">📤</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.body.style.overflow = 'hidden';

        // Focus en el input
        setTimeout(() => {
            const input = document.getElementById('basicChatInput');
            if (input) input.focus();
        }, 100);

        trackChatbotEvent('Basic Chatbot', 'Open');
        console.log('✅ Chatbot básico creado y mostrado');
    }

    // 5. FUNCIÓN PARA ENVIAR MENSAJES EN CHATBOT BÁSICO
    window.sendBasicMessage = function(message) {
        const input = document.getElementById('basicChatInput');
        const messagesContainer = document.getElementById('basicChatMessages');

        if (!messagesContainer) {
            console.error('❌ Contenedor de mensajes no encontrado');
            return;
        }

        const messageText = message || (input ? input.value.trim() : '');
        if (!messageText) return;

        // Limpiar input
        if (input) input.value = '';

        // Agregar mensaje del usuario
        addBasicMessage('user', messageText);

        // Mostrar typing indicator
        showBasicTyping();

        // Simular respuesta después de 1 segundo
        setTimeout(() => {
            hideBasicTyping();
            const response = generateBasicResponse(messageText);
            addBasicMessage('bot', response);
        }, 1000);

        trackChatbotEvent('Basic Chatbot', 'Message Sent');
    };

    // 6. FUNCIONES AUXILIARES PARA CHATBOT BÁSICO
    function addBasicMessage(sender, message) {
        const messagesContainer = document.getElementById('basicChatMessages');
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            margin-bottom: 15px;
            display: flex;
            align-items: flex-start;
            gap: 10px;
            ${sender === 'user' ? 'flex-direction: row-reverse;' : ''}
        `;

        const avatar = sender === 'user' ? '👤' : '🤖';
        const bgColor = sender === 'user' ? '#3b82f6' : '#f3f4f6';
        const textColor = sender === 'user' ? 'white' : '#374151';
        const borderRadius = sender === 'user' ? '15px 15px 5px 15px' : '15px 15px 15px 5px';

        messageDiv.innerHTML = `
            <div style="
                width: 35px;
                height: 35px;
                border-radius: 50%;
                background: ${sender === 'user' ? '#1d4ed8' : '#e5e7eb'};
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1rem;
                flex-shrink: 0;
            ">${avatar}</div>
            <div style="
                background: ${bgColor};
                color: ${textColor};
                padding: 12px 16px;
                border-radius: ${borderRadius};
                max-width: 70%;
                word-wrap: break-word;
                line-height: 1.4;
            ">${message}</div>
        `;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function showBasicTyping() {
        const messagesContainer = document.getElementById('basicChatMessages');
        if (!messagesContainer) return;

        const typingDiv = document.createElement('div');
        typingDiv.id = 'basicTypingIndicator';
        typingDiv.style.cssText = `
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        `;

        typingDiv.innerHTML = `
            <div style="
                width: 35px;
                height: 35px;
                border-radius: 50%;
                background: #e5e7eb;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1rem;
            ">🤖</div>
            <div style="
                background: #f3f4f6;
                color: #6b7280;
                padding: 12px 16px;
                border-radius: 15px 15px 15px 5px;
                font-style: italic;
            ">Escribiendo...</div>
        `;

        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function hideBasicTyping() {
        const typingIndicator = document.getElementById('basicTypingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    function generateBasicResponse(message) {
        const msg = message.toLowerCase();

        if (msg.includes('servicio') || msg.includes('consultoría') || msg.includes('asesoría')) {
            return `Roberto ofrece servicios especializados:

🏢 **Para Empresas:**
• Auditoría IA y estrategia
• Implementación de soluciones
• Capacitación empresarial

🏛️ **Para Instituciones:**
• IA para servicios públicos
• Programas educativos

🎓 **Para Investigadores:**
• Colaboración en investigación
• Servicios académicos

👤 **Para Profesionales:**
• Recursos educativos
• Consultoría individual

¿En qué área te interesa más información?`;
        }

        if (msg.includes('precio') || msg.includes('costo') || msg.includes('cotización')) {
            return `Los precios varían según el proyecto:

💼 **Auditoría IA:** Desde $500 USD
⚙️ **Implementación:** $1,500 - $10,000 USD
📚 **Capacitación:** $200 USD/persona
🤝 **Consultoría:** $150 USD/hora

¿Te gustaría agendar una consulta gratuita?`;
        }

        if (msg.includes('agendar') || msg.includes('reunión') || msg.includes('cita')) {
            return `Para agendar una reunión con Roberto:

📱 **WhatsApp:** +593 098 712 1170
📧 **Email:** contacto@robertoacunacaicedo.com
💼 **LinkedIn:** roberto-acuña-627

⏰ **Horarios disponibles:**
• Lunes a Viernes: 9:00 AM - 6:00 PM (ECT)
• Sábados: 9:00 AM - 1:00 PM

✅ Reuniones virtuales disponibles
✅ Consulta inicial gratuita

¿Prefieres contactar por WhatsApp o email?`;
        }

        if (msg.includes('libro') || msg.includes('recurso') || msg.includes('publicación')) {
            return `Roberto ha publicado libros especializados:

📖 **"Tesis y artículos científicos con IA"**
• Metodologías de investigación con IA
• 15+ herramientas online
• ⭐ 4.8/5 estrellas

📘 **"El poder del Prompt"**
• 105+ prompts profesionales
• Ejemplos por industria
• ⭐ 4.9/5 estrellas

Ambos disponibles en Amazon.

¿Te interesa algún libro en particular?`;
        }

        if (msg.includes('contacto') || msg.includes('whatsapp') || msg.includes('email')) {
            return `Contacta a Roberto:

📱 **WhatsApp:** +593 098 712 1170
📧 **Email:** contacto@robertoacunacaicedo.com
💼 **LinkedIn:** roberto-acuña-627
📍 **Ubicación:** Manabí, Ecuador

¿Cuál prefieres para tu consulta?`;
        }

        // Respuesta por defecto
        return `Gracias por tu consulta. Como asistente de Roberto, puedo ayudarte con:

• Información sobre servicios
• Cotizaciones personalizadas
• Agendar reuniones
• Recursos educativos

Para consultas específicas:
📱 WhatsApp: +593 098 712 1170
📧 Email: contacto@robertoacunacaicedo.com

¿Hay algo específico en lo que pueda orientarte?`;
    }

    // 7. FUNCIÓN DE ANALYTICS SEGURA
    function trackChatbotEvent(category, action) {
        try {
            if (typeof Analytics !== 'undefined' && Analytics.trackEvent) {
                Analytics.trackEvent('Chatbot', action, category);
            }
            console.log(`📊 Event tracked: ${category} - ${action}`);
        } catch (error) {
            console.warn('⚠️ Error tracking event:', error);
        }
    }

    // 8. INICIALIZACIÓN DIFERIDA DEL CHATBOT AVANZADO
    function initializeAdvancedChatbotWhenReady() {
        // Si ya está inicializado, no hacer nada
        if (chatbotInitialized) return;

        // Si la clase AdvancedChatbot está disponible
        if (typeof AdvancedChatbot !== 'undefined') {
            try {
                if (!window.advancedChatbot) {
                    console.log('🚀 Inicializando chatbot avanzado...');
                    window.advancedChatbot = new AdvancedChatbot();
                    window.advancedChatbot.init();
                    chatbotInitialized = true;
                    console.log('✅ Chatbot avanzado inicializado exitosamente');
                }
            } catch (error) {
                console.error('❌ Error inicializando chatbot avanzado:', error);
                chatbotInitialized = false;
            }
        } else {
            console.log('⏳ AdvancedChatbot no disponible aún, reintentando...');
            setTimeout(initializeAdvancedChatbotWhenReady, 1000);
        }
    }

    // 9. EVENTOS DE INICIALIZACIÓN
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAdvancedChatbotWhenReady);
    } else {
        // DOM ya cargado, inicializar inmediatamente
        setTimeout(initializeAdvancedChatbotWhenReady, 100);
    }

    // También intentar cuando se carga la ventana
    window.addEventListener('load', initializeAdvancedChatbotWhenReady);

    // 10. VERIFICAR ESTADO CADA 5 SEGUNDOS (HASTA QUE ESTÉ LISTO)
    const checkInterval = setInterval(() => {
        if (chatbotInitialized || typeof AdvancedChatbot === 'undefined') {
            return;
        }

        initializeAdvancedChatbotWhenReady();

        // Detener verificación después de 30 segundos
        setTimeout(() => {
            clearInterval(checkInterval);
        }, 30000);
    }, 5000);

    // 11. FUNCIONES DE DEBUG
    window.debugChatbot = function() {
        console.log('🔍 === DEBUG CHATBOT ===');
        console.log('AdvancedChatbot class available:', typeof AdvancedChatbot !== 'undefined');
        console.log('advancedChatbot instance exists:', !!window.advancedChatbot);
        console.log('chatbotInitialized:', chatbotInitialized);
        console.log('Advanced modal exists:', !!document.getElementById('aiChatbotModal'));
        console.log('Basic modal exists:', !!document.getElementById('basicChatbotModal'));
        console.log('=== FIN DEBUG ===');
    };

    window.forceInitChatbot = function() {
        console.log('🔧 Forzando inicialización del chatbot...');
        chatbotInitialized = false;
        if (window.advancedChatbot) {
            window.advancedChatbot = null;
        }
        initializeAdvancedChatbotWhenReady();
    };

    console.log('✅ Corrección del chatbot aplicada exitosamente');

})();

// 12. ESTILOS ADICIONALES PARA EL CHATBOT BÁSICO
if (!document.getElementById('basic-chatbot-styles')) {
    const style = document.createElement('style');
    style.id = 'basic-chatbot-styles';
    style.innerHTML = `
        #basicChatbotModal button:hover {
            transform: scale(1.05);
            transition: all 0.3s ease;
        }
        
        #basicChatbotModal input:focus {
            border-color: #3b82f6 !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }
        
        @media (max-width: 768px) {
            #basicChatbotModal > div {
                width: 95% !important;
                height: 90vh !important;
            }
        }
    `;
    document.head.appendChild(style);
}

console.log('✅ Chatbot fix completo cargado');