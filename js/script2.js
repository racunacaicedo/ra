/* ===================================================================== */
/* INICIALIZACIÓN PRINCIPAL */
/* ===================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando sitio web de Roberto Acuña Caicedo...');

    // Inicializar todos los módulos
    HeroSlider.init();
    Navigation.init();
    ServicesTabs.init();
    ContactForm.init();
    ScrollAnimations.init();
    SmoothScrolling.init();
    PerformanceOptimization.init();
    Analytics.init();
    PortfolioAnimations.init(); // Nueva función para animaciones del portafolio
    AcademicOverlays.init(); // ← AGREGAR ESTA LÍNEA
    BookPreviewModals.init(); // ← AGREGAR ESTA LÍNEA
    ContactOptions.init(); // ← Ahora está incluido aquí
    GalleryMoments.init(); // ← AGREGAR ESTA LÍNEA
    initHorizontalGallery(); // ← AGREGAR ESTA
    SocialCarousel();

    console.log('✅ Sitio web inicializado correctamente');
});

/* ===================================================================== */
/* MÓDULO: ANIMACIONES DEL PORTAFOLIO - MODIFICADO PARA TARJETAS */
/* ===================================================================== */

const PortfolioAnimations = {
    currentIndex: 0,
    portfolioCards: null, // Cambiado de portfolioLogos a portfolioCards
    animationInterval: null,
    colors: [
        'linear-gradient(135deg, #1e3a8a, #3b82f6)', // Azul fuerte a azul medio
        'linear-gradient(135deg, #059669, #10b981)', // Verde
        'linear-gradient(135deg, #dc2626, #ef4444)', // Rojo
        'linear-gradient(135deg, #7c2d12, #ea580c)', // Naranja
        'linear-gradient(135deg, #581c87, #8b5cf6)', // Púrpura
        'linear-gradient(135deg, #0f172a, #1e293b)'  // Gris oscuro
    ],

    init() {
        // Cambiar selector a toda la tarjeta en lugar de solo el logo
        this.portfolioCards = document.querySelectorAll('.plink');

        if (this.portfolioCards.length === 0) {
            console.log('⚠️ No se encontraron tarjetas del portafolio');
            return;
        }

        this.startColorAnimation();
        this.bindEvents();
        console.log('✅ Animaciones del portafolio inicializadas - MODO TARJETA');
    },

    startColorAnimation() {
        // Iniciar la animación después de 2 segundos
        setTimeout(() => {
            this.animationInterval = setInterval(() => {
                this.animateNextCard();
            }, 2000); // Cambiar cada 2 segundos
        }, 2000);
    },

    animateNextCard() {
        if (this.portfolioCards.length === 0) return;

        // Resetear la tarjeta anterior
        this.resetPreviousCard();

        // Animar la tarjeta actual
        const currentCard = this.portfolioCards[this.currentIndex];
        const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];

        this.animateCard(currentCard, randomColor);

        // Avanzar al siguiente índice
        this.currentIndex = (this.currentIndex + 1) % this.portfolioCards.length;
    },

    animateCard(card, color) {
        // Agregar clase de animación
        card.classList.add('card-animation');

        // Cambiar el fondo de toda la tarjeta
        card.style.background = color;
        card.style.transform = 'translateY(-8px) scale(1.05)';
        card.style.borderColor = '#ffffff';
        card.style.color = '#ffffff';

        // Sombra más prominente
        card.style.boxShadow = `
            0 20px 40px rgba(0, 0, 0, 0.3),
            0 0 0 3px rgba(255, 255, 255, 0.2)
        `;

        // Cambiar color del texto a blanco
        const label = card.querySelector('.plink-label');
        if (label) {
            label.style.color = '#ffffff';
            label.style.fontWeight = '700';
        }

        // Agregar efecto de pulso a toda la tarjeta
        card.style.animation = 'cardPulse 0.8s ease-out';
    },

    resetPreviousCard() {
        // Resetear todas las tarjetas excepto la actual
        this.portfolioCards.forEach((card, index) => {
            if (index !== this.currentIndex) {
                card.classList.remove('card-animation');

                // Restaurar estilos originales
                card.style.background = 'var(--white)';
                card.style.transform = '';
                card.style.borderColor = '#1e3a8a'; // Volver al azul fuerte
                card.style.color = '';
                card.style.boxShadow = 'var(--shadow)';
                card.style.animation = '';

                // Restaurar color del texto
                const label = card.querySelector('.plink-label');
                if (label) {
                    label.style.color = '';
                    label.style.fontWeight = '';
                }
            }
        });
    },

    bindEvents() {
        // Pausar animación al hacer hover en cualquier tarjeta
        this.portfolioCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.pauseAnimation();
            });

            card.addEventListener('mouseleave', () => {
                this.resumeAnimation();
            });
        });

        // Pausar animación cuando la sección no es visible
        this.observeVisibility();
    },

    pauseAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    },

    resumeAnimation() {
        if (!this.animationInterval) {
            this.animationInterval = setInterval(() => {
                this.animateNextCard();
            }, 2000);
        }
    },

    observeVisibility() {
        const portfolioSection = document.querySelector('.websites');
        if (!portfolioSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Sección visible, reanudar animación
                    if (!this.animationInterval) {
                        this.startColorAnimation();
                    }
                } else {
                    // Sección no visible, pausar animación
                    this.pauseAnimation();
                    this.resetAllCards();
                }
            });
        }, {
            threshold: 0.3 // Activar cuando el 30% de la sección sea visible
        });

        observer.observe(portfolioSection);
    },

    resetAllCards() {
        this.portfolioCards.forEach(card => {
            card.classList.remove('card-animation');

            // Restaurar estilos originales
            card.style.background = 'var(--white)';
            card.style.transform = '';
            card.style.borderColor = '#1e3a8a';
            card.style.color = '';
            card.style.boxShadow = 'var(--shadow)';
            card.style.animation = '';

            // Restaurar color del texto
            const label = card.querySelector('.plink-label');
            if (label) {
                label.style.color = '';
                label.style.fontWeight = '';
            }
        });

        this.currentIndex = 0;
    },

    // Método para detener completamente las animaciones
    stopAnimations() {
        this.pauseAnimation();
        this.resetAllCards();
        console.log('🔇 Animaciones del portafolio detenidas');
    }
};

/* ===================================================================== */
/* ANIMACIÓN CSS ADICIONAL PARA LAS TARJETAS */
/* ===================================================================== */

// Agregar la animación CSS dinámicamente
const cardAnimationCSS = `
    @keyframes cardPulse {
        0% { 
            transform: translateY(-8px) scale(1.05); 
        }
        50% { 
            transform: translateY(-12px) scale(1.08); 
        }
        100% { 
            transform: translateY(-8px) scale(1.05); 
        }
    }

    .card-animation {
        z-index: 10 !important;
        position: relative !important;
    }

    /* Transición suave para cuando se resetea */
    .plink {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }

    .plink-label {
        transition: color 0.3s ease, font-weight 0.3s ease !important;
    }
`;

// Inyectar el CSS en la página
const styleElement = document.createElement('style');
styleElement.textContent = cardAnimationCSS;
document.head.appendChild(styleElement);

/* ===================================================================== */
/* MÓDULO: MODALES DE VISTA PREVIA DE LIBROS */
/* ===================================================================== */

