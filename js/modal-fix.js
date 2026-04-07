// =====================================================================
// SISTEMA DE DIAGNÓSTICO Y CORRECCIÓN PARA MODALES - VERSIÓN ACTUALIZADA
// Ahora incluye los 4 libros con configuración correcta
// =====================================================================

console.log('🔧 Iniciando sistema de diagnóstico de modales (4 libros)...');

// =====================================================================
// PASO 1: DIAGNÓSTICO COMPLETO DEL PROBLEMA
// =====================================================================

function diagnosticModal() {
    console.log('\n🔍 === DIAGNÓSTICO COMPLETO DE MODALES ===');

    // Verificar elementos HTML de todos los libros
    const books = ['book1', 'book2', 'book3', 'book4'];

    books.forEach(bookId => {
        const modal = document.getElementById(`preview-modal-${bookId}`);
        const button = document.querySelector(`button[onclick*="${bookId}"]`);

        console.log(`\n📋 ${bookId.toUpperCase()}:`);
        console.log('- Modal:', !!modal);
        console.log('- Botón:', !!button);

        if (modal) {
            console.log('- Display:', window.getComputedStyle(modal).display);
            console.log('- Clases:', modal.className);
            const pages = modal.querySelectorAll('.preview-page');
            console.log('- Páginas en HTML:', pages.length);
        }
    });

    // Verificar JavaScript
    console.log('\n📋 Funciones JavaScript:');
    console.log('- openPreviewModal:', typeof openPreviewModal);
    console.log('- BookPreviewModals:', typeof BookPreviewModals);
    console.log('- BookPreviewModalsFixed:', typeof BookPreviewModalsFixed);

    console.log('\n⚠️ Revisa la consola para errores JavaScript adicionales');

    return {
        functionsExist: typeof openPreviewModal !== 'undefined'
    };
}

// =====================================================================
// PASO 2: CORRECCIÓN DEFINITIVA DEL SISTEMA DE MODALES (4 LIBROS)
// =====================================================================

