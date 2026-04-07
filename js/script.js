/* ===================================================================== */
/* INICIALIZACIÓN PRINCIPAL - SCRIPT.JS COMPLETO ACTUALIZADO */
/* ===================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando sitio web de Roberto Acuña Caicedo...');

    // Inicializar todos los módulos
    HeroSlider.init();
    Navigation.init();
    ServicesTabs.init();
    ContactOptions.init(); // Actualizado para chatbot avanzado
    ScrollAnimations.init();
    SmoothScrolling.init();
    PerformanceOptimization.init();
    Analytics.init();
    PortfolioAnimations.init();
    AcademicOverlays.init();
    BookPreviewModals.init();
    GalleryMoments.init();
    SocialCarousel();

    // NUEVO: Inicializar chatbot avanzado cuando esté disponible
    initializeAdvancedChatbot();

    console.log('✅ Sitio web inicializado correctamente');
});

/* ===================================================================== */
/* NUEVO: INICIALIZACIÓN DEL CHATBOT AVANZADO */
/* ===================================================================== */

function initializeAdvancedChatbot() {
    // Verificar que la clase AdvancedChatbot esté disponible
    if (typeof AdvancedChatbot !== 'undefined') {
        // Crear instancia global del chatbot
        window.advancedChatbot = new AdvancedChatbot();
        console.log('🤖 Chatbot avanzado listo para usar');
    } else {
        console.warn('⚠️ AdvancedChatbot no está disponible. Asegúrate de incluir advanced-chatbot.js');

        // Fallback: mantener funciones básicas
        setupBasicChatbotFallback();
    }
}

/* ===================================================================== */
/* FALLBACK: FUNCIONES BÁSICAS SI NO ESTÁ EL CHATBOT AVANZADO */
/* ===================================================================== */

function setupBasicChatbotFallback() {
    console.log('🔄 Configurando fallback de chatbot básico...');

    // Mantener funciones globales básicas para compatibilidad
    window.openAIChatbot = function() {
        alert('Chatbot no disponible. Por favor, incluye el archivo advanced-chatbot.js');
    };

    window.closeAIChatbot = function() {
        console.log('Cerrando chatbot básico...');
    };
}

/* ===================================================================== */
/* FUNCIONES GLOBALES ACTUALIZADAS PARA CHATBOT */
/* ===================================================================== */

// Estas funciones ahora delegan al chatbot avanzado
function openAIChatbot() {
    // Verificar si el chatbot avanzado está disponible
    if (window.advancedChatbot) {
        // Inicializar si no está inicializado
        if (!window.advancedChatbot.isInitialized) {
            window.advancedChatbot.init();
        }

        // Mostrar el modal
        const modal = document.getElementById('aiChatbotModal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';

            setTimeout(() => {
                const input = document.getElementById('chatbotInput');
                if (input) input.focus();
            }, 300);

            // Analytics
            if (typeof Analytics !== 'undefined' && Analytics.trackEvent) {
                Analytics.trackEvent('Chatbot', 'Open', 'Advanced AI Assistant');
            }
        }
    } else {
        // Fallback: crear chatbot avanzado si no existe
        try {
            window.advancedChatbot = new AdvancedChatbot();
            window.advancedChatbot.init();

            // Intentar abrir nuevamente
            setTimeout(() => {
                openAIChatbot();
            }, 500);
        } catch (error) {
            console.error('Error creando chatbot:', error);
            alert('Error al cargar el chatbot. Por favor, recarga la página.');
        }
    }
}

function closeAIChatbot() {
    const modal = document.getElementById('aiChatbotModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';

        // Analytics
        if (typeof Analytics !== 'undefined' && Analytics.trackEvent) {
            Analytics.trackEvent('Chatbot', 'Close', 'Advanced AI Assistant');
        }
    }
}

/* ===================================================================== */
/* MÓDULO: CARRUSEL DEL HERO - VERSIÓN CORREGIDA */
/* ===================================================================== */