const BookPreviewModals = {
    currentPages: {
        book1: 1,
        book2: 1
    },
    totalPages: {
        book1: 8,
        book2: 8
    },

    init() {
        this.bindEvents();
        console.log('✅ Modales de vista previa inicializados');
    },

    bindEvents() {
        // Cerrar modal al hacer clic fuera del contenido
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('preview-modal')) {
                const bookId = e.target.id.includes('book1') ? 'book1' : 'book2';
                this.closeModal(bookId);
            }
        });

        // Cerrar modal con tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.preview-modal.show');
                if (openModal) {
                    const bookId = openModal.id.includes('book1') ? 'book1' : 'book2';
                    this.closeModal(bookId);
                }
            }
        });

        // Navegación con teclado
        document.addEventListener('keydown', (e) => {
            const openModal = document.querySelector('.preview-modal.show');
            if (openModal) {
                const bookId = openModal.id.includes('book1') ? 'book1' : 'book2';

                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.previousPage(bookId);
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.nextPage(bookId);
                }
            }
        });
    },

    openModal(bookId) {
        const modal = document.getElementById(`preview-modal-${bookId}`);
        if (modal) {
            this.currentPages[bookId] = 1;
            this.updatePageDisplay(bookId);

            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);

            document.body.style.overflow = 'hidden';
            modal.focus();

            Analytics.trackEvent('Book', 'Preview Open', `Book ${bookId}`);
        }
    },

    closeModal(bookId) {
        const modal = document.getElementById(`preview-modal-${bookId}`);
        if (modal) {
            modal.classList.remove('show');

            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);

            Analytics.trackEvent('Book', 'Preview Close', `Book ${bookId}`);
        }
    },

    nextPage(bookId) {
        if (this.currentPages[bookId] < this.totalPages[bookId]) {
            this.currentPages[bookId]++;
            this.updatePageDisplay(bookId);

            Analytics.trackEvent('Book', 'Preview Next Page', `Book ${bookId} - Page ${this.currentPages[bookId]}`);
        }
    },

    previousPage(bookId) {
        if (this.currentPages[bookId] > 1) {
            this.currentPages[bookId]--;
            this.updatePageDisplay(bookId);

            Analytics.trackEvent('Book', 'Preview Previous Page', `Book ${bookId} - Page ${this.currentPages[bookId]}`);
        }
    },

    updatePageDisplay(bookId) {
        const modal = document.getElementById(`preview-modal-${bookId}`);
        if (!modal) return;

        const pages = modal.querySelectorAll('.preview-page');
        pages.forEach((page, index) => {
            if (index + 1 === this.currentPages[bookId]) {
                page.classList.add('active');
            } else {
                page.classList.remove('active');
            }
        });

        const currentPageElement = document.getElementById(`current-page-${bookId}`);
        if (currentPageElement) {
            currentPageElement.textContent = this.currentPages[bookId];
        }

        const prevBtn = modal.querySelector('.nav-btn:first-child');
        const nextBtn = modal.querySelector('.nav-btn:last-child');

        if (prevBtn) {
            prevBtn.disabled = this.currentPages[bookId] === 1;
        }

        if (nextBtn) {
            nextBtn.disabled = this.currentPages[bookId] === this.totalPages[bookId];
        }
    }
};

// Funciones globales para los botones onclick
function openPreviewModal(bookId) {
    BookPreviewModals.openModal(bookId);
}

function closePreviewModal(bookId) {
    BookPreviewModals.closeModal(bookId);
}

function nextPage(bookId) {
    BookPreviewModals.nextPage(bookId);
}

function previousPage(bookId) {
    BookPreviewModals.previousPage(bookId);
}
/* ===================================================================== */
/* MÓDULO: FUNCIONES DE CONTACTO Y CHATBOT IA */
/* ===================================================================== */

// Funciones globales para el formulario de contacto
function toggleContactForm() {
    const formContainer = document.getElementById('contactFormContainer');
    const isVisible = formContainer.style.display === 'block';

    if (isVisible) {
        formContainer.style.display = 'none';
        document.body.style.overflow = '';
        Analytics.trackEvent('Contact', 'Form Close', 'Contact Form');
    } else {
        formContainer.style.display = 'block';
        document.body.style.overflow = 'hidden';
        Analytics.trackEvent('Contact', 'Form Open', 'Contact Form');
    }
}

