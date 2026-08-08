// ---- estratto da JS/product/slider.js (righe 111-125) ----
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