const HeroSlider = {
    currentSlide: 0,
    slideInterval: null,
    slides: null,
    dots: null,
    totalSlides: 0,
    isAutoSliderActive: false,

    init() {
        console.log('🎬 Inicializando HeroSlider...');
        
        this.slides = document.querySelectorAll('.slide');
        this.dots = document.querySelectorAll('.dot');
        this.totalSlides = this.slides.length;

        if (this.slides.length === 0) {
            console.warn('⚠️ No se encontraron slides');
            return;
        }

        console.log(`📊 Total de slides encontrados: ${this.totalSlides}`);

        this.bindEvents();
        this.initHeroAnimations();
        
        // Iniciar auto-slider después de un pequeño delay
        setTimeout(() => {
            this.startAutoSlider();
        }, 1000);

        console.log('✅ HeroSlider inicializado correctamente');
    },

    bindEvents() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                console.log('🔙 Botón anterior presionado');
                this.changeSlide(this.currentSlide - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                console.log('🔜 Botón siguiente presionado');
                this.changeSlide(this.currentSlide + 1);
            });
        }

        // Event listeners para dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                console.log(`🎯 Dot ${index + 1} presionado`);
                this.changeSlide(index);
            });
        });

        // Event listeners para hover - CORREGIDOS
        const sliderContainer = document.querySelector('.slider-container');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', () => {
                console.log('⏸️ Hover detectado - pausando auto-slider');
                this.pauseAutoSlider();
            });

            sliderContainer.addEventListener('mouseleave', () => {
                console.log('▶️ Hover terminado - reanudando auto-slider');
                this.resumeAutoSlider();
            });
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

        console.log('✅ Event listeners configurados');
    },

    changeSlide(newSlide) {
        console.log(`🔄 Cambiando al slide: ${newSlide}`);
        
        // Calcular slide válido
        if (newSlide >= this.totalSlides) {
            newSlide = 0;
        } else if (newSlide < 0) {
            newSlide = this.totalSlides - 1;
        }

        // Solo cambiar si es diferente
        if (newSlide === this.currentSlide) {
            console.log('⚠️ Mismo slide, no hay cambio');
            return;
        }

        // Remover clase active del slide y dot actuales
        this.slides[this.currentSlide].classList.remove('active');
        this.dots[this.currentSlide].classList.remove('active');

        // Actualizar índice
        this.currentSlide = newSlide;

        // Agregar clase active al nuevo slide y dot
        this.slides[this.currentSlide].classList.add('active');
        this.dots[this.currentSlide].classList.add('active');

        console.log(`✅ Slide cambiado a: ${this.currentSlide + 1}`);

        // Inicializar animaciones si es el slide principal
        if (this.currentSlide === 0) {
            setTimeout(() => {
                this.initHeroAnimations();
            }, 500);
        }

        // Track analytics de forma segura
        this.trackSlideChange();
    },

    nextSlide() {
        console.log('⏭️ Avanzando al siguiente slide...');
        this.changeSlide(this.currentSlide + 1);
    },

    startAutoSlider() {
        console.log('🚀 Iniciando auto-slider...');
        this.stopAutoSlider();
        
        this.slideInterval = setInterval(() => {
            console.log('⏰ Auto-slider ejecutándose...');
            this.nextSlide();
        }, 6000);
        
        this.isAutoSliderActive = true;
        console.log('✅ Auto-slider iniciado (6 segundos por slide)');
    },

    stopAutoSlider() {
        if (this.slideInterval) {
            console.log('🛑 Deteniendo auto-slider...');
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        }
        this.isAutoSliderActive = false;
    },

    pauseAutoSlider() {
        if (this.isAutoSliderActive) {
            console.log('⏸️ Pausando auto-slider...');
            this.stopAutoSlider();
            this.isAutoSliderActive = true; // Mantener estado para reanudar
        }
    },

    resumeAutoSlider() {
        if (this.isAutoSliderActive) {
            console.log('▶️ Reanudando auto-slider...');
            this.startAutoSlider();
        }
    },

    initHeroAnimations() {
        console.log('🎭 Inicializando animaciones del hero...');
        
        const activeSlide = document.querySelector('.slide.active');
        if (!activeSlide) {
            console.warn('⚠️ No se encontró slide activo');
            return;
        }

        const heroElements = activeSlide.querySelectorAll(`
            .hero-badge, 
            .hero-title, 
            .hero-description, 
            .hero-stats, 
            .hero-buttons, 
            .hero-image
        `);

        heroElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';

            setTimeout(() => {
                element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });

        // Animar contadores después de las animaciones iniciales
        setTimeout(() => {
            this.animateCounters();
        }, 1000);

        console.log('✅ Animaciones del hero iniciadas');
    },

    animateCounters() {
        const activeSlide = document.querySelector('.slide.active');
        if (!activeSlide) return;

        const counters = activeSlide.querySelectorAll('.stat-number');

        counters.forEach(counter => {
            const targetText = counter.textContent;
            const target = parseInt(targetText.replace(/[^\d]/g, ''));
            
            if (isNaN(target)) return;

            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = targetText; // Restaurar texto original
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current) + '+';
                }
            }, 40);
        });

        console.log('🔢 Animación de contadores iniciada');
    },

    trackSlideChange() {
        try {
            if (typeof Analytics !== 'undefined' && Analytics.trackEvent) {
                Analytics.trackEvent('Slider', 'Navigate', `Slide ${this.currentSlide + 1}`);
            }
        } catch (error) {
            console.warn('⚠️ Error al trackear evento:', error);
        }
    },

    preloadNextSlide() {
        const nextSlideIndex = (this.currentSlide + 1) % this.totalSlides;
        const nextSlideImg = this.slides[nextSlideIndex]?.querySelector('img');

        if (nextSlideImg && !nextSlideImg.complete) {
            const img = new Image();
            img.src = nextSlideImg.src;
        }
    },

    // Función de debugging
    debug() {
        console.log('🔍 Estado del HeroSlider:', {
            currentSlide: this.currentSlide,
            totalSlides: this.totalSlides,
            isAutoSliderActive: this.isAutoSliderActive,
            slideInterval: !!this.slideInterval,
            slidesFound: this.slides?.length || 0,
            dotsFound: this.dots?.length || 0
        });
    },

    // Función para forzar inicio del auto-slider
    forceStart() {
        console.log('🔧 Forzando inicio del auto-slider...');
        this.stopAutoSlider();
        this.startAutoSlider();
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

        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        });

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

