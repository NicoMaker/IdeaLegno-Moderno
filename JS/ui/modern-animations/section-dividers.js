// ---- estratto da JS/ui/modern-animations.js (originariamente un unico file) ----
// modern-animations/section-dividers.js — Separatori artigianali tra le sezioni della home
"use strict";

function initSectionDividers() {
  var sections = document.querySelectorAll(
    "section.about-section, section.products-section",
  );
  sections.forEach(function (sec) {
    var prev = sec.previousElementSibling;
    if (!prev) return;
    // niente separatore tra la hero e la sezione Storia
    if (prev.classList.contains("hero-section")) return;
    if (prev.classList.contains("section-divider")) return;
    var div = document.createElement("div");
    div.className = "section-divider";
    div.setAttribute("aria-hidden", "true");
    div.innerHTML = "<span></span>";
    sec.parentNode.insertBefore(div, sec);
  });
}
