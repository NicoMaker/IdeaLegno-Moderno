// ---- estratto da JS/ui/extra-animations.js (originariamente un unico file) ----
// extra-animations/hero-typewriter.js — Typewriter nella hero (testi da JSON/hero.json)
"use strict";

var HERO_TEXT_FALLBACK = {
  prefix: "Progetti unici",
  parole: ["per la tua casa", "per il tuo negozio", "per il tuo yacht"],
};

/* Traduzione inglese scritta a mano (non affidata a Google Translate):
   così l'animazione "macchina da scrivere" può girare anche in inglese
   senza che il testo, che cambia in continuazione via JS, venga corrotto
   dal traduttore automatico. */
var HERO_TEXT_EN = {
  prefix: "Unique projects",
  parole: ["for your home", "for your store", "for your yacht"],
};

function buildTypewriter(cfg) {
  var subtitle = document.querySelector(".hero-subtitle");
  if (!subtitle || document.querySelector(".hero-rotator")) return;

  var isEnglish =
    window.IdeaLegnoI18n && window.IdeaLegnoI18n.getLang() === "en";

  /* In inglese usiamo il testo tradotto a mano (corretto e leggibile),
     non quello italiano proveniente dal JSON: l'animazione sovrascrive il
     testo di continuo, quindi Google Translate non riuscirebbe comunque a
     tenerlo tradotto in tempo reale. */
  var prefix = isEnglish
    ? HERO_TEXT_EN.prefix
    : (cfg && cfg.prefix) || HERO_TEXT_FALLBACK.prefix;
  var words = isEnglish
    ? HERO_TEXT_EN.parole
    : cfg && Array.isArray(cfg.parole) && cfg.parole.length
      ? cfg.parole
      : HERO_TEXT_FALLBACK.parole;

  var rotator = document.createElement("p");
  rotator.className = "hero-rotator notranslate";
  rotator.setAttribute("translate", "no");
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