const BookPreviewModalsFixed = {
    currentPages: {
        book1: 1,
        book2: 1,
        book3: 1,  // ✅ AGREGADO
        book4: 1   // ✅ AGREGADO
    },
    totalPages: {
        book1: 11,  // ✅ CORREGIDO (era 3, ahora 11)
        book2: 8,
        book3: 12,   // ✅ AGREGADO
        book4: 5    // ✅ AGREGADO
    },
    isInitialized: false,

    init() {
        if (this.isInitialized) return;

        console.log('🚀 Inicializando sistema de modales corregido (4 libros)...');
        console.log('📚 Configuración:', this.totalPages);
        this.bindEvents();
        this.isInitialized = true;
        console.log('✅ Sistema de modales inicializado correctamente');
    },

    bindEvents() {
        // Cerrar con click fuera del modal
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('preview-modal')) {
                const bookId = this.getBookIdFromModal(e.target);
                if (bookId) {
                    this.closeModal(bookId);
                }
            }
        });

        // Cerrar con ESC
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

        // Navegación con teclado
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
    },

    // ✅ NUEVO: Extraer bookId de forma más robusta
    getBookIdFromModal(modal) {
        const id = modal.id;
        const match = id.match(/preview-modal-book(\d+)/);
        return match ? `book${match[1]}` : null;
    },

    openModal(bookId) {
        try {
            console.log(`📖 Abriendo modal para libro: ${bookId}`);

            const modal = document.getElementById(`preview-modal-${bookId}`);
            if (!modal) {
                console.error(`❌ Modal no encontrado: preview-modal-${bookId}`);
                alert('Error: No se pudo encontrar el modal. Revisa la consola para más detalles.');
                return;
            }

            // Verificar que el libro esté configurado
            if (!this.currentPages.hasOwnProperty(bookId)) {
                console.error(`❌ Libro no configurado: ${bookId}`);
                alert(`Error: El ${bookId} no está configurado en JavaScript`);
                return;
            }

            // ✅ CRÍTICO: Resetear página actual a 1
            this.currentPages[bookId] = 1;

            // ✅ CRÍTICO: Actualizar display ANTES de mostrar el modal
            this.updatePageDisplay(bookId);

            // Mostrar modal con animación suave
            modal.style.display = 'flex';
            modal.style.opacity = '0';

            // Forzar reflow
            modal.offsetHeight;

            setTimeout(() => {
                modal.classList.add('show');
                modal.style.opacity = '1';
            }, 10);

            // Bloquear scroll del body
            document.body.style.overflow = 'hidden';

            // Focus para accesibilidad
            modal.focus();

            console.log(`✅ Modal ${bookId} abierto en página 1/${this.totalPages[bookId]}`);

            // Analytics (si está disponible)
            this.trackEvent('Book', 'Preview Open', `Book ${bookId}`);

        } catch (error) {
            console.error('❌ Error al abrir modal:', error);
            alert('Error al abrir la vista previa. Revisa la consola para más detalles.');
        }
    },

    closeModal(bookId) {
        try {
            console.log(`🔒 Cerrando modal para libro: ${bookId}`);

            const modal = document.getElementById(`preview-modal-${bookId}`);
            if (!modal) {
                console.error(`❌ Modal no encontrado: preview-modal-${bookId}`);
                return;
            }

            // Ocultar con animación
            modal.classList.remove('show');
            modal.style.opacity = '0';

            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);

            console.log(`✅ Modal ${bookId} cerrado correctamente`);

            // Analytics
            this.trackEvent('Book', 'Preview Close', `Book ${bookId}`);

        } catch (error) {
            console.error('❌ Error al cerrar modal:', error);
        }
    },

    nextPage(bookId) {
        if (!this.currentPages.hasOwnProperty(bookId)) {
            console.error(`❌ Libro no configurado: ${bookId}`);
            return;
        }

        if (this.currentPages[bookId] < this.totalPages[bookId]) {
            this.currentPages[bookId]++;
            this.updatePageDisplay(bookId);
            this.trackEvent('Book', 'Preview Next Page', `Book ${bookId} - Page ${this.currentPages[bookId]}`);
            console.log(`➡️ ${bookId}: Página ${this.currentPages[bookId]}/${this.totalPages[bookId]}`);
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
            this.trackEvent('Book', 'Preview Previous Page', `Book ${bookId} - Page ${this.currentPages[bookId]}`);
            console.log(`⬅️ ${bookId}: Página ${this.currentPages[bookId]}/${this.totalPages[bookId]}`);
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

        const currentPage = this.currentPages[bookId];
        const totalPages = this.totalPages[bookId];

        console.log(`🔄 Actualizando ${bookId} a página ${currentPage}/${totalPages}`);

        // Actualizar páginas visibles
        const pages = modal.querySelectorAll('.preview-page');
        console.log(`   📄 Páginas en HTML: ${pages.length}`);

        // ✅ CRÍTICO: Quitar active de TODAS las páginas primero
        pages.forEach((page, index) => {
            page.classList.remove('active');
        });

        // ✅ CRÍTICO: Agregar active solo a la página actual
        if (pages[currentPage - 1]) {
            pages[currentPage - 1].classList.add('active');
            console.log(`   ✅ Página ${currentPage} marcada como active`);

            // Debug: verificar que se aplicó correctamente
            const display = window.getComputedStyle(pages[currentPage - 1]).display;
            console.log(`   CSS display: ${display}`);

            if (display === 'none') {
                console.error(`   ⚠️ WARNING: La página ${currentPage} tiene display: none aunque tiene active`);
            }
        } else {
            console.error(`❌ No se encontró la página ${currentPage} (índice ${currentPage - 1})`);
        }

        // Actualizar indicador de página
        const currentPageElement = document.getElementById(`current-page-${bookId}`);
        if (currentPageElement) {
            currentPageElement.textContent = currentPage;
        }

        // Actualizar botones de navegación
        const prevBtn = modal.querySelector('.nav-btn:first-child');
        const nextBtn = modal.querySelector('.nav-btn:last-child');

        if (prevBtn) {
            prevBtn.disabled = currentPage === 1;
            prevBtn.style.opacity = currentPage === 1 ? '0.5' : '1';
            prevBtn.style.cursor = currentPage === 1 ? 'not-allowed' : 'pointer';
        }

        if (nextBtn) {
            nextBtn.disabled = currentPage === totalPages;
            nextBtn.style.opacity = currentPage === totalPages ? '0.5' : '1';
            nextBtn.style.cursor = currentPage === totalPages ? 'not-allowed' : 'pointer';
        }
    },

    trackEvent(category, action, label) {
        try {
            if (typeof Analytics !== 'undefined' && Analytics.trackEvent) {
                Analytics.trackEvent(category, action, label);
            }
        } catch (error) {
            // Silenciar errores de analytics
        }
    },

    // Función de testing
    testModal(bookId) {
        console.log(`🧪 Probando modal ${bookId}...`);
        this.openModal(bookId);

        setTimeout(() => {
            this.nextPage(bookId);
        }, 1000);

        setTimeout(() => {
            this.previousPage(bookId);
        }, 2000);

        setTimeout(() => {
            this.closeModal(bookId);
        }, 3000);
    },

    // ✅ NUEVO: Método de diagnóstico
    debug() {
        console.log('\n🔍 === ESTADO DEL SISTEMA ===');
        console.log('Inicializado:', this.isInitialized);
        console.log('Páginas actuales:', this.currentPages);
        console.log('Total páginas:', this.totalPages);

        Object.keys(this.currentPages).forEach(bookId => {
            const modal = document.getElementById(`preview-modal-${bookId}`);
            const pages = modal ? modal.querySelectorAll('.preview-page').length : 0;
            const configured = this.totalPages[bookId];

            console.log(`\n${bookId.toUpperCase()}:`);
            console.log(`  - Configurado: ${configured} páginas`);
            console.log(`  - En HTML: ${pages} páginas`);
            console.log(`  - Coincide: ${pages === configured ? '✅' : '❌'}`);
        });
    }
};

