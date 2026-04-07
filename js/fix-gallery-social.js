/* ===================================================================== */
/* CORRECCIÓN ESPECÍFICA PARA GALERÍA Y REDES SOCIALES */
/* Archivo: fix-gallery-social.js */
/* ===================================================================== */

console.log('🔧 Iniciando corrección de Galería y Redes Sociales...');

// =====================================================================
// 1. CORRECCIÓN INMEDIATA DE LA GALERÍA "MOMENTOS DESTACADOS"
// =====================================================================

const GalleryFix = {
    isInitialized: false,

    init() {
        if (this.isInitialized) return;

        console.log('📸 Corrigiendo Galería de Momentos Destacados...');

        // Verificar elementos críticos
        if (!this.checkCriticalElements()) {
            console.error('❌ Elementos críticos de la galería no encontrados');
            return;
        }

        // Aplicar correcciones CSS inmediatas
        this.applyCSSFixes();

        // Reinicializar funcionalidad
        this.reinitializeGallery();

        this.isInitialized = true;
        console.log('✅ Galería corregida exitosamente');
    },

    checkCriticalElements() {
        const elements = {
            section: document.querySelector('#momentos-destacados'),
            container: document.querySelector('.gallery-horizontal-container'),
            scroll: document.querySelector('.gallery-horizontal-scroll'),
            items: document.querySelectorAll('.gallery-item'),
            filters: document.querySelectorAll('.filter-btn'),
            modal: document.getElementById('gallery-modal')
        };

        console.log('🔍 Verificando elementos de la galería:');
        Object.entries(elements).forEach(([name, element]) => {
            const exists = element && (element.length !== undefined ? element.length > 0 : true);
            console.log(`- ${name}:`, exists ? '✅' : '❌');
        });

        return elements.section && elements.container && elements.items.length > 0;
    },

    applyCSSFixes() {
        // Crear estilos de corrección específicos
        const fixCSS = `
            /* CORRECCIONES CRÍTICAS PARA LA GALERÍA */
            .moments-gallery {
                padding: 80px 0 !important;
                background: linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%) !important;
                display: block !important;
                visibility: visible !important;
            }
            
            .gallery-horizontal-container {
                position: relative !important;
                margin: 0 25px !important;
                width: calc(100% - 50px) !important;
                display: block !important;
                visibility: visible !important;
            }
            
            .gallery-horizontal-scroll {
                display: flex !important;
                flex-direction: row !important;
                flex-wrap: nowrap !important;
                gap: 20px !important;
                overflow-x: auto !important;
                overflow-y: hidden !important;
                scroll-behavior: smooth !important;
                padding: 10px 0 20px 0 !important;
                width: 100% !important;
                visibility: visible !important;
            }
            
            .gallery-item {
                flex: 0 0 auto !important;
                width: 280px !important;
                min-width: 280px !important;
                max-width: 280px !important;
                opacity: 1 !important;
                transform: translateY(0) !important;
                display: block !important;
                visibility: visible !important;
                transition: all 0.4s ease !important;
            }
            
            .gallery-item.filtering {
                opacity: 0 !important;
                transform: scale(0.8) !important;
                width: 0 !important;
                min-width: 0 !important;
                overflow: hidden !important;
            }
            
            .gallery-item.visible {
                opacity: 1 !important;
                transform: scale(1) !important;
                width: 280px !important;
                min-width: 280px !important;
                max-width: 280px !important;
                display: block !important;
                visibility: visible !important;
            }
            
            .gallery-card {
                background: white !important;
                border-radius: 16px !important;
                overflow: hidden !important;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08) !important;
                height: 320px !important;
                width: 100% !important;
                display: block !important;
                transition: all 0.4s ease !important;
            }
            
            .gallery-filters {
                display: flex !important;
                justify-content: center !important;
                flex-wrap: nowrap !important;
                gap: 8px !important;
                margin-bottom: 50px !important;
                visibility: visible !important;
            }
            
            .filter-btn {
                padding: 10px 16px !important;
                border: 2px solid transparent !important;
                background: transparent !important;
                color: #64748b !important;
                border-radius: 25px !important;
                cursor: pointer !important;
                transition: all 0.3s ease !important;
                white-space: nowrap !important;
            }
            
            .filter-btn.active {
                background: linear-gradient(135deg, #4A90E2, #357ABD) !important;
                color: white !important;
                border-color: #4A90E2 !important;
            }
        `;

        // Aplicar CSS
        const existingFix = document.getElementById('gallery-css-fix');
        if (existingFix) {
            existingFix.remove();
        }

        const style = document.createElement('style');
        style.id = 'gallery-css-fix';
        style.textContent = fixCSS;
        document.head.appendChild(style);

        console.log('🎨 CSS de corrección aplicado');
    },

    reinitializeGallery() {
        // Mostrar todos los items inicialmente
        const items = document.querySelectorAll('.gallery-item');
        items.forEach((item, index) => {
            item.classList.remove('filtering');
            setTimeout(() => {
                item.classList.add('visible');
            }, index * 100);
        });

        // Reinicializar filtros
        this.setupFilters();

        // Reinicializar modal
        this.setupModal();

        // Configurar navegación
        this.setupNavigation();

        console.log('🔄 Galería reinicializada');
    },

    setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');

        // Limpiar event listeners existentes
        filterButtons.forEach(button => {
            button.replaceWith(button.cloneNode(true));
        });

        // Reconfigurar
        const newButtons = document.querySelectorAll('.filter-btn');
        newButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const filter = button.getAttribute('data-filter');
                this.applyFilter(filter, button);
            });
        });

        console.log('🔘 Filtros reconfigurados');
    },

    applyFilter(filter, activeButton) {
        console.log(`🔍 Aplicando filtro: ${filter}`);

        // Actualizar botones
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeButton.classList.add('active');

        // Filtrar items
        const items = document.querySelectorAll('.gallery-item');

        items.forEach(item => {
            item.classList.add('filtering');
            item.classList.remove('visible');
        });

        setTimeout(() => {
            let visibleCount = 0;

            items.forEach(item => {
                const category = item.getAttribute('data-category');
                const shouldShow = filter === 'all' || category === filter;

                if (shouldShow) {
                    setTimeout(() => {
                        item.classList.remove('filtering');
                        item.classList.add('visible');
                    }, visibleCount * 100);
                    visibleCount++;
                }
            });

            console.log(`✅ Filtro aplicado. Items visibles: ${visibleCount}`);
        }, 200);
    },

    setupModal() {
        const modal = document.getElementById('gallery-modal');
        if (!modal) return;

        // Configurar eventos del modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        // Configurar botones de galería
        document.querySelectorAll('.gallery-btn').forEach(button => {
            button.addEventListener('click', () => this.openModal(button));
        });

        console.log('🖼️ Modal configurado');
    },

    openModal(button) {
        const modal = document.getElementById('gallery-modal');
        if (!modal) return;

        const item = button.closest('.gallery-item');
        if (!item) return;

        const data = {
            image: item.getAttribute('data-image'),
            title: item.getAttribute('data-title'),
            description: item.getAttribute('data-description'),
            category: item.getAttribute('data-category'),
            date: item.getAttribute('data-date')
        };

        // Actualizar contenido
        const titleEl = modal.querySelector('#modal-title');
        const imageEl = modal.querySelector('#modal-image');
        const textEl = modal.querySelector('#modal-text');

        if (titleEl) titleEl.textContent = data.title || 'Título no disponible';
        if (imageEl) {
            imageEl.src = data.image || '';
            imageEl.alt = data.title || '';
        }
        if (textEl) textEl.textContent = data.description || 'Descripción no disponible';

        // Mostrar modal
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10);
        document.body.style.overflow = 'hidden';

        console.log('📷 Modal abierto');
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

    setupNavigation() {
        const container = document.querySelector('.gallery-horizontal-scroll');
        if (!container) return;

        // Agregar botones si no existen
        const galleryContainer = document.querySelector('.gallery-horizontal-container');
        if (!galleryContainer || galleryContainer.querySelector('.gallery-nav-btn')) return;

        const prevBtn = document.createElement('button');
        prevBtn.className = 'gallery-nav-btn gallery-nav-prev';
        prevBtn.innerHTML = '←';
        prevBtn.style.cssText = `
            position: absolute;
            left: -20px;
            top: 50%;
            transform: translateY(-50%);
            width: 45px;
            height: 45px;
            background: rgba(255, 255, 255, 0.9);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.4rem;
            color: #4A90E2;
            z-index: 15;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        `;

        const nextBtn = document.createElement('button');
        nextBtn.className = 'gallery-nav-btn gallery-nav-next';
        nextBtn.innerHTML = '→';
        nextBtn.style.cssText = prevBtn.style.cssText.replace('left: -20px', 'right: -20px');

        prevBtn.addEventListener('click', () => {
            container.scrollBy({ left: -300, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            container.scrollBy({ left: 300, behavior: 'smooth' });
        });

        galleryContainer.appendChild(prevBtn);
        galleryContainer.appendChild(nextBtn);

        console.log('🔄 Navegación configurada');
    }
};

// =====================================================================
// 2. CORRECCIÓN DEL CARRUSEL DE REDES SOCIALES
// =====================================================================

const SocialCarouselFix = {
    isInitialized: false,
    currentIndex: 0,
    cardsToShow: 3,
    totalCards: 0,

    init() {
        if (this.isInitialized) return;

        console.log('🌐 Corrigiendo Carrusel de Redes Sociales...');

        if (!this.checkSocialElements()) {
            console.error('❌ Elementos del carrusel social no encontrados');
            return;
        }

        this.applySocialCSS();
        this.reinitializeSocial();

        this.isInitialized = true;
        console.log('✅ Carrusel social corregido');
    },

    checkSocialElements() {
        const elements = {
            section: document.querySelector('#redes-sociales'),
            container: document.querySelector('.social-carousel-container'),
            track: document.getElementById('socialCarouselTrack'),
            cards: document.querySelectorAll('.social-card'),
            prevBtn: document.getElementById('socialPrevBtn'),
            nextBtn: document.getElementById('socialNextBtn')
        };

        console.log('🔍 Verificando elementos sociales:');
        Object.entries(elements).forEach(([name, element]) => {
            const exists = element && (element.length !== undefined ? element.length > 0 : true);
            console.log(`- ${name}:`, exists ? '✅' : '❌');
        });

        return elements.section && elements.container && elements.cards.length > 0;
    },

    applySocialCSS() {
        const socialCSS = `
            /* CORRECCIONES CRÍTICAS PARA REDES SOCIALES */
            .social-networks {
                padding: 80px 0 !important;
                background: linear-gradient(135deg, #001122 0%, #002244 25%, #003366 50%, #004488 75%, #001122 100%) !important;
                display: block !important;
                visibility: visible !important;
            }
            
            .social-carousel-container {
                position: relative !important;
                max-width: 1200px !important;
                margin: 0 auto !important;
                padding: 0 60px !important;
                display: block !important;
                visibility: visible !important;
            }
            
            .social-carousel {
                overflow: hidden !important;
                border-radius: 20px !important;
                background: rgba(255, 255, 255, 0.05) !important;
                display: block !important;
                visibility: visible !important;
            }
            
            .social-carousel-track {
                display: flex !important;
                transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
                padding: 30px 0 !important;
                visibility: visible !important;
            }
            
            .social-card {
                flex: 0 0 320px !important;
                margin: 0 15px !important;
                position: relative !important;
                z-index: 1 !important;
                display: block !important;
                visibility: visible !important;
            }
            
            .social-link {
                display: flex !important;
                align-items: center !important;
                gap: 20px !important;
                background: rgba(255, 255, 255, 0.95) !important;
                border-radius: 16px !important;
                padding: 24px !important;
                text-decoration: none !important;
                transition: all 0.4s ease !important;
                visibility: visible !important;
            }
            
            .social-nav-btn {
                position: absolute !important;
                top: 50% !important;
                transform: translateY(-50%) !important;
                width: 50px !important;
                height: 50px !important;
                background: rgba(255, 255, 255, 0.9) !important;
                border: none !important;
                border-radius: 50% !important;
                cursor: pointer !important;
                z-index: 10 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                visibility: visible !important;
            }
            
            .social-prev {
                left: 10px !important;
            }
            
            .social-next {
                right: 10px !important;
            }
        `;

        const existingSocialFix = document.getElementById('social-css-fix');
        if (existingSocialFix) {
            existingSocialFix.remove();
        }

        const style = document.createElement('style');
        style.id = 'social-css-fix';
        style.textContent = socialCSS;
        document.head.appendChild(style);

        console.log('🎨 CSS social aplicado');
    },

    reinitializeSocial() {
        const track = document.getElementById('socialCarouselTrack');
        const prevBtn = document.getElementById('socialPrevBtn');
        const nextBtn = document.getElementById('socialNextBtn');

        if (!track) return;

        this.totalCards = document.querySelectorAll('.social-card').length;
        this.updateCardsToShow();

        // Configurar botones
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousSlide());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Actualizar vista inicial
        this.updateCarousel();

        console.log('🔄 Carrusel social reinicializado');
    },

    updateCardsToShow() {
        const width = window.innerWidth;
        if (width < 480) {
            this.cardsToShow = 1;
        } else if (width < 768) {
            this.cardsToShow = 2;
        } else {
            this.cardsToShow = 3;
        }
    },

    nextSlide() {
        const maxIndex = Math.max(0, this.totalCards - this.cardsToShow);
        if (this.currentIndex < maxIndex) {
            this.currentIndex++;
            this.updateCarousel();
        }
    },

    previousSlide() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCarousel();
        }
    },

    updateCarousel() {
        const track = document.getElementById('socialCarouselTrack');
        if (!track) return;

        const cardWidth = 350; // 320px + 30px margin
        const offset = -this.currentIndex * cardWidth;

        track.style.transform = `translateX(${offset}px)`;

        // Actualizar botones
        const prevBtn = document.getElementById('socialPrevBtn');
        const nextBtn = document.getElementById('socialNextBtn');

        if (prevBtn) {
            prevBtn.style.opacity = this.currentIndex === 0 ? '0.5' : '1';
            prevBtn.disabled = this.currentIndex === 0;
        }

        if (nextBtn) {
            const maxIndex = Math.max(0, this.totalCards - this.cardsToShow);
            nextBtn.style.opacity = this.currentIndex >= maxIndex ? '0.5' : '1';
            nextBtn.disabled = this.currentIndex >= maxIndex;
        }
    }
};