/* ===================================================================== */
/* MÓDULO: ANIMACIONES DEL PORTAFOLIO - MODIFICADO PARA TARJETAS */
/* ===================================================================== */

const PortfolioAnimations = {
    currentIndex: 0,
    portfolioCards: null,
    animationInterval: null,
    colors: [
        'linear-gradient(135deg, #1e3a8a, #3b82f6)',
        'linear-gradient(135deg, #059669, #10b981)',
        'linear-gradient(135deg, #dc2626, #ef4444)',
        'linear-gradient(135deg, #7c2d12, #ea580c)',
        'linear-gradient(135deg, #581c87, #8b5cf6)',
        'linear-gradient(135deg, #0f172a, #1e293b)'
    ],

    init() {
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
        setTimeout(() => {
            this.animationInterval = setInterval(() => {
                this.animateNextCard();
            }, 2000);
        }, 2000);
    },

    animateNextCard() {
        if (this.portfolioCards.length === 0) return;

        this.resetPreviousCard();

        const currentCard = this.portfolioCards[this.currentIndex];
        const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];

        this.animateCard(currentCard, randomColor);
        this.currentIndex = (this.currentIndex + 1) % this.portfolioCards.length;
    },

    animateCard(card, color) {
        card.classList.add('card-animation');
        card.style.background = color;
        card.style.transform = 'translateY(-8px) scale(1.05)';
        card.style.borderColor = '#ffffff';
        card.style.color = '#ffffff';

        card.style.boxShadow = `
            0 20px 40px rgba(0, 0, 0, 0.3),
            0 0 0 3px rgba(255, 255, 255, 0.2)
        `;

        const label = card.querySelector('.plink-label');
        if (label) {
            label.style.color = '#ffffff';
            label.style.fontWeight = '700';
        }

        card.style.animation = 'cardPulse 0.8s ease-out';
    },

    resetPreviousCard() {
        this.portfolioCards.forEach((card, index) => {
            if (index !== this.currentIndex) {
                card.classList.remove('card-animation');
                card.style.background = 'var(--white)';
                card.style.transform = '';
                card.style.borderColor = '#1e3a8a';
                card.style.color = '';
                card.style.boxShadow = 'var(--shadow)';
                card.style.animation = '';

                const label = card.querySelector('.plink-label');
                if (label) {
                    label.style.color = '';
                    label.style.fontWeight = '';
                }
            }
        });
    },

    bindEvents() {
        this.portfolioCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.pauseAnimation();
            });

            card.addEventListener('mouseleave', () => {
                this.resumeAnimation();
            });
        });

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
                    if (!this.animationInterval) {
                        this.startColorAnimation();
                    }
                } else {
                    this.pauseAnimation();
                    this.resetAllCards();
                }
            });
        }, {
            threshold: 0.3
        });

        observer.observe(portfolioSection);
    },

    resetAllCards() {
        this.portfolioCards.forEach(card => {
            card.classList.remove('card-animation');
            card.style.background = 'var(--white)';
            card.style.transform = '';
            card.style.borderColor = '#1e3a8a';
            card.style.color = '';
            card.style.boxShadow = 'var(--shadow)';
            card.style.animation = '';

            const label = card.querySelector('.plink-label');
            if (label) {
                label.style.color = '';
                label.style.fontWeight = '';
            }
        });

        this.currentIndex = 0;
    },

    stopAnimations() {
        this.pauseAnimation();
        this.resetAllCards();
        console.log('🔇 Animaciones del portafolio detenidas');
    }
};

/* ===================================================================== */
/* ANIMACIÓN CSS ADICIONAL PARA LAS TARJETAS */
/* ===================================================================== */

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

    .plink {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }

    .plink-label {
        transition: color 0.3s ease, font-weight 0.3s ease !important;
    }
