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
// • Cursore personalizzato (solo desktop, rispetta reduced-motion)
// ─────────────────────────────────────────────────────────────
(function () {
  "use strict";

  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  // ── 1. Titolo hero: split in lettere ──
  function initLetterTitle() {
    var title = document.querySelector(".hero-title");
    if (!title || title.classList.contains("is-split")) return;

    var text = title.textContent;
    title.setAttribute("aria-label", text);
    title.textContent = "";

    var idx = 0;
    text.split("").forEach(function (ch) {
      if (ch === " ") {
        title.appendChild(document.createTextNode(" "));
        return;
      }
      var span = document.createElement("span");
      span.className = "ht-letter";
      span.setAttribute("aria-hidden", "true");
      span.textContent = ch;
      span.style.setProperty("--li", String(idx));
      title.appendChild(span);
      idx++;
    });

    title.classList.add("is-split");
  }

  // ── 2. Typewriter nella hero ──
  function initTypewriter() {
    var subtitle = document.querySelector(".hero-subtitle");
    if (!subtitle || document.querySelector(".hero-rotator")) return;

    var words = ["per la tua casa", "per il tuo negozio", "per il tuo yacht"];
    var rotator = document.createElement("p");
    rotator.className = "hero-rotator";
    rotator.innerHTML =
      'Progetti unici <span class="hr-word"></span><span class="caret"></span>';
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

  // ── 3. Tilt 3D delegato sulle card ──
  function initTilt() {
    if (!finePointer) return;
    var MAX = 7; // gradi massimi

    document.addEventListener(
      "pointermove",
      function (e) {
        var card = e.target.closest ? e.target.closest(".Progetti-card") : null;

        // resetta le card non più sotto il cursore
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
    // i pulsanti flottanti vengono creati da modern-animations.js
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
        y: fromBottom
          ? canvas.height + 10
          : Math.random() * canvas.height,
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

    // anima solo quando la hero è visibile
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

  // ── 7. Contatori animati ──
  function initCounters() {
    var strip = document.querySelector(".stats-strip");
    if (!strip) return;

    function animateValue(el) {
      var target = parseInt(el.getAttribute("data-count"), 10);
      if (isNaN(target)) return;
      var prefix = el.getAttribute("data-prefix") || "";
      var suffix = el.getAttribute("data-suffix") || "";
      var duration = 1600;
      var start = null;

      function frame(ts) {
        if (!start) start = ts;
        var t = Math.min((ts - start) / duration, 1);
        // ease-out cubico
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

    new IntersectionObserver(
      function (entries, obs) {
        if (!entries[0].isIntersecting) return;
        strip.classList.add("stats-in");
        strip.querySelectorAll("[data-count]").forEach(animateValue);
        obs.disconnect();
      },
      { threshold: 0.35 },
    ).observe(strip);
  }

  // ── 8. Cursore personalizzato ──
  function initCursor() {
    if (!finePointer) return;

    var dot = document.createElement("div");
    dot.className = "cursor-dot";
    var ring = document.createElement("div");
    ring.className = "cursor-ring";
    dot.setAttribute("aria-hidden", "true");
    ring.setAttribute("aria-hidden", "true");
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    var mx = -100;
    var my = -100;
    var rx = -100;
    var ry = -100;

    document.addEventListener(
      "pointermove",
      function (e) {
        mx = e.clientX;
        my = e.clientY;
        dot.style.transform =
          "translate(" + mx + "px," + my + "px) translate(-50%,-50%)";

        var interactive = e.target.closest
          ? e.target.closest(
              "a, button, .Progetti-card, input, .dot, .prev, .next",
            )
          : null;
        ring.classList.toggle("is-hovering", !!interactive);
      },
      { passive: true },
    );

    function follow() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform =
        "translate(" +
        rx.toFixed(1) +
        "px," +
        ry.toFixed(1) +
        "px) translate(-50%,-50%)";
      requestAnimationFrame(follow);
    }
    requestAnimationFrame(follow);
  }

  // ── Avvio ──
  function init() {
    if (reduceMotion) return; // il CSS mostra già tutto senza animazioni

    initLetterTitle();
    initTypewriter();
    initTilt();
    initMagnetic();
    initRipple();
    initParticles();
    initCounters();
    initCursor();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