// =====================================================================
// 3. CORRECCIÓN DE LA IMAGEN DE "INVESTIGACIÓN EN ANÁLISIS DE SENTIMIENTOS"
// =====================================================================

const ImageFix = {
    init() {
        console.log('🖼️ Corrigiendo imagen de Investigación...');

        // Buscar la imagen problemática
        const projectCards = document.querySelectorAll('.project-card');

        projectCards.forEach(card => {
            const title = card.querySelector('h3');
            const img = card.querySelector('.project-image img');

            if (title && title.textContent.includes('Investigación en Análisis de Sentimientos')) {
                console.log('🔍 Imagen de investigación encontrada');

                if (img) {
                    // URL de respaldo para la imagen
                    const backupImageUrl = 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';

                    // Configurar imagen con respaldo
                    img.onerror = function() {
                        console.log('❌ Imagen original falló, usando respaldo');
                        this.src = backupImageUrl;

                        // Si el respaldo también falla, usar placeholder
                        this.onerror = function() {
                            console.log('❌ Respaldo falló, usando placeholder');
                            this.src = 'https://via.placeholder.com/400x200/4A90E2/ffffff?text=Investigaci%C3%B3n+en+IA';
                        };
                    };

                    // Intentar cargar la imagen original
                    if (!img.complete || img.naturalHeight === 0) {
                        img.src = img.src; // Forzar recarga
                    }
                }
            }
        });

        console.log('✅ Corrección de imagen aplicada');
    }
};

