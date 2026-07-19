// ═══════════════════════════════════════════════════════════════════════════
// extra-animations.js — IdeaLegno (senza cursore personalizzato)
// Secondo layer di animazioni: tilt 3D, bottoni magnetici, particelle,
// contatori, badge, etc. Il cursore personalizzato è stato rimosso.
// ═══════════════════════════════════════════════════════════════════════════
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  // ── 1. Lettere del titolo hero ──
  function initLetterRise() {
    var title = document.querySelector(".hero-title");
    if (!title) return;
    // Se il titolo ha già la classe is-split, non rifare
    if (title.classList.contains("is-split")) return;

    var text = title.textContent.trim();
    title.textContent = "";
    var chars = text.split("");
    chars.forEach(function (ch, i) {
      var span = document.createElement("span");
      span.className = "ht-letter";
      span.textContent = ch === " " ? "\u00A0" : ch;
      span.style.setProperty("--li", i);
      title.appendChild(span);
    });
    title.classList.add("is-split");
  }

  // ── 2. Typewriter sotto il sottotitolo hero ──
  function initTypewriter() {
    var container = document.querySelector(".hero-rotator");
    if (!container) return;

    var texts = ["per la tua casa", "per il tuo negozio", "per il tuo yacht"];
    var current = 0;
    var idx = 0;
    var isDeleting = false;
    var speed = 80;

    function type() {
      var full = texts[current];
      if (!isDeleting && idx <= full.length) {
        container.innerHTML = full.substring(0, idx) + '<span class="caret"></span>';
        idx++;
        setTimeout(type, speed);
      } else if (isDeleting && idx >= 0) {
        container.innerHTML = full.substring(0, idx) + '<span class="caret"></span>';
        idx--;
        setTimeout(type, speed * 0.6);
      } else if (!isDeleting && idx > full.length) {
        isDeleting = true;
        setTimeout(type, 1400);
      } else if (isDeleting && idx < 0) {
        isDeleting = false;
        current = (current + 1) % texts.length;
        idx = 0;
        setTimeout(type, 300);
      }
    }
    setTimeout(type, 500);
  }

  // ── 3. Tilt 3D sulle card ──
  function initTilt() {
    var cards = document.querySelectorAll(".Progetti-card, .novita-card");
    cards.forEach(function (card) {
      var glare = document.createElement("div");
      glare.className = "tilt-glare";
      card.appendChild(glare);

      card.addEventListener("mouseenter", function () {
        card.classList.add("is-tilting");
      });
      card.addEventListener("mouseleave", function () {
        card.classList.remove("is-tilting");
        card.style.transform = "";
        glare.style.setProperty("--gx", "50%");
        glare.style.setProperty("--gy", "50%");
      });
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width;
        var y = (e.clientY - rect.top) / rect.height;
        var tiltX = (y - 0.5) * -12;
        var tiltY = (x - 0.5) * 12;
        card.style.transform =
          "perspective(800px) rotateX(" + tiltX + "deg) rotateY(" + tiltY + "deg) translateY(-6px)";
        glare.style.setProperty("--gx", (x * 100) + "%");
        glare.style.setProperty("--gy", (y * 100) + "%");
      });
    });
  }

  // ── 4. Effetto ripple sui bottoni ──
  function initRipple() {
    var buttons = document.querySelectorAll(
      ".cta-button, .filter-button, .more-info-btn, .back-button"
    );
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var ripple = document.createElement("span");
        ripple.className = "ripple-ink";
        var size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + "px";
        ripple.style.left = (x - size / 2) + "px";
        ripple.style.top = (y - size / 2) + "px";
        btn.appendChild(ripple);
        setTimeout(function () { ripple.remove(); }, 650);
      });
    });
  }

  // ── 5. Bottoni magnetici ──
  function initMagneticButtons() {
    var btns = document.querySelectorAll(
      ".cta-button, .back-to-top, .quick-whatsapp, .quick-call"
    );
    btns.forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var rect = btn.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        btn.style.transform =
          "translate(" + (x * 14) + "px, " + (y * 14) + "px)";
      });
      btn.addEventListener("mouseleave", function () {
        btn.style.transform = "";
      });
    });
  }

  // ── 6. Particelle di segatura (rimosse) ──
  // Nessuna creazione di canvas per le particelle.

  // ── 7. Contatori animati ──
  function initCounters() {
    var strip = document.querySelector(".stats-strip");
    if (!strip) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          strip.classList.add("stats-in");
          // Avvia i contatori
          var values = strip.querySelectorAll(".stat-value");
          values.forEach(function (el) {
            var target = parseInt(el.getAttribute("data-count"), 10) || 0;
            var suffix = el.getAttribute("data-suffix") || "";
            var current = 0;
            var step = Math.max(1, Math.floor(target / 30));
            var interval = setInterval(function () {
              current += step;
              if (current >= target) {
                current = target;
                clearInterval(interval);
              }
              el.textContent = current + suffix;
            }, 40);
          });
          observer.unobserve(strip);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(strip);
  }

  // ── 8. Badge Novità ──
  function initNovitaBadge() {
    var badges = document.querySelectorAll(".novita-badge");
    badges.forEach(function (b) {
      b.style.animation = "novitaPulse 2.2s ease-in-out infinite";
    });
  }

  // ── 9. Riconoscimenti: riflesso al passaggio (già in CSS) ──

  // ── 10. Slider delle pagine progetto ──
  function initProductSlider() {
    var slides = document.querySelectorAll(".slide");
    var dots = document.querySelectorAll(".dot");
    if (!slides.length || !dots.length) return;

    var current = 0;
    function show(index) {
      slides.forEach(function (s, i) {
        s.style.display = i === index ? "block" : "none";
      });
      dots.forEach(function (d, i) {
        d.classList.toggle("active", i === index);
      });
      current = index;
    }
    // Inizializza
    show(0);

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () { show(i); });
    });

    var prev = document.querySelector(".prev");
    var next = document.querySelector(".next");
    if (prev) prev.addEventListener("click", function () {
      show((current - 1 + slides.length) % slides.length);
    });
    if (next) next.addEventListener("click", function () {
      show((current + 1) % slides.length);
    });
  }

  // ── 11. Rimozione fisica di elementi indesiderati ──
  function removeUnwanted() {
    document.querySelectorAll(".cursor-dot, .cursor-ring, .scroll-progress")
      .forEach(function (el) { el.remove(); });
  }

  // ── Avvio ──
  function init() {
    removeUnwanted(); // pulizia immediata
    initLetterRise();
    initTypewriter();
    initTilt();
    initRipple();
    initMagneticButtons();
    initCounters();
    initNovitaBadge();
    initProductSlider();

    // Osserva nuovi elementi e rimuove eventuali ricreazioni
    var mo = new MutationObserver(function () {
      removeUnwanted();
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();