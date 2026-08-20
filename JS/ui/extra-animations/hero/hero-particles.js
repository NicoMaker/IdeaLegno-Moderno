// ---- estratto da JS/ui/extra-animations.js (originariamente un unico file) ----
// extra-animations/hero-particles.js — Particelle di segatura dorata nella hero (canvas leggero)
"use strict";

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