// =====================================================================
// PASO 3: FUNCIONES GLOBALES MEJORADAS
// =====================================================================

function openPreviewModal(bookId) {
    console.log(`🔧 openPreviewModal llamada con: ${bookId}`);

    // Verificar que el sistema esté inicializado
    if (!BookPreviewModalsFixed.isInitialized) {
        console.log('🚀 Inicializando sistema antes de abrir modal...');
        BookPreviewModalsFixed.init();
    }

    BookPreviewModalsFixed.openModal(bookId);
}

function closePreviewModal(bookId) {
    BookPreviewModalsFixed.closeModal(bookId);
}

function nextPage(bookId) {
    BookPreviewModalsFixed.nextPage(bookId);
}

function previousPage(bookId) {
    BookPreviewModalsFixed.previousPage(bookId);
}

// =====================================================================
// PASO 4: SISTEMA DE RECUPERACIÓN AUTOMÁTICA
// =====================================================================

function setupModalRecovery() {
    console.log('🛡️ Configurando sistema de recuperación...');

    // Interceptar clicks en botones de vista previa
    document.addEventListener('click', function(e) {
        if (e.target.matches('button[onclick*="openPreviewModal"]')) {
            e.preventDefault();

            const onclickAttr = e.target.getAttribute('onclick');
            const bookId = onclickAttr.match(/openPreviewModal\(['"](.+?)['"]\)/)?.[1];

            if (bookId) {
                console.log(`🔧 Interceptado click en botón de ${bookId}`);
                openPreviewModal(bookId);
            }
        }
    });

    // Backup para botones que no funcionan
    const previewButtons = document.querySelectorAll('button[onclick*="openPreviewModal"]');
    previewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const onclickAttr = this.getAttribute('onclick');
            const bookId = onclickAttr.match(/openPreviewModal\(['"](.+?)['"]\)/)?.[1];

            if (bookId) {
                e.preventDefault();
                e.stopPropagation();
                console.log(`🔄 Ejecutando backup para ${bookId}`);
                openPreviewModal(bookId);
            }
        });
    });
}

// =====================================================================
// PASO 5: INICIALIZACIÓN AUTOMÁTICA
// =====================================================================

function initializeModalSystem() {
    console.log('🎯 Inicializando sistema completo de modales (4 libros)...');

    // Diagnóstico inicial
    const diagnostic = diagnosticModal();

    // Inicializar sistema mejorado
    BookPreviewModalsFixed.init();

    // Configurar recuperación
    setupModalRecovery();

    // Hacer funciones globales disponibles
    window.openPreviewModal = openPreviewModal;
    window.closePreviewModal = closePreviewModal;
    window.nextPage = nextPage;
    window.previousPage = previousPage;

    // Funciones de testing globales
    window.testModalBook1 = () => BookPreviewModalsFixed.testModal('book1');
    window.testModalBook2 = () => BookPreviewModalsFixed.testModal('book2');
    window.testModalBook3 = () => BookPreviewModalsFixed.testModal('book3');
    window.testModalBook4 = () => BookPreviewModalsFixed.testModal('book4');
    window.diagnosticModal = diagnosticModal;
    window.debugModalSystem = () => BookPreviewModalsFixed.debug();

    console.log('✅ Sistema de modales completamente inicializado');
    console.log('🧪 Funciones de testing disponibles:');
    console.log('   - testModalBook1() : Prueba el modal del libro 1');
    console.log('   - testModalBook2() : Prueba el modal del libro 2');
    console.log('   - testModalBook3() : Prueba el modal del libro 3');
    console.log('   - testModalBook4() : Prueba el modal del libro 4');
    console.log('   - debugModalSystem() : Muestra estado del sistema');
    console.log('   - diagnosticModal() : Ejecuta diagnóstico completo');
}

// =====================================================================
// PASO 6: AUTO-INICIALIZACIÓN
// =====================================================================

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeModalSystem);
} else {
    // DOM ya está listo
    setTimeout(initializeModalSystem, 100);
}

// También inicializar cuando se cargue la página (backup)
window.addEventListener('load', function() {
    setTimeout(initializeModalSystem, 500);
});

console.log('✅ Sistema de diagnóstico y corrección cargado completamente (4 libros)');
console.log('💡 Ejecuta debugModalSystem() en la consola para ver el estado actual');

// Exportar para uso externo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        BookPreviewModalsFixed,
        openPreviewModal,
        closePreviewModal,
        nextPage,
        previousPage,
        diagnosticModal,
        initializeModalSystem
    };
}