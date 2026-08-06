// ---- estratto da JS/ui/modern-animations.js (originariamente un unico file) ----
// modern-animations/page-transitions.js — Transizioni tra le pagine: dissolvenza leggera (nessun sipario)
"use strict";

function initPageTransitions() {
  document.addEventListener("click", function (e) {
    var link = e.target.closest ? e.target.closest("a") : null;
    if (!link) return;
    var href = link.getAttribute("href");
    if (!href) return;
    if (
      href.indexOf("#") === 0 ||
      href.indexOf("http") === 0 ||
      href.indexOf("tel:") === 0 ||
      href.indexOf("mailto:") === 0 ||
      link.target === "_blank" ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    )
      return;
    if (!/\.html(\?|#|$)/.test(href) && href.indexOf("/") === -1) return;

    e.preventDefault();
    document.body.classList.add("page-exit");
    setTimeout(function () {
      window.location.href = href;
    }, 280);
  });

  // tornando indietro dalla bfcache, ripristina la pagina visibile
  window.addEventListener("pageshow", function (e) {
    if (e.persisted) document.body.classList.remove("page-exit");
  });
}
