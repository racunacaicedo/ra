const checkbox = document.getElementById("checkbox")
checkbox.addEventListener("change", () => {
  document.body.classList.toggle("dark")
})


// Obtener el elemento del encabezado y el tamaño de fuente inicial
const aniContainer = document.querySelector('.ani-container');
const aniText = document.querySelector('.ani');
const initialFontSize = parseInt(getComputedStyle(aniText).fontSize);

// Detectar el desplazamiento de la página
window.addEventListener('scroll', () => {
    if (window.scrollY > 0) {
        aniContainer.classList.add('fixed');
        const scrollProgress = window.scrollY / window.innerHeight;
        const newFontSize = initialFontSize - scrollProgress * 10; // Reducción gradual del tamaño
        aniText.style.fontSize = `${newFontSize}px`;
    } else {
        aniContainer.classList.remove('fixed');
        aniText.style.fontSize = `${initialFontSize}px`;
    }
});

// expansion
const expandIcons = document.querySelectorAll('.expand-icon');

expandIcons.forEach(icon => {
    icon.addEventListener('click', () => {
        const additionalContent = icon.parentElement.nextElementSibling;
        additionalContent.classList.toggle('active');
        icon.classList.toggle('active');
    });
});


const dateIcon = document.querySelector('.date-icon');
const socialSection = document.querySelector('.social-section');

let isOpen = false;

dateIcon.addEventListener('click', () => {
    isOpen = !isOpen;
    socialSection.classList.toggle('open', isOpen);
});

function mostrarOcultarMenu() {
    const menu = document.getElementById('nav');
    
    if (menu.style.display === 'block') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'block';
    }
}

// JavaScript para hacer que el contenedor sea estático al desplazar la página
window.addEventListener("scroll", function () {
    const containerFigure = document.querySelector(".container figure");
    if (window.scrollY > 100) {
        containerFigure.classList.add("static");
    } else {
        containerFigure.classList.remove("static");
    }
});


//fotos
// JavaScript para abrir y cerrar el lightbox
// JavaScript para mostrar el lightbox al hacer clic en una miniatura
const thumbnails = document.querySelectorAll('.thumbnail');
const lightbox = document.querySelector('.lightbox');
const lightboxImage = document.querySelector('#lightbox-image');

thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', () => {
        lightboxImage.src = thumbnail.querySelector('img').src;
        lightbox.style.display = 'block';
    });
});

lightbox.addEventListener('click', () => {
    lightbox.style.display = 'none';
});





