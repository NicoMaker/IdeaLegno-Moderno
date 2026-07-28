/**
 * Slider.js - Sistema di navigazione per slideshow
 * Supporta: navigazione con frecce, tastiera, swipe mobile e pallini indicatori
 *
 * Ogni cambio di foto entra con una piccola animazione, nel verso in cui si
 * sta navigando: avanti la foto arriva da destra, indietro da sinistra.
 * Le classi CSS corrispondenti sono in CSS/project-gallery.css.
 */

let slideIndex = 1;

// ============================================================================
// INIZIALIZZAZIONE
// ============================================================================

document.addEventListener("DOMContentLoaded", function () {
  const slides = document.getElementsByClassName("slide");
  const dotsContainer = document.querySelector(".dots-container");
  const sliderContainer = document.querySelector(".slider-container");

  if (slides.length > 0) {
    // Crea i pallini indicatori per ogni slide
    if (dotsContainer) {
      createDots(slides.length, dotsContainer);
    }

    // Aggiungi navigazione da tastiera (frecce sinistra/destra)
    document.addEventListener("keydown", handleKeyboardNav);

    // Aggiungi navigazione tramite swipe per dispositivi touch
    if (sliderContainer) {
      addSwipeNavigation(sliderContainer);
    }

    // Mostra la prima slide all'avvio
    showSlides(slideIndex);
  }
});

// ============================================================================
// CREAZIONE PALLINI INDICATORI
// ============================================================================

function createDots(numSlides, container) {
  for (let i = 0; i < numSlides; i++) {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    dot.onclick = function () {
      currentSlide(i + 1);
    };
    container.appendChild(dot);
  }
}

// ============================================================================
// FUNZIONI DI NAVIGAZIONE
// ============================================================================

// Navigazione con frecce prev/next
const plusSlides = (n) => {
  const direction = n < 0 ? "prev" : "next";
  slideIndex += n;
  showSlides(slideIndex, direction);
};

// Navigazione diretta tramite pallini / miniature
const currentSlide = (n) => {
  const direction = n < slideIndex ? "prev" : n > slideIndex ? "next" : null;
  slideIndex = n;
  showSlides(slideIndex, direction);
};

// ============================================================================
// VISUALIZZAZIONE SLIDE
// ============================================================================

function showSlides(n, direction) {
  const slides = document.getElementsByClassName("slide");
  const dots = document.getElementsByClassName("dot");

  // Gestione loop ciclico: se supera il numero di slide, torna all'inizio
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }

  // Nascondi tutte le slide
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  // Rimuovi la classe 'active' da tutti i pallini
  for (let i = 0; i < dots.length; i++) {
    dots[i].classList.remove("active");
  }

  // Mostra la slide corrente e attiva il pallino corrispondente
  const current = slides[slideIndex - 1];
  current.style.display = "block";
  if (dots[slideIndex - 1]) dots[slideIndex - 1].classList.add("active");

  animateEntrance(current, direction);
}

// ============================================================================
// ANIMAZIONE DI ENTRATA DELLA FOTO
// ============================================================================

function animateEntrance(slide, direction) {
  if (!direction) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  slide.classList.remove("slide-in-next", "slide-in-prev");
  // Forza un reflow: senza, riaggiungere la stessa classe non fa ripartire
  // l'animazione quando si preme più volte la stessa freccia.
  void slide.offsetWidth;
  slide.classList.add(direction === "prev" ? "slide-in-prev" : "slide-in-next");
}

// ============================================================================
// NAVIGAZIONE DA TASTIERA
// ============================================================================

function handleKeyboardNav(e) {
  if (e.key === "ArrowLeft") {
    plusSlides(-1); // Freccia sinistra: vai alla slide precedente
  } else if (e.key === "ArrowRight") {
    plusSlides(1); // Freccia destra: vai alla slide successiva
  }
}

// ============================================================================
// NAVIGAZIONE SWIPE (Touch)
// ============================================================================

function addSwipeNavigation(element) {
  let touchstartX = 0;
  let touchendX = 0;
  const swipeThreshold = 50; // Distanza minima in pixel per considerare uno swipe valido

  // Registra la posizione iniziale del touch
  element.addEventListener(
    "touchstart",
    function (event) {
      touchstartX = event.changedTouches[0].screenX;
    },
    { passive: true },
  );

  // Registra la posizione finale del touch e gestisci lo swipe
  element.addEventListener("touchend", function (event) {
    touchendX = event.changedTouches[0].screenX;
    handleSwipe();
  });

  // Determina la direzione dello swipe ed esegui l'azione corrispondente
  function handleSwipe() {
    const swipeDistance = touchendX - touchstartX;

    // Ignora movimenti troppo piccoli
    if (Math.abs(swipeDistance) < swipeThreshold) {
      return;
    }

    if (touchendX < touchstartX) {
      // Swipe verso sinistra: vai alla slide successiva
      plusSlides(1);
    } else if (touchendX > touchstartX) {
      // Swipe verso destra: vai alla slide precedente
      plusSlides(-1);
    }
  }
}
