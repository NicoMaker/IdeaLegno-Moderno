// ---- estratto da JS/product/slider.js (righe 1-43) ----
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

