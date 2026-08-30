// ---- estratto da JS/ui/extra-animations.js (originariamente un unico file) ----
// extra-animations/hero-typewriter.js — Typewriter nella hero (testi da JSON/hero.json)
"use strict";

var HERO_TEXT_FALLBACK = {
  prefix: "Progetti unici",
  parole: ["per la tua casa", "per il tuo negozio", "per il tuo yacht"],
};

function buildTypewriter(cfg) {
  var subtitle = document.querySelector(".hero-subtitle");
  if (!subtitle || document.querySelector(".hero-rotator")) return;

  var prefix = (cfg && cfg.prefix) || HERO_TEXT_FALLBACK.prefix;
  var words =
    cfg && Array.isArray(cfg.parole) && cfg.parole.length
      ? cfg.parole
      : HERO_TEXT_FALLBACK.parole;

  var rotator = document.createElement("p");
  rotator.className = "hero-rotator";

  /* Se la pagina è tradotta (lingua diversa dall'italiano) evitiamo di far
     scrivere/cancellare il testo lettera per lettera in loop: quel testo
     cambia in continuazione via JavaScript e Google Translate non riesce a
     tenerlo tradotto (ogni "tick" lo sovrascrive con l'italiano originale).
     Mostriamo quindi tutte le frasi già scritte per intero, così restano
     correttamente tradotte da Google. */
  if (window.IdeaLegnoI18n && window.IdeaLegnoI18n.getLang() !== "it") {
    rotator.textContent = prefix + " " + words.join(" · ");
    subtitle.parentNode.insertBefore(rotator, subtitle.nextSibling);
    return;
  }

  rotator.innerHTML =
    prefix + ' <span class="hr-word"></span><span class="caret"></span>';
  subtitle.parentNode.insertBefore(rotator, subtitle.nextSibling);

  var wordEl = rotator.querySelector(".hr-word");
  var wi = 0;
  var ci = 0;
  var deleting = false;

  function tick() {
    var word = words[wi];
    if (!deleting) {
      ci++;
      wordEl.textContent = word.slice(0, ci);
      if (ci === word.length) {
        deleting = true;
        setTimeout(tick, 1800);
        return;
      }
      setTimeout(tick, 55 + Math.random() * 45);
    } else {
      ci--;
      wordEl.textContent = word.slice(0, ci);
      if (ci === 0) {
        deleting = false;
        wi = (wi + 1) % words.length;
        setTimeout(tick, 350);
        return;
      }
      setTimeout(tick, 30);
    }
  }

  setTimeout(tick, 1400);
}

function initTypewriter() {
  if (!document.querySelector(".hero-subtitle")) return;

  if (typeof JsonData !== "undefined" && JsonData && JsonData.load) {
    JsonData.load("hero")
      .then(function (data) {
        buildTypewriter(data && data.rotator ? data.rotator : null);
      })
      .catch(function () {
        buildTypewriter(null);
      });
  } else {
    buildTypewriter(null);
  }
}
