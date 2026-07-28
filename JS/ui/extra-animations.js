// ─────────────────────────────────────────────────────────────
// extra-animations.js — IdeaLegno
// Secondo motore di animazioni, caricato dopo modern-animations.js:
// • Titolo hero lettera per lettera
// • Typewriter "casa / negozio / yacht" nella hero
// • Tilt 3D con riflesso sulle card progetto (delegato, funziona
//   anche sulle card generate dinamicamente dal JSON)
// • Bottoni magnetici che seguono il cursore
// • Effetto ripple al click su tutti i bottoni
// • Particelle di segatura dorata nella hero (canvas leggero)
// • Contatori animati nella sezione Storia
// (Testi del typewriter hero caricati da JSON/hero.json)
// ─────────────────────────────────────────────────────────────
(function () {
  "use strict";

  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  // ── Variabili globali per i dati dal JSON ──
  let progettiCount = null;
  let categorieCount = null;
  let categorieList = []; // per generare l'etichetta

  // ── 1. Titolo hero: split in lettere ──
  function initLetterTitle() {
    var title = document.querySelector(".hero-title");
    if (!title || title.classList.contains("is-split")) return;

    var text = title.textContent;
    title.setAttribute("aria-label", text);
    title.textContent = "";

    var idx = 0;
    var words = text.split(" ");
    words.forEach(function (word, wIdx) {
      var wordSpan = document.createElement("span");
      wordSpan.className = "ht-word";

      word.split("").forEach(function (ch) {
        var span = document.createElement("span");
        span.className = "ht-letter";
        span.setAttribute("aria-hidden", "true");
        span.textContent = ch;
        span.style.setProperty("--li", String(idx));
        wordSpan.appendChild(span);
        idx++;
      });

      title.appendChild(wordSpan);
      if (wIdx < words.length - 1) {
        title.appendChild(document.createTextNode(" "));
      }
    });

    title.classList.add("is-split");
  }

  // ── 2. Typewriter nella hero (testi da JSON/hero.json) ──
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

  // ── 3. Tilt 3D delegato sulle card ──
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

  // ── 4. Bottoni magnetici ──
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

  // ── 5. Ripple al click ──
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

  // ── 6. Particelle di segatura nella hero ──
  function initParticles() {
    var hero = document.querySelector(".hero-section");
    if (!hero) return;

    var canvas = document.createElement("canvas");
    canvas.className = "hero-particles";
    canvas.setAttribute("aria-hidden", "true");
    hero.appendChild(canvas);

    var ctx = canvas.getContext("2d");
    var particles = [];
    var running = false;
    var COUNT = Math.min(46, Math.floor(window.innerWidth / 28));

    function resize() {
      canvas.width = hero.clientWidth;
      canvas.height = hero.clientHeight;
    }

    function makeParticle(fromBottom) {
      return {
        x: Math.random() * canvas.width,
        y: fromBottom ? canvas.height + 10 : Math.random() * canvas.height,
        r: 0.8 + Math.random() * 2.2,
        vy: 0.15 + Math.random() * 0.45,
        drift: (Math.random() - 0.5) * 0.35,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.15 + Math.random() * 0.4,
      };
    }

    function step() {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.phase += 0.012;
        p.y -= p.vy;
        p.x += p.drift + Math.sin(p.phase) * 0.25;
        if (p.y < -10 || p.x < -10 || p.x > canvas.width + 10) {
          particles[i] = makeParticle(true);
          continue;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(232, 205, 160," + p.alpha.toFixed(2) + ")";
        ctx.fill();
      }
      requestAnimationFrame(step);
    }

    resize();
    for (var i = 0; i < COUNT; i++) particles.push(makeParticle(false));

    window.addEventListener("resize", resize, { passive: true });

    new IntersectionObserver(
      function (entries) {
        var visible = entries[0].isIntersecting;
        if (visible && !running) {
          running = true;
          requestAnimationFrame(step);
        } else if (!visible) {
          running = false;
        }
      },
      { threshold: 0.05 },
    ).observe(hero);
  }

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

  // ── 7. Contatori animati ──
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

  // ── Ascolta l'evento di caricamento dei progetti ──
  function setupProgettiListener() {
    document.addEventListener("prodottiCaricati", function (e) {
      var prodotti = e.detail.prodotti;
      progettiCount = prodotti.length;

      // Calcola le categorie uniche
      var categorieSet = new Set();
      prodotti.forEach(function (p) {
        if (p.categorie && Array.isArray(p.categorie)) {
          p.categorie.forEach(function (cat) {
            if (cat) categorieSet.add(cat);
          });
        }
      });
      categorieCount = categorieSet.size;
      categorieList = Array.from(categorieSet).sort(); // ordine alfabetico

      // Aggiorna contatori e etichetta
      updateProgettiCounter();
      updateCategorieCounter();
      updateCategorieLabel(); // <--- NUOVA CHIAMATA

      // Se lo strip è già visibile (stats-in), avvia animazione per i contatori in attesa
      var strip = document.querySelector(".stats-strip");
      if (strip && strip.classList.contains("stats-in")) {
        var dynamicEls = strip.querySelectorAll(
          '.stat-value[data-source="progetti"], .stat-value[data-source="categorie"]',
        );
        dynamicEls.forEach(function (el) {
          if (el.textContent === "...") {
            animateValue(el);
          }
        });
      }
    });

    // Gestione errore: mostra 0 e label vuota
    document.addEventListener("prodottiErrore", function () {
      progettiCount = 0;
      categorieCount = 0;
      categorieList = [];
      updateProgettiCounter();
      updateCategorieCounter();
      var labelEl = document.getElementById("categorie-label");
      if (labelEl) labelEl.textContent = "Settori: nessuno";
    });
  }

  // ── Avvio ──
  function init() {
    if (typeof initHeader === "function") initHeader();
    if (typeof initFloatingButtons === "function") initFloatingButtons();
    if (typeof initSectionDividers === "function") initSectionDividers();

    if (reduceMotion || !("IntersectionObserver" in window)) {
      document.body.classList.add("hero-loaded");
      document
        .querySelectorAll(".stat-value[data-source]")
        .forEach(setCounterFinal);
      // In caso di riduzione movimento, proviamo comunque a impostare l'etichetta
      // se i dati sono già stati caricati? In realtà qui i dati potrebbero non essere ancora arrivati,
      // ma se il caricamento è già avvenuto, updateCategorieLabel verrà chiamato dal listener.
      // Quindi va bene così.
      return;
    }

    if (typeof initHero === "function") initHero();
    if (typeof initParallax === "function") initParallax();
    if (typeof initPageTransitions === "function") initPageTransitions();

    initLetterTitle();
    initTypewriter();
    initTilt();
    initMagnetic();
    initRipple();
    initParticles();
    initCounters();
    scheduleMidnightRefresh();

    setupProgettiListener();

    setTimeout(function () {
      document
        .querySelectorAll("[data-reveal]:not(.reveal-in)")
        .forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.top < window.innerHeight && r.bottom > 0) {
            el.classList.add("reveal-in");
          }
        });
    }, 4000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
