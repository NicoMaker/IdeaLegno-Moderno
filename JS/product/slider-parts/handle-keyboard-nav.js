// ---- estratto da JS/product/slider.js (righe 126-137) ----
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

