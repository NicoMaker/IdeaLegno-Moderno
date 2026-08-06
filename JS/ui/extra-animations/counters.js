// ---- estratto da JS/ui/extra-animations.js (originariamente un unico file) ----
// extra-animations/counters.js — Contatori animati nella sezione Storia
"use strict";

// ── Calcola il valore finale di un contatore ──
function getAnnoFondazione() {
  try {
    if (typeof AppConfig !== "undefined" && AppConfig.azienda) {
      var a = parseInt(AppConfig.azienda.annoFondazione, 10);
      if (!isNaN(a)) return a;
    }
  } catch (e) {
    /* config non disponibile */
  }
  return null;
}

function resolveCounterTarget(el) {
  var source = el.getAttribute("data-source");
  if (source === "progetti") {
    return progettiCount !== null ? progettiCount : null;
  }
  if (source === "categorie") {
    return categorieCount !== null ? categorieCount : null;
  }
  if (el.hasAttribute("data-since")) {
    var raw = el.getAttribute("data-since");
    var since = parseInt(raw, 10);
    if (isNaN(since)) since = getAnnoFondazione();
    if (since !== null && !isNaN(since)) {
      return Math.max(0, new Date().getFullYear() - since);
    }
  }
  return parseInt(el.getAttribute("data-count"), 10);
}

// Imposta il valore finale (senza animazione) su un elemento
function setCounterFinal(el) {
  var target = resolveCounterTarget(el);
  if (target === null || isNaN(target)) return;
  var prefix = el.getAttribute("data-prefix") || "";
  var suffix = el.getAttribute("data-suffix") || "";
  el.textContent = prefix + target + suffix;
}

// ── Aggiorna il contatore dei progetti ──
function updateProgettiCounter() {
  var el = document.querySelector('.stat-value[data-source="progetti"]');
  if (!el) return;
  var target = progettiCount;
  if (target === null || isNaN(target)) {
    el.textContent = "...";
    return;
  }
  var prefix = el.getAttribute("data-prefix") || "";
  var suffix = el.getAttribute("data-suffix") || "";
  el.textContent = prefix + target + suffix;
  // Effetto flash opzionale
  el.style.transition = "color 0.15s";
  el.style.color = "#d4a373";
  setTimeout(() => {
    el.style.color = "";
  }, 300);
}

// ── Aggiorna il contatore delle categorie ──
function updateCategorieCounter() {
  var el = document.querySelector('.stat-value[data-source="categorie"]');
  if (!el) return;
  var target = categorieCount;
  if (target === null || isNaN(target)) {
    el.textContent = "...";
    return;
  }
  var prefix = el.getAttribute("data-prefix") || "";
  var suffix = el.getAttribute("data-suffix") || "";
  el.textContent = prefix + target + suffix;
  el.style.transition = "color 0.15s";
  el.style.color = "#d4a373";
  setTimeout(() => {
    el.style.color = "";
  }, 300);
}

// ── NUOVA: Aggiorna l'etichetta dei settori ──
function updateCategorieLabel() {
  var labelEl = document.getElementById("categorie-label");
  if (!labelEl) return;

  if (!categorieList || categorieList.length === 0) {
    labelEl.textContent = "Settori: nessuno";
    return;
  }

  // Formatta i nomi delle categorie con la prima lettera maiuscola
  var formatted = categorieList.map(function (cat) {
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  });

  // Unisci con virgola, e se più di due, usa " e " per l'ultimo (opzionale)
  var text;
  if (formatted.length === 1) {
    text = "Settore: " + formatted[0];
  } else if (formatted.length === 2) {
    text = "Settori: " + formatted[0] + " e " + formatted[1];
  } else {
    // più di due: lista con virgole, ultimo con " e "
    var last = formatted.pop();
    text = "Settori: " + formatted.join(", ") + " e " + last;
  }
  labelEl.textContent = text;
}

// ── Riallinea gli "anni di attività" ogni notte alle 00:00 ──
function scheduleMidnightRefresh() {
  var now = new Date();
  var next = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    1,
  );
  setTimeout(function () {
    var nodes = document.querySelectorAll(".stats-strip [data-since]");
    for (var i = 0; i < nodes.length; i++) setCounterFinal(nodes[i]);
    scheduleMidnightRefresh();
  }, next - now);
}

// ── Contatori animati ──
function initCounters() {
  var strip = document.querySelector(".stats-strip");
  if (!strip) return;

  function isDynamicSource(el) {
    var src = el.getAttribute("data-source");
    return src === "progetti" || src === "categorie";
  }

  function animateValue(el) {
    var target = resolveCounterTarget(el);
    if (target === null || isNaN(target)) return;
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1600;
    var start = null;

    function frame(ts) {
      if (!start) start = ts;
      var t = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(frame);
    }

    if (reduceMotion) {
      el.textContent = prefix + target + suffix;
    } else {
      requestAnimationFrame(frame);
    }
  }

  // Osserva lo strip per avviare le animazioni su tutti i contatori
  new IntersectionObserver(
    function (entries, obs) {
      if (!entries[0].isIntersecting) return;
      strip.classList.add("stats-in");

      var allCounters = strip.querySelectorAll(
        "[data-count], [data-since], [data-source]",
      );
      allCounters.forEach(function (el) {
        if (isDynamicSource(el)) {
          var src = el.getAttribute("data-source");
          var val = src === "progetti" ? progettiCount : categorieCount;
          if (val !== null && !isNaN(val)) {
            animateValue(el);
          } else {
            if (!el.textContent || el.textContent === "0") {
              el.textContent = "...";
            }
          }
        } else {
          animateValue(el);
        }
      });

      obs.disconnect();
    },
    { threshold: 0.35 },
  ).observe(strip);
}
