// ---- estratto da JS/product/slider.js (righe 67-76) ----
const currentSlide = (n) => {
  const direction = n < slideIndex ? "prev" : n > slideIndex ? "next" : null;
  slideIndex = n;
  showSlides(slideIndex, direction);
};

// ============================================================================
// VISUALIZZAZIONE SLIDE
// ============================================================================