// Funciones del Chatbot IA
function openAIChatbot() {
    const modal = document.getElementById('aiChatbotModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Focus en el input del chatbot
    setTimeout(() => {
        document.getElementById('chatbotInput').focus();
    }, 300);

    Analytics.trackEvent('Chatbot', 'Open', 'AI Assistant');
}

function closeAIChatbot() {
    const modal = document.getElementById('aiChatbotModal');
    modal.style.display = 'none';
    document.body.style.overflow = '';
    Analytics.trackEvent('Chatbot', 'Close', 'AI Assistant');
}

function sendQuickMessage(message) {
    // Agregar mensaje del usuario
    addUserMessage(message);

    // Simular respuesta del bot después de un delay
    setTimeout(() => {
        generateBotResponse(message);
    }, 1000);

    Analytics.trackEvent('Chatbot', 'Quick Message', message);
}

function sendChatbotMessage() {
    const input = document.getElementById('chatbotInput');
    const message = input.value.trim();

    if (message) {
        // Agregar mensaje del usuario
        addUserMessage(message);
        input.value = '';

        // Simular respuesta del bot después de un delay
        setTimeout(() => {
            generateBotResponse(message);
        }, 1000);

        Analytics.trackEvent('Chatbot', 'Send Message', message);
    }
}

function handleChatbotEnter(event) {
    if (event.key === 'Enter') {
        sendChatbotMessage();
    }
}

function addUserMessage(message) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message';
    messageDiv.innerHTML = `
        <div class="message-avatar">👤</div>
        <div class="message-content">
            <p>${escapeHtml(message)}</p>
        </div>
    `;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function addBotMessage(message, hasQuickOptions = false) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message';

    let quickOptionsHtml = '';
    if (hasQuickOptions) {
        quickOptionsHtml = `
            <div class="quick-options">
                <button class="quick-option" onclick="sendQuickMessage('Más información sobre servicios')">📋 Más servicios</button>
                <button class="quick-option" onclick="sendQuickMessage('Quiero agendar una reunión')">📅 Agendar reunión</button>
                <button class="quick-option" onclick="sendQuickMessage('Contacto directo')">📞 Contacto directo</button>
            </div>
        `;
    }

    messageDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <p>${message}</p>
            ${quickOptionsHtml}
        </div>
    `;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function generateBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    let response = '';
    let hasQuickOptions = false;

    // Respuestas predefinidas basadas en palabras clave
    if (message.includes('servicio') || message.includes('información sobre servicios')) {
        response = `Roberto ofrece varios servicios especializados en IA:

🔍 <strong>Auditoría y Estrategia IA</strong> - Evaluación completa de oportunidades
⚙️ <strong>Implementación de Soluciones</strong> - Desarrollo de sistemas personalizados  
📚 <strong>Capacitación Empresarial</strong> - Formación para equipos
🤝 <strong>Consultoría Individual</strong> - Asesoría personalizada
🎓 <strong>Colaboración en Investigación</strong> - Proyectos académicos

¿Te interesa algún servicio en particular?`;
        hasQuickOptions = true;
    } else if (message.includes('disponibilidad') || message.includes('agendar') || message.includes('reunión')) {
        response = `Roberto está disponible para:

✅ Reuniones virtuales
✅ Proyectos remotos  
✅ Colaboraciones internacionales

Para agendar una reunión, puedes:
• Usar el formulario de contacto personalizado
• Escribir directamente al WhatsApp: +593 098 712 1170
• Enviar un email: contacto@robertoacunacaicedo.com

¿Prefieres una reunión virtual o presencial?`;
        hasQuickOptions = true;
    } else if (message.includes('precio') || message.includes('cotización') || message.includes('costo')) {
        response = `Los precios varían según el tipo de proyecto y alcance:

💼 <strong>Auditoría IA:</strong> Consulta personalizada
⚙️ <strong>Implementación:</strong> Cotización según complejidad
📚 <strong>Capacitación:</strong> Tarifas por grupo o individual
🤝 <strong>Consultoría:</strong> Tarifas por hora o proyecto

Para una cotización exacta, Roberto necesita conocer:
• Tipo de organización
• Alcance del proyecto  
• Tiempo estimado
• Objetivos específicos

¿Te gustaría solicitar una cotización personalizada?`;
        hasQuickOptions = true;
    } else if (message.includes('contacto directo') || message.includes('whatsapp') || message.includes('email')) {
        response = `Puedes contactar directamente a Roberto por:

📱 <strong>WhatsApp:</strong> +593 098 712 1170
📧 <strong>Email:</strong> contacto@robertoacunacaicedo.com  
💼 <strong>LinkedIn:</strong> roberto-acuña-627
📍 <strong>Ubicación:</strong> Manabí, Ecuador

También puedes unirte a la comunidad de WhatsApp para contenido exclusivo y networking con otros profesionales de IA.

¿Prefieres algún canal en particular?`;
        hasQuickOptions = true;
    } else if (message.includes('más información') || message.includes('más servicios')) {
        response = `Te puedo ayudar con información sobre:

🎓 <strong>Formación académica</strong> - PhD en Ingeniería, publicaciones científicas
💼 <strong>Experiencia</strong> - 25+ años, CEO de Creinti, Presidente de FEIA  
📚 <strong>Libros publicados</strong> - "Tesis con IA" y "El poder del Prompt"
🏢 <strong>Clientes</strong> - Empresas, instituciones públicas, universidades
🌍 <strong>Alcance</strong> - Ecuador, Latinoamérica e internacional

¿Qué aspecto te interesa conocer más?`;
        hasQuickOptions = true;
    } else if (message.includes('hola') || message.includes('buenos días') || message.includes('buenas tardes')) {
        response = `¡Hola! Encantado de saludarte. Soy el asistente personal de Roberto Acuña Caicedo.

Roberto es especialista en Inteligencia Artificial con más de 25 años de experiencia, PhD en Ingeniería y autor de libros sobre IA.

¿En qué puedo ayudarte hoy? Puedo brindarte información sobre:
• Servicios de consultoría y capacitación  
• Disponibilidad para proyectos
• Precios y cotizaciones
• Formas de contacto directo`;
        hasQuickOptions = true;
    } else {
        response = `Gracias por tu mensaje. Soy el asistente de Roberto y estoy aquí para ayudarte.

Para consultas específicas o proyectos complejos, te recomiendo:
• Usar el formulario de contacto personalizado para recibir respuesta directa de Roberto
• Unirte a la comunidad de WhatsApp para networking  
• Contactar directamente por WhatsApp al +593 098 712 1170

¿Te gustaría que te ayude con algo más específico?`;
        hasQuickOptions = true;
    }

    addBotMessage(response, hasQuickOptions);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Cerrar modales con ESC y click fuera
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const formContainer = document.getElementById('contactFormContainer');
        const chatbotModal = document.getElementById('aiChatbotModal');

        if (formContainer && formContainer.style.display === 'block') {
            toggleContactForm();
        }

        if (chatbotModal && chatbotModal.style.display === 'flex') {
            closeAIChatbot();
        }
    }
});

// Cerrar al hacer click fuera del modal
document.addEventListener('click', (e) => {
    const formContainer = document.getElementById('contactFormContainer');
    const chatbotModal = document.getElementById('aiChatbotModal');

    if (e.target === formContainer) {
        toggleContactForm();
    }

    if (e.target === chatbotModal) {
        closeAIChatbot();
    }
});

console.log('✅ Funciones de contacto y chatbot inicializadas');

/* ===================================================================== */
/* JAVASCRIPT PARA GALERÍA HORIZONTAL - VERSIÓN CORREGIDA */
/* ===================================================================== */

// Objeto principal para manejar la galería
const GalleryMoments = {
    isInitialized: false,
    currentFilter: 'all',

    init() {
        if (this.isInitialized) return;

        console.log('🎯 Inicializando galería horizontal...');

        // Verificar que existen los elementos necesarios
        if (!this.checkElements()) return;

        // Inicializar componentes
        this.setupFilters();
        this.setupModal();
        this.setupNavigation();
        this.showAllItems();

        this.isInitialized = true;
        console.log('✅ Galería horizontal inicializada correctamente');
    },

    checkElements() {
        const requiredElements = {
            filters: document.querySelectorAll('.filter-btn'),
            items: document.querySelectorAll('.gallery-item'),
            container: document.querySelector('.gallery-horizontal-scroll'),
            modal: document.getElementById('gallery-modal')
        };

        const missing = [];
        Object.entries(requiredElements).forEach(([key, element]) => {
            if (!element || (element.length !== undefined && element.length === 0)) {
                missing.push(key);
            }
        });

        if (missing.length > 0) {
            console.warn('⚠️ Elementos faltantes en la galería:', missing);
            return false;
        }

        console.log('✅ Todos los elementos de la galería encontrados');
        return true;
    },

    setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');

        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const filter = button.getAttribute('data-filter');
                this.applyFilter(filter, button);
            });
        });

        console.log('✅ Filtros configurados:', filterButtons.length);
    },

    applyFilter(filter, activeButton) {
        console.log(`🔍 Aplicando filtro: ${filter}`);

        // Actualizar botones activos
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeButton.classList.add('active');

        // Obtener todos los items
        const galleryItems = document.querySelectorAll('.gallery-item');

        // Ocultar todos primero
        galleryItems.forEach(item => {
            item.classList.add('filtering');
            item.classList.remove('visible');
        });

        // Mostrar después de un delay
        setTimeout(() => {
            let visibleCount = 0;

            galleryItems.forEach((item, index) => {
                const itemCategory = item.getAttribute('data-category');
                const shouldShow = filter === 'all' || itemCategory === filter;

                if (shouldShow) {
                    setTimeout(() => {
                        item.classList.remove('filtering');
                        item.classList.add('visible');
                    }, visibleCount * 100);
                    visibleCount++;
                }
            });

            // Scroll al inicio después del filtrado
            this.scrollToStart();

            console.log(`✅ Filtro aplicado. Items visibles: ${visibleCount}`);
        }, 200);

        this.currentFilter = filter;
    },

    showAllItems() {
        const galleryItems = document.querySelectorAll('.gallery-item');

        galleryItems.forEach((item, index) => {
            item.classList.remove('filtering');
            setTimeout(() => {
                item.classList.add('visible');
            }, index * 100);
        });

        console.log('✅ Mostrando todos los items:', galleryItems.length);
    },

    setupModal() {
        const modal = document.getElementById('gallery-modal');
        if (!modal) {
            console.warn('⚠️ Modal de galería no encontrado');
            return;
        }

        // Cerrar modal con clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // Cerrar modal con tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                this.closeModal();
            }
        });

        // Botón de cerrar
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        console.log('✅ Modal configurado');
    },

    openModal(button) {
        const modal = document.getElementById('gallery-modal');
        if (!modal) {
            console.error('❌ Modal no encontrado');
            return;
        }

        // Obtener el item padre más cercano
        const galleryItem = button.closest('.gallery-item');
        if (!galleryItem) {
            console.error('❌ Gallery item no encontrado');
            return;
        }

        // Extraer datos del item
        const data = {
            image: galleryItem.getAttribute('data-image'),
            title: galleryItem.getAttribute('data-title'),
            description: galleryItem.getAttribute('data-description'),
            category: galleryItem.getAttribute('data-category'),
            date: galleryItem.getAttribute('data-date')
        };

        console.log('📷 Abriendo modal con datos:', data);

        // Actualizar contenido del modal
        this.updateModalContent(modal, data);

        // Mostrar modal
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);

        // Prevenir scroll del body
        document.body.style.overflow = 'hidden';
    },

    updateModalContent(modal, data) {
        // Actualizar título
        const titleElement = modal.querySelector('#modal-title');
        if (titleElement) {
            titleElement.textContent = data.title || 'Título no disponible';
        }

        // Actualizar imagen
        const imageElement = modal.querySelector('#modal-image');
        if (imageElement) {
            imageElement.src = data.image || '';
            imageElement.alt = data.title || '';

            // Manejar error de carga de imagen
            imageElement.onerror = function() {
                this.src = 'https://via.placeholder.com/400x300/f0f0f0/666?text=Imagen+no+disponible';
            };
        }

        // Actualizar descripción
        const textElement = modal.querySelector('#modal-text');
        if (textElement) {
            textElement.textContent = data.description || 'Descripción no disponible';
        }

        // Actualizar categoría
        const categoryElement = modal.querySelector('.modal-category');
        if (categoryElement) {
            categoryElement.textContent = this.getCategoryName(data.category);
        }

        // Actualizar fecha
        const dateElement = modal.querySelector('.modal-date');
        if (dateElement) {
            dateElement.textContent = data.date || 'Fecha no especificada';
        }
    },

    closeModal() {
        const modal = document.getElementById('gallery-modal');
        if (!modal) return;

        modal.classList.remove('show');

        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);

        console.log('❌ Modal cerrado');
    },

    getCategoryName(category) {
        const categoryNames = {
            'conferences': 'Conferencias',
            'consulting': 'Consultoría',
            'education': 'Educación',
            'events': 'Eventos'
        };
        return categoryNames[category] || 'General';
    },

    setupNavigation() {
        const container = document.querySelector('.gallery-horizontal-scroll');
        if (!container) return;

        // Agregar botones de navegación si hay overflow
        this.addNavigationButtons(container);

        // Mejorar scroll en móvil
        container.addEventListener('touchstart', () => {
            container.style.scrollBehavior = 'auto';
        });

        container.addEventListener('touchend', () => {
            container.style.scrollBehavior = 'smooth';
        });
    },

    addNavigationButtons(container) {
        const galleryContainer = document.querySelector('.gallery-horizontal-container');
        if (!galleryContainer) return;

        // Solo agregar botones si hay overflow
        if (container.scrollWidth <= container.clientWidth) return;

        // Verificar si ya existen botones
        if (galleryContainer.querySelector('.gallery-nav-btn')) return;

        // Crear botón anterior
        const prevBtn = document.createElement('button');
        prevBtn.className = 'gallery-nav-btn gallery-nav-prev';
        prevBtn.innerHTML = '←';
        prevBtn.setAttribute('aria-label', 'Imagen anterior');

        // Crear botón siguiente
        const nextBtn = document.createElement('button');
        nextBtn.className = 'gallery-nav-btn gallery-nav-next';
        nextBtn.innerHTML = '→';
        nextBtn.setAttribute('aria-label', 'Imagen siguiente');

        // Eventos de navegación
        prevBtn.addEventListener('click', () => {
            container.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        });

        nextBtn.addEventListener('click', () => {
            container.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        });

        // Agregar botones al contenedor
        galleryContainer.appendChild(prevBtn);
        galleryContainer.appendChild(nextBtn);

        // Actualizar visibilidad de botones según posición
        container.addEventListener('scroll', () => {
            const scrollLeft = container.scrollLeft;
            const maxScroll = container.scrollWidth - container.clientWidth;

            prevBtn.style.opacity = scrollLeft > 0 ? '1' : '0.5';
            nextBtn.style.opacity = scrollLeft < maxScroll ? '1' : '0.5';

            prevBtn.disabled = scrollLeft <= 0;
            nextBtn.disabled = scrollLeft >= maxScroll;
        });

        // Estado inicial
        prevBtn.style.opacity = '0.5';
        prevBtn.disabled = true;

        console.log('✅ Botones de navegación agregados');
    },

    scrollToStart() {
        const container = document.querySelector('.gallery-horizontal-scroll');
        if (container) {
            container.scrollTo({
                left: 0,
                behavior: 'smooth'
            });
        }
    },

    // Método público para debugging
    debug() {
        console.log('🔍 Estado de la galería:', {
            initialized: this.isInitialized,
            currentFilter: this.currentFilter,
            totalItems: document.querySelectorAll('.gallery-item').length,
            visibleItems: document.querySelectorAll('.gallery-item.visible').length,
            filters: document.querySelectorAll('.filter-btn').length
        });
    }
};

// =====================================================================
// FUNCIONES GLOBALES PARA EL HTML
// =====================================================================

// Función global para abrir modal (llamada desde HTML)
function openGalleryModal(button) {
    GalleryMoments.openModal(button);
}

// Función global para cerrar modal (llamada desde HTML)
function closeGalleryModal() {
    GalleryMoments.closeModal();
}

// =====================================================================
// INICIALIZACIÓN
// =====================================================================

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Delay para asegurar que todos los elementos estén cargados
    setTimeout(() => {
        GalleryMoments.init();
    }, 500);
});

// También inicializar si ya está cargado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => GalleryMoments.init(), 100);
    });
} else {
    setTimeout(() => GalleryMoments.init(), 100);
}

// Hacer funciones disponibles globalmente
window.GalleryMoments = GalleryMoments;
window.openGalleryModal = openGalleryModal;
window.closeGalleryModal = closeGalleryModal;

// =====================================================================
// FUNCIONES DE DEBUGGING
// =====================================================================

function debugGallery() {
    console.log('🔍 Debugging galería...');
    console.log('Filtros encontrados:', document.querySelectorAll('.filter-btn').length);
    console.log('Items encontrados:', document.querySelectorAll('.gallery-item').length);
    console.log('Container encontrado:', !!document.querySelector('.gallery-horizontal-scroll'));
    console.log('Modal encontrado:', !!document.getElementById('gallery-modal'));

    const items = document.querySelectorAll('.gallery-item');
    items.forEach((item, index) => {
        console.log(`Item ${index}:`, {
            categoria: item.getAttribute('data-category'),
            titulo: item.getAttribute('data-title'),
            visible: item.classList.contains('visible'),
            filtering: item.classList.contains('filtering')
        });
    });

    GalleryMoments.debug();
}

// Función para testear modal
function testModal() {
    const firstItem = document.querySelector('.gallery-item');
    if (firstItem) {
        const button = firstItem.querySelector('.gallery-btn');
        if (button) {
            openGalleryModal(button);
        }
    }
}

// Hacer funciones de debug disponibles globalmente
window.debugGallery = debugGallery;
window.testModal = testModal;

console.log('✅ JavaScript de galería horizontal cargado');

// ===================================================================
// CARRUSEL DE REDES SOCIALES
// ===================================================================

class SocialCarousel {
    constructor() {
        this.track = document.getElementById('socialCarouselTrack');
        this.prevBtn = document.getElementById('socialPrevBtn');
        this.nextBtn = document.getElementById('socialNextBtn');
        this.indicatorsContainer = document.getElementById('socialCarouselIndicators');

        this.currentIndex = 0;
        this.cardsToShow = 3; // Número de cards visibles por defecto
        this.totalCards = document.querySelectorAll('.social-card').length;
        this.maxIndex = Math.max(0, this.totalCards - this.cardsToShow);

        this.init();
    }

    init() {
        this.updateCardsToShow();
        this.createIndicators();
        this.bindEvents();
        this.updateCarousel();

        // Actualizar en resize
        window.addEventListener('resize', () => {
            this.updateCardsToShow();
            this.updateCarousel();
        });

        console.log('✅ Carrusel de redes sociales inicializado');
    }

    updateCardsToShow() {
        const width = window.innerWidth;
        if (width < 480) {
            this.cardsToShow = 1;
        } else if (width < 768) {
            this.cardsToShow = 2;
        } else if (width < 1200) {
            this.cardsToShow = 3;
        } else {
            this.cardsToShow = 3;
        }

        this.maxIndex = Math.max(0, this.totalCards - this.cardsToShow);
        this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
    }

    createIndicators() {
        this.indicatorsContainer.innerHTML = '';
        const totalPages = Math.ceil(this.totalCards / this.cardsToShow);

        for (let i = 0; i < totalPages; i++) {
            const indicator = document.createElement('button');
            indicator.className = 'social-indicator';
            indicator.setAttribute('aria-label', `Ir a página ${i + 1}`);
            indicator.addEventListener('click', () => this.goToSlide(i * this.cardsToShow));
            this.indicatorsContainer.appendChild(indicator);
        }

        this.updateIndicators();
    }

    bindEvents() {
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        // Navegación con teclado
        document.addEventListener('keydown', (e) => {
            if (e.target.closest('.social-networks')) {
                switch(e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.previousSlide();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.nextSlide();
                        break;
                }
            }
        });

        // Touch/swipe support
        let startX = 0;
        let isDragging = false;

        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });

        this.track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        });

        this.track.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;

            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }
        });
    }

    nextSlide() {
        if (this.currentIndex < this.maxIndex) {
            this.currentIndex++;
            this.updateCarousel();
        }
    }

    previousSlide() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCarousel();
        }
    }

    goToSlide(index) {
        this.currentIndex = Math.max(0, Math.min(index, this.maxIndex));
        this.updateCarousel();
    }

    updateCarousel() {
        const cardWidth = 350; // Ancho de card + margin
        const offset = -this.currentIndex * cardWidth;

        this.track.style.transform = `translateX(${offset}px)`;

        // Actualizar botones
        this.prevBtn.style.opacity = this.currentIndex === 0 ? '0.5' : '1';
        this.nextBtn.style.opacity = this.currentIndex >= this.maxIndex ? '0.5' : '1';
        this.prevBtn.disabled = this.currentIndex === 0;
        this.nextBtn.disabled = this.currentIndex >= this.maxIndex;

        this.updateIndicators();
    }

    updateIndicators() {
        const indicators = this.indicatorsContainer.querySelectorAll('.social-indicator');
        const currentPage = Math.floor(this.currentIndex / this.cardsToShow);

        indicators.forEach((indicator, index) => {
            if (index === currentPage) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const socialCarousel = new SocialCarousel();
});

// También disponible globalmente
window.SocialCarousel = SocialCarousel;


/* ===================================================================== */
/* MÓDULO: CARRUSEL DEL HERO */
/* ===================================================================== */

const HeroSlider = {
    currentSlide: 0,
    slideInterval: null,
    slides: null,
    dots: null,
    totalSlides: 0,

    init() {
        this.slides = document.querySelectorAll('.slide');
        this.dots = document.querySelectorAll('.dot');
        this.totalSlides = this.slides.length;

        if (this.slides.length === 0) return;

        this.bindEvents();
        this.startAutoSlider();
        this.initHeroAnimations();

        console.log('✅ Carrusel inicializado');
    },

    bindEvents() {
        // Botones de navegación
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (prevBtn) prevBtn.addEventListener('click', () => this.changeSlide(this.currentSlide - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => this.changeSlide(this.currentSlide + 1));

        // Dots de navegación
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.changeSlide(index));
        });

        // Pausar en hover
        const sliderContainer = document.querySelector('.slider-container');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', () => this.stopAutoSlider());
            sliderContainer.addEventListener('mouseleave', () => this.startAutoSlider());
        }

        // Navegación por teclado
        document.addEventListener('keydown', (e) => {
            if (document.activeElement.closest('.slider-container')) {
                switch(e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.changeSlide(this.currentSlide - 1);
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.changeSlide(this.currentSlide + 1);
                        break;
                    case ' ':
                    case 'Enter':
                        if (e.target.classList.contains('dot')) {
                            e.preventDefault();
                            const slideIndex = parseInt(e.target.getAttribute('data-slide'));
                            this.changeSlide(slideIndex);
                        }
                        break;
                }
            }
        });
    },

    changeSlide(newSlide) {
        // Calcular nuevo slide con wrap-around
        if (newSlide >= this.totalSlides) {
            newSlide = 0;
        } else if (newSlide < 0) {
            newSlide = this.totalSlides - 1;
        }

        // Actualizar slides
        this.slides[this.currentSlide].classList.remove('active');
        this.dots[this.currentSlide].classList.remove('active');

        this.currentSlide = newSlide;

        this.slides[this.currentSlide].classList.add('active');
        this.dots[this.currentSlide].classList.add('active');

        // Reiniciar animaciones del hero cuando cambie a slide 1
        if (this.currentSlide === 0) {
            setTimeout(() => {
                this.initHeroAnimations();
            }, 500);
        }

        // Tracking
        Analytics.trackEvent('Slider', 'Navigate', `Slide ${this.currentSlide + 1}`);
    },

    nextSlide() {
        this.changeSlide(this.currentSlide + 1);
    },

    startAutoSlider() {
        this.stopAutoSlider();
        this.slideInterval = setInterval(() => this.nextSlide(), 6000);
    },

    stopAutoSlider() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        }
    },

    initHeroAnimations() {
        // Solo animar si estamos en el primer slide
        if (this.currentSlide !== 0) return;

        // Animación de aparición progresiva
        const heroElements = document.querySelectorAll('.slide.active .hero-badge, .slide.active .hero-title, .slide.active .hero-description, .slide.active .hero-stats, .slide.active .hero-buttons, .slide.active .hero-image');

        heroElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';

            setTimeout(() => {
                element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });

        // Animación de contadores
        setTimeout(() => {
            this.animateCounters();
        }, 1000);
    },

    animateCounters() {
        const activeSlide = document.querySelector('.slide.active');
        if (!activeSlide) return;

        const counters = activeSlide.querySelectorAll('.stat-number');

        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace('+', ''));
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target + '+';
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current) + '+';
                }
            }, 40);
        });
    },

    preloadNextSlide() {
        const nextSlideIndex = (this.currentSlide + 1) % this.totalSlides;
        const nextSlideImg = this.slides[nextSlideIndex]?.querySelector('img');

        if (nextSlideImg && !nextSlideImg.complete) {
            const img = new Image();
            img.src = nextSlideImg.src;
        }
    }
};

/* ===================================================================== */
/* MÓDULO: NAVEGACIÓN */
/* ===================================================================== */

const Navigation = {
    init() {
        this.bindEvents();
        this.initScrollHighlight();
        console.log('✅ Navegación inicializada');
    },

    bindEvents() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Toggle mobile menu
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Cerrar menú móvil al hacer click en un link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        });

        // Cerrar menú móvil al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    },

    initScrollHighlight() {
        window.addEventListener('scroll', Utils.debounce(() => {
            this.highlightActiveNavLink();
        }, 100));
    },

    highlightActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;

            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
};


// =====================================================================
// ANIMACIONES ACADÉMICAS AUTOMÁTICAS - VERSIÓN SIMPLE
// =====================================================================

// Agregar este código al final de tu script.js o antes de la sección TABS DE SERVICIOS

// Función para inicializar animaciones automáticas
function initAutoAcademicAnimations() {
    console.log('🎬 Iniciando animaciones académicas automáticas');

    // Verificar que la sección existe
    const academicSection = document.querySelector('#formacion-academica');
    if (!academicSection) {
        console.log('❌ Sección académica no encontrada');
        return;
    }

    // Crear y agregar CSS de animaciones
    createAnimationCSS();

    // Aplicar animaciones a los elementos
    applyAutomaticAnimations();

    console.log('✅ Animaciones académicas aplicadas');
}

// Función para crear el CSS de animaciones
function createAnimationCSS() {
    // Verificar si ya existe
    if (document.getElementById('academic-auto-animations')) {
        return;
    }

    const style = document.createElement('style');
    style.id = 'academic-auto-animations';
    style.innerHTML = `
        /* Animaciones Keyframes */
        @keyframes floatTimeline {
            0%, 100% {
                transform: translateX(0);
                background: rgba(255, 255, 255, 0.05);
            }
            50% {
                transform: translateX(8px);
                background: rgba(255, 255, 255, 0.08);
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
            }
        }

        @keyframes glowThesis {
            0%, 100% {
                transform: translateY(0);
                border-color: rgba(255, 107, 53, 0.3);
            }
            50% {
                transform: translateY(-3px);
                border-color: rgba(255, 107, 53, 0.7);
                box-shadow: 0 10px 25px rgba(255, 107, 53, 0.2);
            }
        }

        @keyframes pulseArticle {
            0%, 100% {
                transform: translateX(0);
                background: rgba(255, 255, 255, 0.05);
            }
            50% {
                transform: translateX(5px);
                background: rgba(255, 255, 255, 0.1);
                border-left-color: #4A90E2;
            }
        }

        @keyframes floatIcon {
            0%, 100% {
                transform: translateY(0) rotate(0deg);
            }
            50% {
                transform: translateY(-4px) rotate(3deg);
            }
        }

        @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
        }

        /* Aplicar animaciones automáticas */
        .timeline-content.auto-animate {
            animation: floatTimeline 4s ease-in-out infinite;
        }

        .doctoral-thesis.auto-animate {
            animation: glowThesis 5s ease-in-out infinite;
        }

        .article-link.auto-animate {
            animation: pulseArticle 4s ease-in-out infinite;
        }

        .external-link-icon.auto-animate {
            animation: floatIcon 3s ease-in-out infinite;
        }

        /* Efectos shimmer */
        .timeline-content.auto-animate::before,
        .doctoral-thesis.auto-animate::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(74, 144, 226, 0.2), transparent);
            animation: shimmer 6s ease-in-out infinite;
            pointer-events: none;
        }

        /* Delays escalonados */
        .timeline-item:nth-child(1) .timeline-content.auto-animate {
            animation-delay: 0s;
        }
        .timeline-item:nth-child(2) .timeline-content.auto-animate {
            animation-delay: 1s;
        }
        .timeline-item:nth-child(3) .timeline-content.auto-animate {
            animation-delay: 2s;
        }
        .timeline-item:nth-child(4) .timeline-content.auto-animate {
            animation-delay: 3s;
        }

        .scientific-articles li:nth-child(1) .article-link.auto-animate {
            animation-delay: 0s;
        }
        .scientific-articles li:nth-child(2) .article-link.auto-animate {
            animation-delay: 1.5s;
        }
        .scientific-articles li:nth-child(3) .article-link.auto-animate {
            animation-delay: 3s;
        }

        .scientific-articles li:nth-child(1) .external-link-icon.auto-animate {
            animation-delay: 0.5s;
        }
        .scientific-articles li:nth-child(2) .external-link-icon.auto-animate {
            animation-delay: 2s;
        }
        .scientific-articles li:nth-child(3) .external-link-icon.auto-animate {
            animation-delay: 3.5s;
        }

        /* Mantener hover effects */
        .timeline-content:hover {
            animation-play-state: paused !important;
            transform: translateX(15px) translateY(-5px) scale(1.02) !important;
            background: rgba(255, 255, 255, 0.12) !important;
        }

        .doctoral-thesis:hover {
            animation-play-state: paused !important;
            transform: translateY(-10px) scale(1.03) !important;
        }

        .article-link:hover {
            animation-play-state: paused !important;
            transform: translateX(12px) !important;
        }
    `;

    document.head.appendChild(style);
    console.log('✅ CSS de animaciones creado');
}

// Función para aplicar clases de animación
function applyAutomaticAnimations() {
    // Animar elementos de timeline
    const timelineContents = document.querySelectorAll('.timeline-content');
    timelineContents.forEach((content, index) => {
        content.classList.add('auto-animate');
        console.log(`Timeline item ${index + 1} animado`);
    });

    // Animar tesis doctoral
    const doctoralThesis = document.querySelector('.doctoral-thesis');
    if (doctoralThesis) {
        doctoralThesis.classList.add('auto-animate');
        console.log('Tesis doctoral animada');
    }

    // Animar artículos
    const articleLinks = document.querySelectorAll('.article-link');
    articleLinks.forEach((link, index) => {
        link.classList.add('auto-animate');
        console.log(`Artículo ${index + 1} animado`);
    });

    // Animar iconos
    const icons = document.querySelectorAll('.external-link-icon');
    icons.forEach((icon, index) => {
        icon.classList.add('auto-animate');
        console.log(`Icono ${index + 1} animado`);
    });
}

// Función para controlar animaciones (para debugging)
function toggleAcademicAnimations() {
    const animatedElements = document.querySelectorAll('.auto-animate');
    const isRunning = animatedElements[0]?.style.animationPlayState !== 'paused';

    animatedElements.forEach(element => {
        element.style.animationPlayState = isRunning ? 'paused' : 'running';
    });

    console.log(isRunning ? '⏸️ Animaciones pausadas' : '▶️ Animaciones reanudadas');
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAutoAcademicAnimations);
} else {
    // Si ya está cargado, ejecutar inmediatamente
    initAutoAcademicAnimations();
}

// Hacer funciones disponibles globalmente para debugging
window.toggleAcademicAnimations = toggleAcademicAnimations;
window.initAutoAcademicAnimations = initAutoAcademicAnimations;


/* ===================================================================== */
/* OVERLAYS ACADÉMICOS */
/* ===================================================================== */

const AcademicOverlays = {
    init() {
        this.bindEvents();
        console.log('✅ Overlays académicos inicializados');
    },

    bindEvents() {
        const timelineContents = document.querySelectorAll('.timeline-content');

        timelineContents.forEach(content => {
            const overlay = content.querySelector('.timeline-overlay');
            const closeButton = content.querySelector('.overlay-close');

            if (!overlay || !closeButton) return;

            // Función para abrir overlay
            const openOverlay = () => {
                // Cerrar otros overlays activos
                this.closeAllOverlays();

                content.classList.add('overlay-active');
                closeButton.focus();

                // Prevenir scroll del body
                document.body.style.overflow = 'hidden';

                // Tracking
                Analytics.trackEvent('Academic', 'Overlay Open', content.querySelector('.degree-title')?.textContent || 'Unknown');
            };

            // Función para cerrar overlay
            const closeOverlay = () => {
                content.classList.remove('overlay-active');
                content.focus();

                // Restaurar scroll del body
                document.body.style.overflow = '';

                // Tracking
                Analytics.trackEvent('Academic', 'Overlay Close', content.querySelector('.degree-title')?.textContent || 'Unknown');
            };

            // Event listeners para abrir
            content.addEventListener('click', (e) => {
                if (!content.classList.contains('overlay-active')) {
                    e.preventDefault();
                    openOverlay();
                }
            });

            // Enter key para abrir (accesibilidad)
            content.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !content.classList.contains('overlay-active')) {
                    e.preventDefault();
                    openOverlay();
                }
            });

            // Event listener para cerrar con botón X
            closeButton.addEventListener('click', (e) => {
                e.stopPropagation();
                closeOverlay();
            });

            // Cerrar con Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && content.classList.contains('overlay-active')) {
                    closeOverlay();
                }
            });

            // Cerrar clickeando en el overlay (opcional)
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    closeOverlay();
                }
            });
        });
    },

    closeAllOverlays() {
        const activeOverlays = document.querySelectorAll('.timeline-content.overlay-active');
        activeOverlays.forEach(content => {
            content.classList.remove('overlay-active');
        });
        document.body.style.overflow = '';
    }
};


/* ===================================================================== */
/* MÓDULO: TABS DE SERVICIOS */
/* ===================================================================== */

const ServicesTabs = {
    init() {
        this.bindEvents();
        console.log('✅ Tabs de servicios inicializadas');
    },

    bindEvents() {
        const tabButtons = document.querySelectorAll('.tab-btn');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                this.switchTab(targetTab, tabButtons);
                Analytics.trackEvent('Services', 'Tab Change', targetTab);
            });
        });
    },

    switchTab(targetTab, tabButtons) {
        const tabPanels = document.querySelectorAll('.tab-panel');

        // Remover clases activas
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanels.forEach(panel => panel.classList.remove('active'));

        // Agregar clase activa al botón clickeado
        const activeButton = document.querySelector(`[data-tab="${targetTab}"]`);
        if (activeButton) activeButton.classList.add('active');

        // Mostrar panel correspondiente
        const activePanel = document.getElementById(targetTab);
        if (activePanel) {
            activePanel.classList.add('active');
            // Agregar animación de entrada
            activePanel.style.animation = 'none';
            activePanel.offsetHeight; // Trigger reflow
            activePanel.style.animation = 'fadeIn 0.5s ease-in-out';
        }
    }
};

/* ===================================================================== */
/* MÓDULO: ANIMACIONES ACADÉMICAS - VERSIÓN SIMPLIFICADA PARA FILE:// */
/* ===================================================================== */

const AcademicAnimations = {
    isInitialized: false,
    animationTimers: [],

    init() {
        // Verificar si la sección existe
        const academicSection = document.querySelector('#formacion-academica');
        if (!academicSection) {
            console.log('Sección académica no encontrada');
            return;
        }

        // Inicializar inmediatamente sin Intersection Observer
        this.setupSimpleAnimations();
        this.isInitialized = true;
        console.log('Animaciones académicas inicializadas - Modo archivo');
    },

    setupSimpleAnimations() {
        // Aplicar animaciones con scroll simple
        window.addEventListener('scroll', () => {
            this.checkSectionVisibility();
        });

        // También iniciar al cargar si ya está visible
        setTimeout(() => {
            this.checkSectionVisibility();
        }, 1000);
    },

    checkSectionVisibility() {
        const academicSection = document.querySelector('#formacion-academica');
        if (!academicSection) return;

        const rect = academicSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Si la sección está al menos 30% visible
        if (rect.top < windowHeight * 0.7 && rect.bottom > 0) {
            this.startAnimations();
        }
    },

    startAnimations() {
        // Evitar ejecutar múltiples veces
        if (this.isInitialized && this.animationTimers.length > 0) return;

        this.animateTimelineItems();
        this.animateTimelineGlow();
        this.animateMarkers();
        this.animateDoctoralThesis();
        this.animatePublications();
        this.animateArticles();
        this.addContinuousEffects();

        console.log('Animaciones iniciadas');
    },

    animateTimelineItems() {
        const timelineItems = document.querySelectorAll('.timeline-item');

        timelineItems.forEach((item, index) => {
            // Estado inicial
            item.style.opacity = '0';
            item.style.transform = 'translateX(-50px)';
            item.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';

            // Animación escalonada
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';

                // Efecto de rebote
                setTimeout(() => {
                    item.style.transform = 'translateX(8px)';
                    setTimeout(() => {
                        item.style.transform = 'translateX(0)';
                    }, 200);
                }, 500);

            }, index * 300 + 500);
        });
    },

    animateTimelineGlow() {
        // Crear estilo dinámico para el brillo de la línea
        const style = document.createElement('style');
        style.id = 'timeline-glow-animation';
        style.innerHTML = `
            @keyframes timelineGlow {
                0%, 100% {
                    box-shadow: 0 0 10px rgba(74, 144, 226, 0.3);
                    filter: brightness(1);
                }
                50% {
                    box-shadow: 0 0 25px rgba(74, 144, 226, 0.8);
                    filter: brightness(1.3);
                }
            }
            
            .timeline::before {
                animation: timelineGlow 4s ease-in-out infinite;
            }
        `;

        if (!document.querySelector('#timeline-glow-animation')) {
            document.head.appendChild(style);
        }
    },

    animateMarkers() {
        const markers = document.querySelectorAll('.timeline-marker');

        markers.forEach((marker, index) => {
            setTimeout(() => {
                const pulseMarker = () => {
                    marker.style.transition = 'all 0.8s ease-in-out';
                    marker.style.transform = 'scale(1.2)';
                    marker.style.boxShadow = '0 0 0 8px rgba(74, 144, 226, 0.5), 0 0 30px rgba(74, 144, 226, 0.8)';

                    setTimeout(() => {
                        marker.style.transform = 'scale(1)';
                        marker.style.boxShadow = '0 0 0 3px rgba(74, 144, 226, 0.3), 0 0 15px rgba(74, 144, 226, 0.5)';
                    }, 800);
                };

                // Pulso inicial
                pulseMarker();

                // Pulso continuo
                const intervalId = setInterval(pulseMarker, 3500);
                this.animationTimers.push(intervalId);

            }, index * 600 + 1000);
        });
    },

    animateDoctoralThesis() {
        const doctoralThesis = document.querySelector('.doctoral-thesis');
        if (!doctoralThesis) return;

        setTimeout(() => {
            // Animación de entrada
            doctoralThesis.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
            doctoralThesis.style.opacity = '1';
            doctoralThesis.style.transform = 'translateY(0)';

            // Efecto shimmer
            this.addShimmerEffect(doctoralThesis);

            // Comillas respirando
            this.addQuoteAnimation();

        }, 1500);
    },

    addShimmerEffect(element) {
        const shimmerEffect = () => {
            // Crear elemento shimmer
            let shimmer = element.querySelector('.js-shimmer');
            if (!shimmer) {
                shimmer = document.createElement('div');
                shimmer.className = 'js-shimmer';
                shimmer.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 107, 53, 0.4), transparent);
                    transition: left 2s ease;
                    pointer-events: none;
                    z-index: 1;
                `;
                element.appendChild(shimmer);
            }

            // Animar
            shimmer.style.left = '-100%';
            requestAnimationFrame(() => {
                shimmer.style.left = '100%';
            });
        };

        // Shimmer inicial y repetido
        setTimeout(shimmerEffect, 800);
        const shimmerId = setInterval(shimmerEffect, 5000);
        this.animationTimers.push(shimmerId);
    },

    addQuoteAnimation() {
        const style = document.createElement('style');
        style.id = 'quote-breathing';
        style.innerHTML = `
            @keyframes quoteBreathe {
                0%, 100% { 
                    opacity: 0.6; 
                    transform: scale(1); 
                }
                50% { 
                    opacity: 1; 
                    transform: scale(1.15); 
                }
            }
            
            .thesis-highlight::before,
            .thesis-highlight::after {
                animation: quoteBreathe 3.5s ease-in-out infinite;
            }
            
            .thesis-highlight::after {
                animation-delay: 1.7s;
            }
        `;

        if (!document.querySelector('#quote-breathing')) {
            document.head.appendChild(style);
        }
    },

    animatePublications() {
        const publications = document.querySelector('.publications');
        if (!publications) return;

        setTimeout(() => {
            publications.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
            publications.style.opacity = '1';
            publications.style.transform = 'translateY(0)';
        }, 2000);
    },

    animateArticles() {
        const articles = document.querySelectorAll('.scientific-articles li');

        articles.forEach((article, index) => {
            setTimeout(() => {
                article.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                article.style.opacity = '1';
                article.style.transform = 'translateX(0)';

                // Rebote
                setTimeout(() => {
                    article.style.transform = 'translateX(8px)';
                    setTimeout(() => {
                        article.style.transform = 'translateX(0)';
                    }, 200);
                }, 400);

            }, index * 300 + 2500);
        });

        // Línea de escaneo
        setTimeout(() => {
            this.addScanLine();
        }, 3000);
    },

    addScanLine() {
        const container = document.querySelector('.scientific-articles');
        if (!container) return;

        const scanLine = document.createElement('div');
        scanLine.className = 'scan-line';
        scanLine.style.cssText = `
            position: absolute;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, transparent, #4A90E2, #FF6B35, #4A90E2, transparent);
            opacity: 0;
            top: 0;
            pointer-events: none;
            z-index: 10;
            border-radius: 2px;
        `;

        container.style.position = 'relative';
        container.appendChild(scanLine);

        const runScan = () => {
            scanLine.style.top = '0';
            scanLine.style.opacity = '0';
            scanLine.style.transition = 'none';

            requestAnimationFrame(() => {
                scanLine.style.transition = 'all 2.5s ease-in-out';
                scanLine.style.opacity = '0.8';
                scanLine.style.top = '100%';

                setTimeout(() => {
                    scanLine.style.opacity = '0';
                }, 2200);
            });
        };

        // Escaneo inicial y repetido
        setTimeout(runScan, 500);
        const scanId = setInterval(runScan, 6000);
        this.animationTimers.push(scanId);
    },

    addContinuousEffects() {
        // Iconos flotantes
        const icons = document.querySelectorAll('.external-link-icon');

        icons.forEach((icon, index) => {
            const float = () => {
                icon.style.transition = 'transform 2.5s ease-in-out';
                icon.style.transform = 'translateY(-4px) rotate(8deg)';

                setTimeout(() => {
                    icon.style.transform = 'translateY(0) rotate(0deg)';
                }, 2500);
            };

            // Flotación escalonada
            setTimeout(() => {
                float();
                const floatId = setInterval(float, 5000);
                this.animationTimers.push(floatId);
            }, index * 1000 + 4000);
        });

        // Efectos hover mejorados
        this.enhanceHoverEffects();
    },

    enhanceHoverEffects() {
        // Timeline items
        document.querySelectorAll('.timeline-content').forEach(content => {
            content.addEventListener('mouseenter', () => {
                content.style.transform = 'translateX(15px) translateY(-5px) scale(1.02)';
                content.style.borderLeftColor = '#4A90E2';
                content.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.4)';
            });

            content.addEventListener('mouseleave', () => {
                content.style.transform = 'translateX(0) translateY(0) scale(1)';
                content.style.borderLeftColor = '#FF6B35';
                content.style.boxShadow = '';
            });
        });

        // Tesis doctoral
        const thesis = document.querySelector('.doctoral-thesis');
        if (thesis) {
            thesis.addEventListener('mouseenter', () => {
                thesis.style.transform = 'translateY(-10px) scale(1.03)';
                thesis.style.borderColor = 'rgba(255, 107, 53, 0.9)';
                thesis.style.boxShadow = '0 20px 40px rgba(255, 107, 53, 0.3)';
            });

            thesis.addEventListener('mouseleave', () => {
                thesis.style.transform = 'translateY(0) scale(1)';
                thesis.style.borderColor = 'rgba(255, 107, 53, 0.3)';
                thesis.style.boxShadow = '';
            });
        }

        // Artículos con efecto especial
        document.querySelectorAll('.article-link').forEach(link => {
            link.addEventListener('mouseenter', () => {
                const icon = link.querySelector('.external-link-icon');
                if (icon) {
                    icon.style.transform = 'translateX(8px) scale(1.2) rotate(15deg)';
                    icon.style.color = '#FF6B35';
                }
            });

            link.addEventListener('mouseleave', () => {
                const icon = link.querySelector('.external-link-icon');
                if (icon) {
                    icon.style.transform = 'translateX(0) scale(1) rotate(0deg)';
                    icon.style.color = '';
                }
            });
        });
    },

    // Método para limpiar animaciones
    destroy() {
        this.animationTimers.forEach(id => clearInterval(id));
        this.animationTimers = [];

        // Limpiar estilos dinámicos
        const dynamicStyles = document.querySelectorAll('#timeline-glow-animation, #quote-breathing');
        dynamicStyles.forEach(style => style.remove());

        // Limpiar elementos creados
        document.querySelectorAll('.js-shimmer, .scan-line').forEach(el => el.remove());

        console.log('Animaciones académicas limpiadas');
    }
};

