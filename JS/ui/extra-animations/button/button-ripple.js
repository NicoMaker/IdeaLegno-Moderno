// ---- estratto da JS/ui/extra-animations.js (originariamente un unico file) ----
// extra-animations/button-ripple.js — Effetto ripple al click su tutti i bottoni
"use strict";

function initRipple() {
  document.addEventListener("click", function (e) {
    var btn = e.target.closest
      ? e.target.closest(
          ".cta-button, .filter-button, .more-info-btn, .back-button",
        )
      : null;
    if (!btn) return;

    var r = btn.getBoundingClientRect();
    var size = Math.max(r.width, r.height) * 2.2;
    var ink = document.createElement("span");
    ink.className = "ripple-ink";
    ink.style.width = ink.style.height = size + "px";
    ink.style.left = e.clientX - r.left - size / 2 + "px";
    ink.style.top = e.clientY - r.top - size / 2 + "px";
    btn.appendChild(ink);
    setTimeout(function () {
      if (ink.parentNode) ink.parentNode.removeChild(ink);
    }, 700);
  });
}