// =====================================================================
// 4. INICIALIZACIÓN AUTOMÁTICA Y DIAGNÓSTICO
// =====================================================================

function initializeAllFixes() {
    console.log('🚀 Inicializando todas las correcciones...');

    // Esperar a que el DOM esté completamente cargado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(executeAllFixes, 500);
        });
    } else {
        setTimeout(executeAllFixes, 500);
    }
}

function executeAllFixes() {
    console.log('⚡ Ejecutando correcciones...');

    try {
        // Corrección de la galería
        GalleryFix.init();

        // Corrección del carrusel social
        SocialCarouselFix.init();

        // Corrección de imagen
        ImageFix.init();

        console.log('✅ Todas las correcciones aplicadas exitosamente');

        // Diagnóstico final
        setTimeout(runDiagnostic, 1000);

    } catch (error) {
        console.error('❌ Error aplicando correcciones:', error);
    }
}

function runDiagnostic() {
    console.log('🔍 === DIAGNÓSTICO FINAL ===');

    // Verificar galería
    const galleryVisible = document.querySelector('.moments-gallery')?.offsetHeight > 0;
    const galleryItems = document.querySelectorAll('.gallery-item.visible').length;
    console.log(`📸 Galería visible: ${galleryVisible ? '✅' : '❌'}`);
    console.log(`📸 Items de galería visibles: ${galleryItems}`);

    // Verificar redes sociales
    const socialVisible = document.querySelector('.social-networks')?.offsetHeight > 0;
    const socialCards = document.querySelectorAll('.social-card').length;
    console.log(`🌐 Redes sociales visible: ${socialVisible ? '✅' : '❌'}`);
    console.log(`🌐 Tarjetas sociales: ${socialCards}`);

    // Verificar imagen de investigación
    const researchImg = document.querySelector('.project-card img[src*="research"], .project-card img[src*="investigacion"]');
    console.log(`🖼️ Imagen de investigación: ${researchImg ? '✅' : '❌'}`);

    console.log('=== FIN DIAGNÓSTICO ===');
}

