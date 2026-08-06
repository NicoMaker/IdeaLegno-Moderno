// ---- estratto da JS/ui/modern-animations.js (originariamente un unico file) ----
// modern-animations/init.js — Avvio: richiama in ordine tutti i moduli del motore "modern"
"use strict";

function initModernAnimationsEngine() {
  initHeader();
  initFloatingButtons();
  initSectionDividers();

  if (reduceMotion || !("IntersectionObserver" in window)) {
    document.body.classList.add("hero-loaded");
    return;
  }

  initHero();
  initParallax();
  initPageTransitions();
  scanForTargets(document);
  watchDynamicContent();

  // Rete di sicurezza: dopo 4s mostra ciò che è visibile ma non rivelato
  setTimeout(function () {
    document
      .querySelectorAll("[data-reveal]:not(.reveal-in)")
      .forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) {
          el.classList.add("reveal-in");
        }
      });
  }, 4000);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initModernAnimationsEngine);
} else {
  initModernAnimationsEngine();
}