`;

const styleElement = document.createElement('style');
styleElement.textContent = cardAnimationCSS;
document.head.appendChild(styleElement);

/* ===================================================================== */
/* MÓDULO: MODALES DE VISTA PREVIA DE LIBROS */
/* ===================================================================== */

/* ===================================================================== */
/* MÓDULO: MODALES DE VISTA PREVIA DE LIBROS - VERSIÓN CORREGIDA */
/* ===================================================================== */

const BookPreviewModals = {
    currentPages: {
        book1: 1,
        book2: 1,
        book3: 1,
        book4: 1
    },
    totalPages: {
        book1: 11,  // ✅ CORREGIDO: era 3, ahora 11
        book2: 8,
        book3: 12,   // ✅ AGREGADO
        book4: 5    // ✅ AGREGADO
    },

    init() {
        this.bindEvents();
        console.log('✅ Modales de vista previa inicializados');
        console.log('📚 Libros configurados:', Object.keys(this.currentPages));
        console.log('📄 Páginas por libro:', this.totalPages);
    },

    bindEvents() {
        // Cerrar modal al hacer click fuera
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('preview-modal')) {
                const bookId = this.getBookIdFromModal(e.target);
                if (bookId) {
                    this.closeModal(bookId);
                }
            }
        });

        // Cerrar modal con tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.preview-modal.show');
                if (openModal) {
                    const bookId = this.getBookIdFromModal(openModal);
                    if (bookId) {
                        this.closeModal(bookId);
                    }
                }
            }
        });

        // Navegación con teclado (flechas izquierda/derecha)
        document.addEventListener('keydown', (e) => {
            const openModal = document.querySelector('.preview-modal.show');
            if (openModal) {
                const bookId = this.getBookIdFromModal(openModal);
                if (bookId) {
                    if (e.key === 'ArrowLeft') {
                        e.preventDefault();
                        this.previousPage(bookId);
                    } else if (e.key === 'ArrowRight') {
                        e.preventDefault();
                        this.nextPage(bookId);
                    }
                }
            }
        });

        console.log('✅ Event listeners de modales configurados');
    },

    // ✅ NUEVO: Método para extraer el bookId del modal de forma más robusta
    getBookIdFromModal(modal) {
        const id = modal.id;
        const match = id.match(/preview-modal-book(\d+)/);
        return match ? `book${match[1]}` : null;
    },

    openModal(bookId) {
        console.log(`📖 Abriendo modal: ${bookId}`);

        const modal = document.getElementById(`preview-modal-${bookId}`);
        if (!modal) {
            console.error(`❌ Modal no encontrado: preview-modal-${bookId}`);
            alert(`Error: No se pudo encontrar el modal del ${bookId}`);
            return;
        }

        // Verificar que el libro esté configurado
        if (!this.currentPages.hasOwnProperty(bookId)) {
            console.error(`❌ Libro no configurado en JavaScript: ${bookId}`);
            alert(`Error: El ${bookId} no está configurado correctamente`);
            return;
        }

        // Resetear a la primera página
        this.currentPages[bookId] = 1;
        this.updatePageDisplay(bookId);

        // Mostrar modal con animación
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);

        // Bloquear scroll del body
        document.body.style.overflow = 'hidden';

        // Establecer foco para accesibilidad
        modal.focus();

        // Analytics (si está disponible)
        if (typeof Analytics !== 'undefined' && Analytics.trackEvent) {
            Analytics.trackEvent('Book', 'Preview Open', `Book ${bookId}`);
        }

        console.log(`✅ Modal ${bookId} abierto - Página 1/${this.totalPages[bookId]}`);
    },

    closeModal(bookId) {
        console.log(`🔒 Cerrando modal: ${bookId}`);

        const modal = document.getElementById(`preview-modal-${bookId}`);
        if (!modal) {
            console.error(`❌ Modal no encontrado: preview-modal-${bookId}`);
            return;
        }

        // Ocultar con animación
        modal.classList.remove('show');

        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);

        // Analytics
        if (typeof Analytics !== 'undefined' && Analytics.trackEvent) {
            Analytics.trackEvent('Book', 'Preview Close', `Book ${bookId}`);
        }

        console.log(`✅ Modal ${bookId} cerrado`);
    },

    nextPage(bookId) {
        if (!this.currentPages.hasOwnProperty(bookId)) {
            console.error(`❌ Libro no configurado: ${bookId}`);
            return;
        }

        if (this.currentPages[bookId] < this.totalPages[bookId]) {
            this.currentPages[bookId]++;
            this.updatePageDisplay(bookId);

            console.log(`➡️ ${bookId}: Página ${this.currentPages[bookId]}/${this.totalPages[bookId]}`);

            // Analytics
            if (typeof Analytics !== 'undefined' && Analytics.trackEvent) {
                Analytics.trackEvent('Book', 'Preview Next Page', `Book ${bookId} - Page ${this.currentPages[bookId]}`);
            }
        } else {
            console.log(`⚠️ ${bookId}: Ya estás en la última página`);
        }
    },

    previousPage(bookId) {
        if (!this.currentPages.hasOwnProperty(bookId)) {
            console.error(`❌ Libro no configurado: ${bookId}`);
            return;
        }

        if (this.currentPages[bookId] > 1) {
            this.currentPages[bookId]--;
            this.updatePageDisplay(bookId);

            console.log(`⬅️ ${bookId}: Página ${this.currentPages[bookId]}/${this.totalPages[bookId]}`);

            // Analytics
            if (typeof Analytics !== 'undefined' && Analytics.trackEvent) {
                Analytics.trackEvent('Book', 'Preview Previous Page', `Book ${bookId} - Page ${this.currentPages[bookId]}`);
            }
        } else {
            console.log(`⚠️ ${bookId}: Ya estás en la primera página`);
        }
    },

    updatePageDisplay(bookId) {
        const modal = document.getElementById(`preview-modal-${bookId}`);
        if (!modal) {
            console.error(`❌ Modal no encontrado para actualizar: ${bookId}`);
            return;
        }

        // Actualizar páginas visibles (agregar/quitar clase 'active')
        const pages = modal.querySelectorAll('.preview-page');
        pages.forEach((page, index) => {
            if (index + 1 === this.currentPages[bookId]) {
                page.classList.add('active');
            } else {
                page.classList.remove('active');
            }
        });

        // Actualizar indicador de página actual
        const currentPageElement = document.getElementById(`current-page-${bookId}`);
        if (currentPageElement) {
            currentPageElement.textContent = this.currentPages[bookId];
        }

        // Actualizar estado de botones de navegación
        const prevBtn = modal.querySelector('.nav-btn:first-child');
        const nextBtn = modal.querySelector('.nav-btn:last-child');

        if (prevBtn) {
            prevBtn.disabled = this.currentPages[bookId] === 1;
            prevBtn.style.opacity = this.currentPages[bookId] === 1 ? '0.5' : '1';
            prevBtn.style.cursor = this.currentPages[bookId] === 1 ? 'not-allowed' : 'pointer';
        }

        if (nextBtn) {
            nextBtn.disabled = this.currentPages[bookId] === this.totalPages[bookId];
            nextBtn.style.opacity = this.currentPages[bookId] === this.totalPages[bookId] ? '0.5' : '1';
            nextBtn.style.cursor = this.currentPages[bookId] === this.totalPages[bookId] ? 'not-allowed' : 'pointer';
        }
    },

    // ✅ NUEVO: Método de diagnóstico
    debug() {
        console.log('\n🔍 === DIAGNÓSTICO DE MODALES ===');
        console.log('Libros configurados:', Object.keys(this.currentPages));
        console.log('Páginas actuales:', this.currentPages);
        console.log('Total de páginas:', this.totalPages);

        // Verificar modales en el DOM
        Object.keys(this.currentPages).forEach(bookId => {
            const modal = document.getElementById(`preview-modal-${bookId}`);
            const button = document.querySelector(`button[onclick*="openPreviewModal('${bookId}')"]`);
            const pages = modal ? modal.querySelectorAll('.preview-page').length : 0;

            console.log(`\n${bookId.toUpperCase()}:`);
            console.log(`  - Modal existe: ${!!modal}`);
            console.log(`  - Botón existe: ${!!button}`);
            console.log(`  - Páginas en HTML: ${pages}`);
            console.log(`  - Páginas configuradas: ${this.totalPages[bookId]}`);
            console.log(`  - Coincide: ${pages === this.totalPages[bookId] ? '✅' : '❌'}`);
        });

        console.log('\n=================================\n');
    }
};

/* ===================================================================== */
/* FUNCIONES GLOBALES PARA LOS MODALES */
/* ===================================================================== */

// Estas funciones son llamadas directamente desde el HTML con onclick
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

// Hacer disponible el método de debug globalmente
window.debugBookModals = function() {
    BookPreviewModals.debug();
};

console.log('✅ Módulo BookPreviewModals cargado correctamente');
console.log('💡 Ejecuta debugBookModals() en la consola para diagnóstico completo');

/* ===================================================================== */
/* JAVASCRIPT PARA GALERÍA HORIZONTAL */
/* ===================================================================== */

const GalleryMoments = {
    isInitialized: false,
    currentFilter: 'all',

    init() {
        if (this.isInitialized) return;

        console.log('🎯 Inicializando galería horizontal...');

        if (!this.checkElements()) return;

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

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeButton.classList.add('active');

        const galleryItems = document.querySelectorAll('.gallery-item');

        galleryItems.forEach(item => {
            item.classList.add('filtering');
            item.classList.remove('visible');
        });

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

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                this.closeModal();
            }
        });

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

        const galleryItem = button.closest('.gallery-item');
        if (!galleryItem) {
            console.error('❌ Gallery item no encontrado');
            return;
        }

        const data = {
            image: galleryItem.getAttribute('data-image'),
            title: galleryItem.getAttribute('data-title'),
            description: galleryItem.getAttribute('data-description'),
            category: galleryItem.getAttribute('data-category'),
            date: galleryItem.getAttribute('data-date')
        };

        console.log('📷 Abriendo modal con datos:', data);

        this.updateModalContent(modal, data);

        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);

        document.body.style.overflow = 'hidden';
    },

    updateModalContent(modal, data) {
        const titleElement = modal.querySelector('#modal-title');
        if (titleElement) {
            titleElement.textContent = data.title || 'Título no disponible';
        }

        const imageElement = modal.querySelector('#modal-image');
        if (imageElement) {
            imageElement.src = data.image || '';
            imageElement.alt = data.title || '';

            imageElement.onerror = function() {
                this.src = 'https://via.placeholder.com/400x300/f0f0f0/666?text=Imagen+no+disponible';
            };
        }

        const textElement = modal.querySelector('#modal-text');
        if (textElement) {
            textElement.textContent = data.description || 'Descripción no disponible';
        }

        const categoryElement = modal.querySelector('.modal-category');
        if (categoryElement) {
            categoryElement.textContent = this.getCategoryName(data.category);
        }

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

        this.addNavigationButtons(container);

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

        if (container.scrollWidth <= container.clientWidth) return;

        if (galleryContainer.querySelector('.gallery-nav-btn')) return;

        const prevBtn = document.createElement('button');
        prevBtn.className = 'gallery-nav-btn gallery-nav-prev';
        prevBtn.innerHTML = '←';
        prevBtn.setAttribute('aria-label', 'Imagen anterior');

        const nextBtn = document.createElement('button');
        nextBtn.className = 'gallery-nav-btn gallery-nav-next';
        nextBtn.innerHTML = '→';
        nextBtn.setAttribute('aria-label', 'Imagen siguiente');

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

        galleryContainer.appendChild(prevBtn);
        galleryContainer.appendChild(nextBtn);

        container.addEventListener('scroll', () => {
            const scrollLeft = container.scrollLeft;
            const maxScroll = container.scrollWidth - container.clientWidth;

            prevBtn.style.opacity = scrollLeft > 0 ? '1' : '0.5';
            nextBtn.style.opacity = scrollLeft < maxScroll ? '1' : '0.5';

            prevBtn.disabled = scrollLeft <= 0;
            nextBtn.disabled = scrollLeft >= maxScroll;
        });

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

/* ===================================================================== */
/* CARRUSEL DE REDES SOCIALES */
/* ===================================================================== */

class SocialCarousel {
    constructor() {
        this.track = document.getElementById('socialCarouselTrack');
        this.prevBtn = document.getElementById('socialPrevBtn');
        this.nextBtn = document.getElementById('socialNextBtn');
        this.indicatorsContainer = document.getElementById('socialCarouselIndicators');

        this.currentIndex = 0;
        this.cardsToShow = 3;
        this.totalCards = document.querySelectorAll('.social-card').length;
        this.maxIndex = Math.max(0, this.totalCards - this.cardsToShow);

        this.init();
    }

    init() {
        this.updateCardsToShow();
        this.createIndicators();
        this.bindEvents();
        this.updateCarousel();

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
        if (!this.indicatorsContainer) return;

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
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.previousSlide());
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }

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

        let startX = 0;
        let isDragging = false;

        if (this.track) {
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
        const cardWidth = 350;
        const offset = -this.currentIndex * cardWidth;

        if (this.track) {
            this.track.style.transform = `translateX(${offset}px)`;
        }

        if (this.prevBtn) {
            this.prevBtn.style.opacity = this.currentIndex === 0 ? '0.5' : '1';
            this.prevBtn.disabled = this.currentIndex === 0;
        }

        if (this.nextBtn) {
            this.nextBtn.style.opacity = this.currentIndex >= this.maxIndex ? '0.5' : '1';
            this.nextBtn.disabled = this.currentIndex >= this.maxIndex;
        }

        this.updateIndicators();
    }

    updateIndicators() {
        if (!this.indicatorsContainer) return;

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

/* ===================================================================== */
/* ANIMACIONES ACADÉMICAS AUTOMÁTICAS */
/* ===================================================================== */

function initAutoAcademicAnimations() {
    console.log('🎬 Iniciando animaciones académicas automáticas');

    const academicSection = document.querySelector('#formacion-academica');
    if (!academicSection) {
        console.log('❌ Sección académica no encontrada');
        return;
    }

    createAnimationCSS();
    applyAutomaticAnimations();

    console.log('✅ Animaciones académicas aplicadas');
}

function createAnimationCSS() {
    if (document.getElementById('academic-auto-animations')) {
        return;
    }

    const style = document.createElement('style');
    style.id = 'academic-auto-animations';
    style.innerHTML = `
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

