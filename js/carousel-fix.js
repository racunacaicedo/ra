// CORRECIÓN INMEDIATA DEL CARRUSEL
// Agregar este código al final del archivo script.js o en un script separado

// 1. FUNCIÓN DE DEBUG INMEDIATO
function debugCarouselImmediate() {
    console.log('🔍 DEBUGGING CARRUSEL INMEDIATO');

    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');

    console.log('Total slides encontrados:', slides.length);
    console.log('Total dots encontrados:', dots.length);

    slides.forEach((slide, index) => {
        console.log(`Slide ${index}:`, {
            hasActiveClass: slide.classList.contains('active'),
            opacity: getComputedStyle(slide).opacity,
            display: getComputedStyle(slide).display,
            zIndex: getComputedStyle(slide).zIndex
        });
    });

    dots.forEach((dot, index) => {
        console.log(`Dot ${index}:`, {
            hasActiveClass: dot.classList.contains('active')
        });
    });
}

// 2. FUNCIÓN DE REPARACIÓN FORZADA
function forceFixCarousel() {
    console.log('🔧 REPARANDO CARRUSEL FORZADAMENTE...');

    // Detener cualquier auto-slider existente
    if (window.HeroSlider && HeroSlider.slideInterval) {
        clearInterval(HeroSlider.slideInterval);
        HeroSlider.slideInterval = null;
    }

    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');

    if (slides.length === 0) {
        console.error('❌ No se encontraron slides');
        return;
    }

    // Resetear todos los slides
    slides.forEach((slide, index) => {
        slide.classList.remove('active');
        slide.style.opacity = '0';
        slide.style.position = 'absolute';
        slide.style.top = '0';
        slide.style.left = '0';
        slide.style.width = '100%';
        slide.style.height = '100%';
        slide.style.transition = 'opacity 1s ease-in-out';
        slide.style.zIndex = '1';
    });

    // Resetear todos los dots
    dots.forEach(dot => {
        dot.classList.remove('active');
    });

    // Activar el primer slide
    slides[0].classList.add('active');
    slides[0].style.opacity = '1';
    slides[0].style.zIndex = '2';

    if (dots.length > 0) {
        dots[0].classList.add('active');
    }

    console.log('✅ Carrusel reseteado - primer slide activo');

    // Iniciar auto-slider manual
    startManualAutoSlider();
}

// 3. AUTO-SLIDER MANUAL
let manualSliderInterval = null;
let currentSlideIndex = 0;

function startManualAutoSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');

    if (slides.length <= 1) return;

    // Limpiar intervalo existente
    if (manualSliderInterval) {
        clearInterval(manualSliderInterval);
    }

    manualSliderInterval = setInterval(() => {
        console.log('⏰ Auto-slider ejecutándose...');

        // Ocultar slide actual
        slides[currentSlideIndex].classList.remove('active');
        slides[currentSlideIndex].style.opacity = '0';
        slides[currentSlideIndex].style.zIndex = '1';

        if (dots[currentSlideIndex]) {
            dots[currentSlideIndex].classList.remove('active');
        }

        // Avanzar al siguiente slide
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;

        // Mostrar nuevo slide
        slides[currentSlideIndex].classList.add('active');
        slides[currentSlideIndex].style.opacity = '1';
        slides[currentSlideIndex].style.zIndex = '2';

        if (dots[currentSlideIndex]) {
            dots[currentSlideIndex].classList.add('active');
        }

        console.log(`✅ Cambiado a slide ${currentSlideIndex + 1}`);

    }, 6000); // Cambiar cada 6 segundos

    console.log('🚀 Auto-slider manual iniciado');
}

// 4. FUNCIÓN PARA CAMBIO MANUAL
function changeSlideManual(slideIndex) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');

    if (slideIndex < 0 || slideIndex >= slides.length) return;

    // Ocultar slide actual
    slides[currentSlideIndex].classList.remove('active');
    slides[currentSlideIndex].style.opacity = '0';
    slides[currentSlideIndex].style.zIndex = '1';

    if (dots[currentSlideIndex]) {
        dots[currentSlideIndex].classList.remove('active');
    }

    // Mostrar nuevo slide
    currentSlideIndex = slideIndex;
    slides[currentSlideIndex].classList.add('active');
    slides[currentSlideIndex].style.opacity = '1';
    slides[currentSlideIndex].style.zIndex = '2';

    if (dots[currentSlideIndex]) {
        dots[currentSlideIndex].classList.add('active');
    }

    console.log(`✅ Cambiado manualmente a slide ${currentSlideIndex + 1}`);
}

// 5. CONFIGURAR EVENT LISTENERS
function setupCarouselEvents() {
    // Botones de navegación
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const newIndex = currentSlideIndex - 1;
            changeSlideManual(newIndex < 0 ? document.querySelectorAll('.slide').length - 1 : newIndex);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const newIndex = currentSlideIndex + 1;
            changeSlideManual(newIndex >= document.querySelectorAll('.slide').length ? 0 : newIndex);
        });
    }

    // Dots
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            changeSlideManual(index);
        });
    });

    console.log('✅ Event listeners configurados');
}

// 6. INICIALIZACIÓN COMPLETA
function initializeCarouselFix() {
    console.log('🔧 INICIALIZANDO REPARACIÓN COMPLETA DEL CARRUSEL...');

    // Esperar a que el DOM esté completamente cargado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                debugCarouselImmediate();
                forceFixCarousel();
                setupCarouselEvents();
            }, 500);
        });
    } else {
        setTimeout(() => {
            debugCarouselImmediate();
            forceFixCarousel();
            setupCarouselEvents();
        }, 500);
    }
}

// 7. FUNCIONES GLOBALES PARA TESTING
window.debugCarouselImmediate = debugCarouselImmediate;
window.forceFixCarousel = forceFixCarousel;
window.changeSlideManual = changeSlideManual;
window.startManualAutoSlider = startManualAutoSlider;

// 8. EJECUTAR INMEDIATAMENTE
initializeCarouselFix();

// 9. BACKUP: Si nada funciona, ejecutar después de 2 segundos
setTimeout(() => {
    const slides = document.querySelectorAll('.slide');
    if (slides.length > 0 && !slides[0].classList.contains('active')) {
        console.log('🚨 BACKUP: Ejecutando reparación de emergencia');
        forceFixCarousel();
        setupCarouselEvents();
    }
}, 2000);