/* ===================================================================== */
/* EXPORTACIÓN PARA TESTING (SI ES NECESARIO) */
/* ===================================================================== */

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        HeroSlider,
        Navigation,
        ServicesTabs,
        ContactForm,
        Utils,
        Analytics,
        AcademicAnimations
    };
}






/* ===================================================================== */
/* MÓDULO: FORMULARIO DE CONTACTO */
/* ===================================================================== */

const ContactForm = {
    init() {
        this.bindEvents();
        console.log('✅ Formulario de contacto inicializado');
    },

    bindEvents() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        const inputs = form.querySelectorAll('input, select, textarea');

        // Validación en tiempo real
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        // Envío del formulario
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    },

    validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        const isRequired = field.hasAttribute('required');

        let isValid = true;
        let errorMessage = '';

        // Validación de campos requeridos
        if (isRequired && !value) {
            isValid = false;
            errorMessage = 'Este campo es obligatorio';
        }

        // Validación de email
        if (fieldType === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Por favor ingresa un email válido';
            }
        }

        // Validación de select
        if (field.tagName === 'SELECT' && isRequired && !value) {
            isValid = false;
            errorMessage = 'Por favor selecciona una opción';
        }

        // Validación de longitud del mensaje
        if (field.name === 'message' && value && value.length < 10) {
            isValid = false;
            errorMessage = 'El mensaje debe tener al menos 10 caracteres';
        }

        this.displayFieldValidation(field, isValid, errorMessage);
        return isValid;
    },

    clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.remove('error');

        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = '';
        }
    },

    displayFieldValidation(field, isValid, errorMessage) {
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');

        if (isValid) {
            formGroup.classList.remove('error');
            if (errorElement) errorElement.textContent = '';
        } else {
            formGroup.classList.add('error');
            if (errorElement) errorElement.textContent = errorMessage;
        }
    },

    handleFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const inputs = form.querySelectorAll('input, select, textarea');
        let isFormValid = true;

        // Validar todos los campos
        inputs.forEach(input => {
            const isFieldValid = this.validateField(input);
            if (!isFieldValid) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            this.submitForm(form);
        } else {
            // Scroll al primer error
            const firstError = form.querySelector('.form-group.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    },

    submitForm(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        // Simular envío del formulario
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');

        // Recopilar datos del formulario
        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        // Simular delay de envío
        setTimeout(() => {
            console.log('📧 Datos del formulario:', data);

            // Mostrar mensaje de éxito
            this.showFormSuccess();

            // Resetear formulario
            form.reset();

            // Restaurar botón
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');

            // Limpiar errores
            const errorElements = form.querySelectorAll('.form-group.error');
            errorElements.forEach(element => {
                element.classList.remove('error');
                const errorMsg = element.querySelector('.error-message');
                if (errorMsg) errorMsg.textContent = '';
            });

            // Tracking
            Analytics.trackEvent('Form', 'Submit', 'Contact Form');

        }, 2000);
    },

    showFormSuccess() {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #38A169, #48BB78);
                color: white;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                text-align: center;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                animation: slideInUp 0.6s ease-out;
            ">
                <h4 style="margin: 0 0 8px 0;">¡Mensaje enviado exitosamente! ✅</h4>
                <p style="margin: 0; opacity: 0.9;">Te contactaremos pronto para agendar tu consulta gratuita.</p>
            </div>
        `;

        const form = document.getElementById('contactForm');
        form.parentNode.insertBefore(successMessage, form);

        // Scroll al mensaje de éxito
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Remover mensaje después de 5 segundos
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    }
};

/* ===================================================================== */
/* MÓDULO: ANIMACIONES DE SCROLL */
/* ===================================================================== */

const ScrollAnimations = {
    init() {
        this.initIntersectionObserver();
        console.log('✅ Animaciones de scroll inicializadas');
    },

    initIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observar elementos para animación
        const animateElements = document.querySelectorAll(`
            .service-card,
            .testimonial-card,
            .project-card,
            .experience-item,
            .about-text,
            .about-experience,
            .section-header
        `);

        animateElements.forEach(el => {
            observer.observe(el);
        });
    }
};

/* ===================================================================== */
/* MÓDULO: SCROLL SUAVE */
/* ===================================================================== */

const SmoothScrolling = {
    init() {
        this.bindEvents();
        console.log('✅ Scroll suave inicializado');
    },

    bindEvents() {
        const links = document.querySelectorAll('a[href^="#"]');

        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');

                // Skip empty or single # links
                if (!href || href === '#') return;

                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    e.preventDefault();

                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
};

/* ===================================================================== */
/* MÓDULO: OPTIMIZACIÓN DE RENDIMIENTO */
/* ===================================================================== */

const PerformanceOptimization = {
    init() {
        this.optimizeAnimations();
        this.initLazyLoading();
        this.preloadImages();
        console.log('✅ Optimización de rendimiento inicializada');
    },

    optimizeAnimations() {
        // Detectar dispositivos de baja gama
        const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;

        if (isLowEndDevice) {
            document.documentElement.style.setProperty('--transition', 'all 0.2s ease');

            const complexAnimations = document.querySelectorAll('.hero-particles, .hero-grid-bg');
            complexAnimations.forEach(element => {
                element.style.animation = 'none';
            });
        }

        // Respetar preferencias de movimiento reducido
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

        if (prefersReducedMotion.matches) {
            HeroSlider.stopAutoSlider();
            document.documentElement.style.setProperty('--transition', 'all 0.1s ease');

            const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-description, .hero-stats, .hero-buttons, .hero-image');
            heroElements.forEach(element => {
                element.style.animation = 'none';
            });
        }
    },

    initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    },

    preloadImages() {
        setTimeout(() => {
            HeroSlider.preloadNextSlide();
        }, 2000);
    }
};

/* ===================================================================== */
/* MÓDULO: ANALYTICS Y TRACKING */
/* ===================================================================== */

const Analytics = {
    init() {
        this.bindTrackingEvents();
        console.log('✅ Analytics inicializado');
    },

    trackEvent(category, action, label) {
        console.log('📊 Event tracked:', { category, action, label });

        // En producción, aquí se integraría con Google Analytics, etc.
        // gtag('event', action, {
        //     event_category: category,
        //     event_label: label
        // });
    },

    bindTrackingEvents() {
        // Track CTA clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-primary') || e.target.classList.contains('service-cta')) {
                const buttonText = e.target.textContent.trim();
                this.trackEvent('CTA', 'Click', buttonText);
            }

            // Track slider navigation
            if (e.target.classList.contains('slider-btn') || e.target.classList.contains('dot')) {
                this.trackEvent('Slider', 'Navigate', `Manual Navigation`);
            }
        });

        // Track scroll depth
        this.trackScrollDepth();
    },

    trackScrollDepth() {
        let maxScroll = 0;
        const milestones = [25, 50, 75, 100];
        const tracked = new Set();

        window.addEventListener('scroll', Utils.debounce(() => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);

            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;

                milestones.forEach(milestone => {
                    if (scrollPercent >= milestone && !tracked.has(milestone)) {
                        tracked.add(milestone);
                        this.trackEvent('Scroll', 'Depth', `${milestone}%`);
                    }
                });
            }
        }, 500));
    }
};

/* ===================================================================== */
/* MÓDULO: UTILIDADES */
/* ===================================================================== */

const Utils = {
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

/* ===================================================================== */
/* MÓDULO: ACCESIBILIDAD */
/* ===================================================================== */

const Accessibility = {
    init() {
        this.enhanceKeyboardNavigation();
        console.log('✅ Mejoras de accesibilidad aplicadas');
    },

    enhanceKeyboardNavigation() {
        // Detectar navegación por teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // Mejorar navegación del carrusel
        const sliderContainer = document.querySelector('.slider-container');
        if (sliderContainer) {
            sliderContainer.setAttribute('role', 'region');
            sliderContainer.setAttribute('aria-label', 'Carrusel de presentación');
        }
    }
};

/* ===================================================================== */
/* MANEJO DE ERRORES */
/* ===================================================================== */

window.addEventListener('error', (e) => {
    console.error('❌ Error en el sitio web:', e.error);
    Analytics.trackEvent('Error', 'JavaScript', e.error.message);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('❌ Promise rechazada no manejada:', e.reason);
    Analytics.trackEvent('Error', 'Promise Rejection', e.reason);
    e.preventDefault();
});

/* ===================================================================== */
/* INICIALIZACIÓN DE ACCESIBILIDAD */
/* ===================================================================== */

// Inicializar accesibilidad al cargar el DOM
document.addEventListener('DOMContentLoaded', function() {
    Accessibility.init();
});

/* ===================================================================== */
/* EXPORTACIÓN PARA TESTING (SI ES NECESARIO) */
/* ===================================================================== */

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        HeroSlider,
        Navigation,
        ServicesTabs,
        ContactForm,
        Utils,
        Analytics
    };
}

