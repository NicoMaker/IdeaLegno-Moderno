// ---- estratto da JS/ui/extra-animations.js (originariamente un unico file) ----
// extra-animations/magnetic-buttons.js — Bottoni magnetici che seguono il cursore
"use strict";

function initMagnetic() {
  if (!finePointer) return;
  var STRENGTH = 0.28;
  var RANGE = 90;

  function attach(el) {
    if (el.hasAttribute("data-magnetic")) return;
    el.setAttribute("data-magnetic", "");

    el.addEventListener(
      "pointermove",
      function (e) {
        var r = el.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        var dist = Math.hypot(dx, dy);
        if (dist > RANGE) return;
        el.style.transform =
          "translate(" +
          (dx * STRENGTH).toFixed(1) +
          "px," +
          (dy * STRENGTH).toFixed(1) +
          "px)";
      },
      { passive: true },
    );

    el.addEventListener("pointerleave", function () {
      el.style.transition = "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)";
      el.style.transform = "";
      setTimeout(function () {
        el.style.transition = "";
      }, 460);
    });
  }

  function scan() {
    document
      .querySelectorAll(
        ".cta-button, .back-to-top, .quick-whatsapp, .quick-call",
      )
      .forEach(attach);
  }

  scan();
  setTimeout(scan, 800);
}
