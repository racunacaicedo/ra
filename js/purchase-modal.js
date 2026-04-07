/**
 * ===================================================================
 * MODAL DE OPCIONES DE COMPRA - ENLACES HARDCODEADOS
 * ===================================================================
 */

// Títulos para cada libro
const bookTitles = {
    book1: "Tesis y artículos científicos con IA",
    book2: "El poder del Prompt"
};

/**
 * Abre el modal de opciones de compra
 */
function openPurchaseModal(bookId) {
    console.log(`Abriendo modal de compra para: ${bookId}`);

    const modal = document.getElementById('purchaseModal');
    const title = document.getElementById('purchaseModalTitle');

    if (!modal || !title) {
        console.error('Error: Elementos del modal no encontrados');
        return;
    }

    // Ocultar todas las opciones
    hideAllOptions();

    // Mostrar opciones para el libro específico
    showOptionsForBook(bookId);

    // Configurar título del modal
    title.textContent = `Comprar: ${bookTitles[bookId] || 'Libro'}`;

    // Mostrar modal con animación
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);

    // Bloquear scroll del body
    document.body.style.overflow = 'hidden';

    // Analytics tracking
    trackPurchaseEvent('modal_open', bookId);
}

/**
 * Oculta todas las opciones de compra
 */
function hideAllOptions() {
    const options = [
        'digitalOptionBook1',
        'digitalOptionBook2',
        'physicalOptionBook1',
        'physicalOptionBook2'
    ];

    options.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = 'none';
        }
    });
}

/**
 * Muestra las opciones para un libro específico
 */
function showOptionsForBook(bookId) {
    const digitalId = `digitalOption${bookId.charAt(0).toUpperCase() + bookId.slice(1)}`;
    const physicalId = `physicalOption${bookId.charAt(0).toUpperCase() + bookId.slice(1)}`;

    const digitalElement = document.getElementById(digitalId);
    const physicalElement = document.getElementById(physicalId);

    if (digitalElement) {
        digitalElement.style.display = 'flex';
    }

    if (physicalElement) {
        physicalElement.style.display = 'flex';
    }

    console.log(`Mostrando opciones para ${bookId}:`, {
        digital: digitalId,
        physical: physicalId
    });
}

/**
 * Cierra el modal de opciones de compra
 */
function closePurchaseModal() {
    const modal = document.getElementById('purchaseModal');

    if (!modal) {
        console.error('Error: Modal no encontrado');
        return;
    }

    modal.classList.remove('show');

    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }, 300);

    trackPurchaseEvent('modal_close');
}

/**
 * Tracking de eventos para analytics
 */
function trackPurchaseEvent(action, bookId = null, platform = null) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        const eventData = {
            event_category: 'purchase_modal',
            event_label: action
        };

        if (bookId) eventData.book_id = bookId;
        if (platform) eventData.platform = platform;

        gtag('event', action, eventData);
    }

    // Analytics personalizado
    if (typeof Analytics !== 'undefined' && Analytics.trackEvent) {
        Analytics.trackEvent('Purchase Modal', action, bookId || 'General');
    }

    console.log('Purchase Event:', { action, bookId, platform });
}

/**
 * Event listeners
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Purchase Modal: Inicializando...');

    // Cerrar modal al hacer clic fuera
    document.addEventListener('click', (e) => {
        const modal = document.getElementById('purchaseModal');
        if (e.target === modal) {
            closePurchaseModal();
        }
    });

    // Cerrar modal con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('purchaseModal');
            if (modal && modal.classList.contains('show')) {
                closePurchaseModal();
            }
        }
    });

    // Tracking de clics en opciones
    document.addEventListener('click', (e) => {
        const option = e.target.closest('.purchase-option');
        if (option && option.style.display !== 'none') {
            const isDigital = option.classList.contains('digital');
            const platform = isDigital ? 'Tienda Digital' : 'Amazon';
            const format = isDigital ? 'digital' : 'physical';

            trackPurchaseEvent('purchase_click', null, platform);
            console.log(`Usuario eligió: ${format} en ${platform}`);

            // Cerrar modal después del clic
            setTimeout(() => {
                closePurchaseModal();
            }, 500);
        }
    });

    console.log('Purchase Modal: Configurado correctamente');
});

// Funciones globales
window.openPurchaseModal = openPurchaseModal;
window.closePurchaseModal = closePurchaseModal;