function applyAutomaticAnimations() {
    const timelineContents = document.querySelectorAll('.timeline-content');
    timelineContents.forEach((content, index) => {
        content.classList.add('auto-animate');
        console.log(`Timeline item ${index + 1} animado`);
    });

    const doctoralThesis = document.querySelector('.doctoral-thesis');
    if (doctoralThesis) {
        doctoralThesis.classList.add('auto-animate');
        console.log('Tesis doctoral animada');
    }

    const articleLinks = document.querySelectorAll('.article-link');
    articleLinks.forEach((link, index) => {
        link.classList.add('auto-animate');
        console.log(`Artículo ${index + 1} animado`);
    });

    const icons = document.querySelectorAll('.external-link-icon');
    icons.forEach((icon, index) => {
        icon.classList.add('auto-animate');
        console.log(`Icono ${index + 1} animado`);
    });
}

function toggleAcademicAnimations() {
    const animatedElements = document.querySelectorAll('.auto-animate');
    const isRunning = animatedElements[0]?.style.animationPlayState !== 'paused';

    animatedElements.forEach(element => {
        element.style.animationPlayState = isRunning ? 'paused' : 'running';
    });

    console.log(isRunning ? '⏸️ Animaciones pausadas' : '▶️ Animaciones reanudadas');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAutoAcademicAnimations);
} else {
    initAutoAcademicAnimations();
}

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

            const openOverlay = () => {
                this.closeAllOverlays();

                content.classList.add('overlay-active');
                closeButton.focus();

                document.body.style.overflow = 'hidden';

                if (typeof Analytics !== 'undefined' && Analytics.trackEvent) {
                    Analytics.trackEvent('Academic', 'Overlay Open', content.querySelector('.degree-title')?.textContent || 'Unknown');
                }
            };

            const closeOverlay = () => {
                content.classList.remove('overlay-active');
                content.focus();

                document.body.style.overflow = '';

                if (typeof Analytics !== 'undefined' && Analytics.trackEvent) {
                    Analytics.trackEvent('Academic', 'Overlay Close', content.querySelector('.degree-title')?.textContent || 'Unknown');
                }
            };

            content.addEventListener('click', (e) => {
                if (!content.classList.contains('overlay-active')) {
                    e.preventDefault();
                    openOverlay();
                }
            });

            content.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !content.classList.contains('overlay-active')) {
                    e.preventDefault();
                    openOverlay();
                }
            });

            closeButton.addEventListener('click', (e) => {
                e.stopPropagation();
                closeOverlay();
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && content.classList.contains('overlay-active')) {
                    closeOverlay();
                }
            });

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
                if (typeof Analytics !== 'undefined' && Analytics.trackEvent) {
                    Analytics.trackEvent('Services', 'Tab Change', targetTab);
                }
            });
        });
    },

    switchTab(targetTab, tabButtons) {
        const tabPanels = document.querySelectorAll('.tab-panel');

        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanels.forEach(panel => panel.classList.remove('active'));

        const activeButton = document.querySelector(`[data-tab="${targetTab}"]`);
        if (activeButton) activeButton.classList.add('active');

        const activePanel = document.getElementById(targetTab);
        if (activePanel) {
            activePanel.classList.add('active');
            activePanel.style.animation = 'none';
            activePanel.offsetHeight;
            activePanel.style.animation = 'fadeIn 0.5s ease-in-out';
        }
    }
};