// =====================================================================
// 5. FUNCIONES GLOBALES PARA DEBUGGING
// =====================================================================

window.debugGalleryFix = function() {
    console.log('🔍 Debug Galería:');
    console.log('- Inicializada:', GalleryFix.isInitialized);
    console.log('- Items totales:', document.querySelectorAll('.gallery-item').length);
    console.log('- Items visibles:', document.querySelectorAll('.gallery-item.visible').length);

    GalleryFix.checkCriticalElements();
};

window.debugSocialFix = function() {
    console.log('🔍 Debug Redes Sociales:');
    console.log('- Inicializada:', SocialCarouselFix.isInitialized);
    console.log('- Cards totales:', SocialCarouselFix.totalCards);
    console.log('- Índice actual:', SocialCarouselFix.currentIndex);

    SocialCarouselFix.checkSocialElements();
};

window.forceFixAll = function() {
    console.log('🔧 Forzando corrección completa...');
    GalleryFix.isInitialized = false;
    SocialCarouselFix.isInitialized = false;
    executeAllFixes();
};

window.testGalleryModal = function() {
    const firstBtn = document.querySelector('.gallery-btn');
    if (firstBtn) {
        GalleryFix.openModal(firstBtn);
    } else {
        console.log('❌ No se encontró botón de galería para test');
    }
};

// =====================================================================
// 6. INICIALIZACIÓN AUTOMÁTICA
// =====================================================================

// Ejecutar inmediatamente
initializeAllFixes();

// También ejecutar en window.load como respaldo
window.addEventListener('load', () => {
    setTimeout(() => {
        if (!GalleryFix.isInitialized || !SocialCarouselFix.isInitialized) {
            console.log('🔄 Ejecutando correcciones de respaldo...');
            executeAllFixes();
        }
    }, 1000);
});

console.log('🎯 Fix de Galería y Redes Sociales cargado completamente');
console.log('💡 Funciones de debug disponibles:');
console.log('   - debugGalleryFix()');
console.log('   - debugSocialFix()');
console.log('   - forceFixAll()');
console.log('   - testGalleryModal()');