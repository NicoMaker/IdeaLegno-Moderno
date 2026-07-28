// ─────────────────────────────────────────────────────────────────────────────
// category-cards.js — IdeaLegno
// Rende cliccabili le tre schede "Arredamento Domestico / Commerciale /
// Settore Navale". Cliccando (o premendo Invio/Spazio) una scheda:
//   • si attiva il filtro giusto nella sezione "I Nostri Progetti"
//   • la pagina scorre automaticamente fino ai progetti filtrati
// Riusa la logica già presente in progetti.js: preme il relativo
// pulsante-filtro, così stato, evidenziazione e scroll restano coerenti.
// Le schede portano data-filter="Casa" | "Commerciale" | "Nautico" | "Tutti".
// Le schede sono generate da JS/ui/sectors-section.js: qui si usa la delega
// degli eventi, così l'ordine di caricamento degli script non conta.
// ─────────────────────────────────────────────────────────────────────────────
(function () {
  "use strict";

  var STORAGE_KEY = "idealegnoSelectedCategory";

  function findFilterButton(filter) {
    var buttons = document.querySelectorAll(".filter-button");
    for (var i = 0; i < buttons.length; i++) {
      if (buttons[i].dataset.category === filter) return buttons[i];
    }
    return null;
  }

  function scrollToProjects() {
    var section = document.getElementById("Prodotti");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  }

  function activate(filter) {
    // 0) Pagina SENZA la sezione progetti (es. pagina di dettaglio di un
    //    progetto): salvo la scelta e vado alla home, dove progetti.js
    //    applicherà il filtro al caricamento e scorrerà fino ai progetti.
    if (!document.getElementById("Prodotti")) {
      try {
        localStorage.setItem(STORAGE_KEY, filter);
      } catch (e) {
        /* localStorage non disponibile: si procede comunque */
      }
      var grid = document.querySelector(".features-grid[data-home]");
      var home = grid ? grid.getAttribute("data-home") : "index.html";
      window.location.href = home + "#Prodotti";
      return;
    }

    // 1) Se i pulsanti filtro esistono già, premi quello giusto:
    //    riusa tutta la logica di progetti.js (stato + scroll incluso).
    var btn = findFilterButton(filter);
    if (btn) {
      btn.click();
      return;
    }

    // 2) Altrimenti (prodotti non ancora caricati) salva la scelta e
    //    vai alla sezione: progetti.js la applicherà al caricamento.
    try {
      localStorage.setItem(STORAGE_KEY, filter);
    } catch (e) {
      /* localStorage non disponibile: si procede comunque */
    }
    scrollToProjects();

    // 3) Riprova a premere il pulsante appena compare (max ~4s).
    var tries = 0;
    var iv = setInterval(function () {
      var b = findFilterButton(filter);
      if (b) {
        b.click();
        clearInterval(iv);
      } else if (++tries > 40) {
        clearInterval(iv);
      }
    }, 100);
  }

  // ── Aggancio degli eventi ──────────────────────────────────────────────────
  // Delega sul documento: funziona sia con le schede scritte nell'HTML sia con
  // quelle generate da JS/ui/sectors-section.js, senza dipendere dall'ordine
  // di caricamento degli script.
  function closestCard(el) {
    while (el && el !== document) {
      if (el.classList && el.classList.contains("feature-card--link")) return el;
      el = el.parentNode;
    }
    return null;
  }

  document.addEventListener("click", function (e) {
    var card = closestCard(e.target);
    if (!card) return;
    var filter = card.getAttribute("data-filter");
    if (filter) activate(filter);
  });

  // Accessibilità: attivazione da tastiera (Invio / Spazio).
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " " && e.key !== "Spacebar") return;
    var card = closestCard(e.target);
    if (!card) return;
    var filter = card.getAttribute("data-filter");
    if (!filter) return;
    e.preventDefault();
    activate(filter);
  });
})();