/* ===================================================================== */
/* CONTACTO OPTIONS - ACTUALIZADO PARA CHATBOT AVANZADO */
/* ===================================================================== */

const ContactOptions = {
    init() {
        this.bindContactEvents();
        console.log('✅ Opciones de contacto inicializadas (con chatbot avanzado)');
    },

    bindContactEvents() {
        // Botón del formulario
        const formBtn = document.querySelector('.form-btn');
        if (formBtn) {
            formBtn.addEventListener('click', () => {
                this.toggleContactForm();
            });
        }

        // Botón de WhatsApp (sin cambios)
        const whatsappBtn = document.querySelector('.whatsapp-btn');
        if (whatsappBtn) {
            whatsappBtn.addEventListener('click', () => {
                if (typeof Analytics !== 'undefined' && Analytics.trackEvent) {
                    Analytics.trackEvent('Contact', 'WhatsApp Click', 'Community');
                }
            });
        }

        // Botón del chatbot AI - ACTUALIZADO
        const aiBtn = document.querySelector('.ai-btn');
        if (aiBtn) {
            aiBtn.addEventListener('click', () => {
                openAIChatbot(); // Usa la función global actualizada
            });
        }

        // Cerrar formulario con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const formContainer = document.getElementById('contactFormContainer');
                if (formContainer && formContainer.style.display !== 'none') {
                    this.toggleContactForm();
                }
            }
        });

        // Cerrar formulario con click fuera
        document.addEventListener('click', (e) => {
            const formContainer = document.getElementById('contactFormContainer');
            if (e.target === formContainer) {
                this.toggleContactForm();
            }
        });
    },

    toggleContactForm() {
        const formContainer = document.getElementById('contactFormContainer');
        if (!formContainer) return;

        if (formContainer.style.display === 'none' || !formContainer.style.display) {
            // Mostrar formulario
            formContainer.style.display = 'flex';
            document.body.style.overflow = 'hidden';

            setTimeout(() => {
                const firstInput = formContainer.querySelector('input[type="text"]');
                if (firstInput) firstInput.focus();
            }, 300);

            if (typeof Analytics !== 'undefined' && Analytics.trackEvent) {
                Analytics.trackEvent('Contact', 'Form Open', 'Contact Form');
            }
        } else {
            // Ocultar formulario
            formContainer.style.display = 'none';
            document.body.style.overflow = '';

            if (typeof Analytics !== 'undefined' && Analytics.trackEvent) {
                Analytics.trackEvent('Contact', 'Form Close', 'Contact Form');
            }
        }
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
        const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;

        if (isLowEndDevice) {
            document.documentElement.style.setProperty('--transition', 'all 0.2s ease');

            const complexAnimations = document.querySelectorAll('.hero-particles, .hero-grid-bg');
            complexAnimations.forEach(element => {
                element.style.animation = 'none';
            });
        }

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

        // Integración con Google Analytics si está disponible
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }

        // Integración con otros analytics si están disponibles
        if (typeof fbq !== 'undefined') {
            fbq('trackCustom', `${category}_${action}`, { label });
        }
    },

    bindTrackingEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-primary') || e.target.classList.contains('service-cta')) {
                const buttonText = e.target.textContent.trim();
                this.trackEvent('CTA', 'Click', buttonText);
            }

            if (e.target.classList.contains('slider-btn') || e.target.classList.contains('dot')) {
                this.trackEvent('Slider', 'Navigate', `Manual Navigation`);
            }
        });

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
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        const sliderContainer = document.querySelector('.slider-container');
        if (sliderContainer) {
            sliderContainer.setAttribute('role', 'region');
            sliderContainer.setAttribute('aria-label', 'Carrusel de presentación');
        }
    }
};

