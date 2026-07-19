// ─────────────────────────────────────────────────────────────
// gallery-enhance.js — IdeaLegno
// Sincronizza le miniature con lo slider delle pagine progetto:
// • click su una miniatura → mostra quella slide
// • cambiando slide (frecce, tastiera, swipe, pallini) → la
//   miniatura attiva si aggiorna e resta visibile nello scroll
// Dipende da: JS/product/slider.js (funzioni globali showSlides,
// currentSlide, slideIndex)
// ─────────────────────────────────────────────────────────────
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var thumbsBox = document.querySelector(".gallery-thumbs");
    if (!thumbsBox) return;

    var thumbs = Array.prototype.slice.call(
      thumbsBox.querySelectorAll(".gallery-thumb"),
    );
    if (!thumbs.length) return;

    // Con poche miniature, centrale; nascondi tutto se c'è una sola foto
    if (thumbs.length === 1) {
      thumbsBox.style.display = "none";
      return;
    }
    if (thumbs.length <= 6) thumbsBox.classList.add("few");

    function syncActive() {
      var slides = document.getElementsByClassName("slide");
      var current = 0;
      for (var i = 0; i < slides.length; i++) {
        if (slides[i].style.display !== "none") {
          current = i;
          break;
        }
      }
      thumbs.forEach(function (t, i) {
        var active = i === current;
        t.classList.toggle("active", active);
        if (active && t.scrollIntoView) {
          t.scrollIntoView({
            block: "nearest",
            inline: "nearest",
            behavior: "smooth",
          });
        }
      });
    }

    // Avvolgi showSlides (script classico: il binding globale è condiviso)
    if (typeof window.showSlides === "function") {
      var orig = window.showSlides;
      window.showSlides = function (n) {
        orig(n);
        syncActive();
      };
    }

    thumbs.forEach(function (t, i) {
      t.addEventListener("click", function () {
        if (typeof window.currentSlide === "function") {
          window.currentSlide(i + 1);
        }
      });
    });

    // Stato iniziale (slider già avviato dal suo DOMContentLoaded)
    setTimeout(syncActive, 60);
  });
})();
