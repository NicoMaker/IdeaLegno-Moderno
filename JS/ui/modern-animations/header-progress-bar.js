// ---- estratto da JS/ui/modern-animations.js (originariamente un unico file) ----
// modern-animations/header-progress-bar.js — Header che si compatta + barra di progresso lettura
"use strict";

function initHeader() {
  var header = document.querySelector(".site-header");
  var progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.appendChild(progress);

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY || document.documentElement.scrollTop;
      if (header) header.classList.toggle("is-scrolled", y > 24);
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      progress.style.transform =
        "scaleX(" + (max > 0 ? Math.min(y / max, 1) : 0) + ")";
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}
