// ---- estratto da JS/ui/modern-animations.js (originariamente un unico file) ----
// modern-animations/state.js — Dati e stato condivisi dal motore "modern"
// Usato da: floating-buttons.js, ovunque serva reduceMotion (anche da
// extra-animations, caricato dopo: la variabile resta accessibile perché
// tutti gli script classici del sito condividono lo stesso scope globale).
"use strict";

var PHONE = "+393356508231"; // da JSON/footer.json
var WA_TEXT =
  "Buongiorno! Vorrei informazioni sui vostri arredamenti su misura.";

var reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
