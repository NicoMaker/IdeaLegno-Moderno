// ---- estratto da JS/ui/extra-animations.js (originariamente un unico file) ----
// extra-animations/progetti-listener.js — Ascolta l'evento di caricamento dei progetti
"use strict";

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
