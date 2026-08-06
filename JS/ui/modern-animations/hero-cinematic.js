// ---- estratto da JS/ui/modern-animations.js (originariamente un unico file) ----
// modern-animations/hero-cinematic.js — Hero con entrata orchestrata e zoom cinematografico
"use strict";

function initHero() {
  if (!document.querySelector(".hero-section")) return;
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      document.body.classList.add("hero-loaded");
    });
  });
}
