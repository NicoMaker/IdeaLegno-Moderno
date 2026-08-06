// ---- estratto da JS/ui/extra-animations.js (originariamente un unico file) ----
// extra-animations/card-tilt.js — Tilt 3D delegato sulle card progetto
"use strict";

function initTilt() {
  if (!finePointer) return;
  var MAX = 7;

  document.addEventListener(
    "pointermove",
    function (e) {
      var card = e.target.closest ? e.target.closest(".Progetti-card") : null;

      document
        .querySelectorAll(".Progetti-card.is-tilting")
        .forEach(function (c) {
          if (c !== card) resetCard(c);
        });

      if (!card) return;

      if (!card.querySelector(".tilt-glare")) {
        var glare = document.createElement("div");
        glare.className = "tilt-glare";
        card.appendChild(glare);
      }

      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width;
      var py = (e.clientY - r.top) / r.height;
      var rotY = (px - 0.5) * 2 * MAX;
      var rotX = (0.5 - py) * 2 * MAX;

      card.classList.add("is-tilting");
      card.style.transform =
        "perspective(1200px) rotateX(" +
        rotX.toFixed(2) +
        "deg) rotateY(" +
        rotY.toFixed(2) +
        "deg) translateY(-6px)";
      card.style.setProperty("--gx", (px * 100).toFixed(1) + "%");
      card.style.setProperty("--gy", (py * 100).toFixed(1) + "%");
    },
    { passive: true },
  );

  function resetCard(card) {
    card.classList.remove("is-tilting");
    card.style.transform = "";
  }

  document.addEventListener(
    "pointerout",
    function (e) {
      var card = e.target.closest ? e.target.closest(".Progetti-card") : null;
      if (card && !card.contains(e.relatedTarget)) resetCard(card);
    },
    { passive: true },
  );
}