/* ===================================================================== */
/* EVENTOS GLOBALES PARA CHATBOT - ACTUALIZADOS */
/* ===================================================================== */

// Cerrar modales con ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const chatbotModal = document.getElementById('aiChatbotModal');
        if (chatbotModal && chatbotModal.style.display === 'flex') {
            closeAIChatbot();
        }
    }
});

// Cerrar modales con click fuera
document.addEventListener('click', (e) => {
    const chatbotModal = document.getElementById('aiChatbotModal');
    if (e.target === chatbotModal) {
        closeAIChatbot();
    }
});

/* ===================================================================== */
/* INICIALIZACIÓN DE ACCESIBILIDAD */
/* ===================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    Accessibility.init();
});

/* ===================================================================== */
/* MANEJO DE ERRORES */
/* ===================================================================== */

window.addEventListener('error', (e) => {
    console.error('❌ Error en el sitio web:', e.error);
    if (typeof Analytics !== 'undefined' && Analytics.trackEvent) {
        Analytics.trackEvent('Error', 'JavaScript', e.error.message);
    }
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('❌ Promise rechazada no manejada:', e.reason);
    if (typeof Analytics !== 'undefined' && Analytics.trackEvent) {
        Analytics.trackEvent('Error', 'Promise Rejection', e.reason);
    }
    e.preventDefault();
});

