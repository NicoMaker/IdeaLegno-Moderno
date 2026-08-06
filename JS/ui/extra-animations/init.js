// ---- estratto da JS/ui/extra-animations.js (originariamente un unico file) ----
// extra-animations/init.js — Avvio: richiama in ordine tutti i moduli del motore "extra"
//
// Nota: nel file originale init() iniziava con chiamate difensive del tipo
// `if (typeof initHeader === "function") initHeader();` verso funzioni di
// modern-animations.js. Dato che i due motori erano due IIFE separate,
// quelle funzioni non erano MAI visibili da qui: erano righe morte, non
// venivano mai eseguite (modern-animations.js chiama già da sé initHeader,
// initFloatingButtons, initSectionDividers, initHero, initParallax e
// initPageTransitions nel proprio init). Le ho rimosse qui perché, ora che
// tutti i moduli condividono lo stesso scope globale, lasciarle avrebbe
// fatto eseguire quelle funzioni una seconda volta (doppio bottone
// WhatsApp/telefono, doppia barra di progresso, ecc.) — un comportamento
// diverso da quello originale, non un semplice riordino di file.
"use strict";

function initExtraAnimationsEngine() {
  if (reduceMotion || !("IntersectionObserver" in window)) {
    document.body.classList.add("hero-loaded");
    // Anche senza animazioni i numeri devono arrivare: il listener va
    // registrato comunque, altrimenti progetti e settori restano a 0.
    setupProgettiListener();
    // Tutti i contatori, non solo quelli dinamici: senza animazione vanno
    // comunque scritti i valori finali (anni di attività, 100% su misura…).
    document
      .querySelectorAll(
        ".stats-strip [data-count], .stats-strip [data-since], .stats-strip [data-source]",
      )
      .forEach(setCounterFinal);
    return;
  }

  initLetterTitle();
  initTypewriter();
  initTilt();
  initMagnetic();
  initRipple();
  initParticles();
  initCounters();
  scheduleMidnightRefresh();

  setupProgettiListener();

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
  document.addEventListener("DOMContentLoaded", initExtraAnimationsEngine);
} else {
  initExtraAnimationsEngine();
}
