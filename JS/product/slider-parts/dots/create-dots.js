// ---- estratto da JS/product/slider.js (righe 44-59) ----
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