/* ===================================================================== */
/* INICIALIZACIÓN SOCIAL CAROUSEL */
/* ===================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const socialCarousel = new SocialCarousel();
});

/* ===================================================================== */
/* FUNCIONES GLOBALES PARA LOS MODALES */
/* ===================================================================== */

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

// Funciones globales para el HTML
function openGalleryModal(button) {
    GalleryMoments.openModal(button);
}

function closeGalleryModal() {
    GalleryMoments.closeModal();
}

/* ===================================================================== */
/* FUNCIONES DE DEBUGGING PARA EL CARRUSEL */
/* ===================================================================== */

// Función global para debugging del carrusel
function debugCarousel() {
    console.log('=== DEBUG CARRUSEL ===');
    HeroSlider.debug();
    
    // Verificar elementos DOM
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    console.log('Slides en DOM:', slides.length);
    console.log('Dots en DOM:', dots.length);
    
    // Verificar slide activo
    const activeSlide = document.querySelector('.slide.active');
    console.log('Slide activo encontrado:', !!activeSlide);
    
    // Verificar auto-slider
    console.log('Auto-slider activo:', HeroSlider.isAutoSliderActive);
    console.log('Interval existe:', !!HeroSlider.slideInterval);
}

function forceRestartCarousel() {
    console.log('🔄 Forzando reinicio del carrusel...');
    HeroSlider.forceStart();
}

// Funciones de debugging para la galería
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

function testModal() {
    const firstItem = document.querySelector('.gallery-item');
    if (firstItem) {
        const button = firstItem.querySelector('.gallery-btn');
        if (button) {
            openGalleryModal(button);
        }
    }
}

/* ===================================================================== */
/* EXPORTS GLOBALES */
/* ===================================================================== */

// Hacer disponibles las funciones globalmente
window.openAIChatbot = openAIChatbot;
window.closeAIChatbot = closeAIChatbot;
window.openGalleryModal = openGalleryModal;
window.closeGalleryModal = closeGalleryModal;
window.openPreviewModal = openPreviewModal;
window.closePreviewModal = closePreviewModal;
window.nextPage = nextPage;
window.previousPage = previousPage;
window.debugGallery = debugGallery;
window.testModal = testModal;
window.toggleAcademicAnimations = toggleAcademicAnimations;
window.debugCarousel = debugCarousel;
window.forceRestartCarousel = forceRestartCarousel;
window.SocialCarousel = SocialCarousel;
window.GalleryMoments = GalleryMoments;

/* ===================================================================== */
/* EXPORTACIÓN PARA TESTING - ACTUALIZADA */
/* ===================================================================== */

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        HeroSlider,
        Navigation,
        ServicesTabs,
        ContactOptions,
        Utils,
        Analytics,
        initializeAdvancedChatbot,
        PortfolioAnimations,
        BookPreviewModals,
        GalleryMoments,
        AcademicOverlays,
        ScrollAnimations,
        SmoothScrolling,
        PerformanceOptimization,
        Accessibility
    };
}

console.log('✅ Script.js completo cargado con carrusel corregido y chatbot avanzado');