// ---- estratto da JS/ui/extra-animations.js (originariamente un unico file) ----
// extra-animations/state.js — Dati e stato condivisi dal motore "extra"
// Nota: reduceMotion NON viene ridichiarata qui — è già definita globalmente
// da JS/ui/modern-animations/state.js, caricato sempre prima in ogni pagina.
"use strict";

var finePointer = window.matchMedia("(pointer: fine)").matches;

// ── Variabili globali per i dati dal JSON ──
let progettiCount = null;
let categorieCount = null;
let categorieList = []; // per generare l'etichetta
