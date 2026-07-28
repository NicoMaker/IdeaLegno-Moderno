// ─────────────────────────────────────────────────────────────────────────────
// sectors-section.js — IdeaLegno
// Genera via JavaScript le due sezioni "esplora":
//   1) "I Nostri Settori"  → le 3 schede categoria (Casa / Commerciale / Nautico)
//   2) "Tutti i progetti"  → la scheda unica, in una SEZIONE SEPARATA
//
// COME SI USA
// -----------
// In qualunque pagina (home o pagine secondarie) basta inserire il segnaposto
// nel punto in cui devono comparire le sezioni:
//
//     <div data-idealegno-sectors></div>
//
// Il segnaposto viene sostituito dalle due <section> generate qui.
//
// PERCORSI
// --------
// Il link alla home viene calcolato automaticamente:
//   • pagina in radice (index.html)            → "index.html"
//   • pagina in sottocartella (Projects/…)     → "../index.html"
// Si può comunque forzare il percorso con l'attributo data-home:
//
//     <div data-idealegno-sectors data-home="../index.html"></div>
//
// Il valore viene poi copiato su .features-grid[data-home], che è ciò che
// legge category-cards.js per portare l'utente alla home con il filtro giusto.
//
// CARICAMENTO
// -----------
// Va incluso nell'<head> con "defer": in questo modo le schede esistono già
// prima del DOMContentLoaded, quindi category-cards.js e modern-animations.js
// le trovano regolarmente.
//
//     <script defer src="JS/ui/sectors-section.js"></script>       (home)
//     <script defer src="../JS/ui/sectors-section.js"></script>    (sottocartelle)
// ─────────────────────────────────────────────────────────────────────────────
(function () {
  "use strict";

  // Cartelle di primo livello del sito: se la pagina si trova qui dentro,
  // la home sta un livello sopra.
  var SUBFOLDERS = ["projects", "news", "contact", "cookies"];

  // ── Contenuti delle schede ─────────────────────────────────────────────────
  var SECTORS = [
    {
      filter: "Casa",
      icon: "home",
      title: "Arredamento Domestico",
      text: "Cucine, soggiorni, camere da letto e bagni su misura per la tua casa",
      cta: "Vedi i progetti",
      aria: "Mostra i progetti per la categoria Casa",
    },
    {
      filter: "Commerciale",
      icon: "store",
      title: "Arredamento Commerciale",
      text: "Soluzioni personalizzate per negozi, uffici e spazi commerciali",
      cta: "Vedi i progetti",
      aria: "Mostra i progetti per la categoria Commerciale",
    },
    {
      filter: "Nautico",
      icon: "sailing",
      title: "Settore Navale",
      text: "Arredamenti di lusso per yacht e imbarcazioni di ogni dimensione",
      cta: "Vedi i progetti",
      aria: "Mostra i progetti per la categoria Nautico",
    },
  ];

  var ALL_CARD = {
    filter: "Tutti",
    icon: "grid_view",
    title: "Tutti i progetti",
    text: "Sfoglia tutti i nostri lavori, in ogni settore",
    cta: "Vedi tutti",
    aria: "Mostra tutti i progetti",
    modifier: "feature-card--all",
  };

  // Id delle due sezioni: sono gli ancoraggi usati dai link nell'header
  // (index.html#Settori, index.html#TuttiProgetti).
  var SECTORS_ID = "Settori";
  var ALL_ID = "TuttiProgetti";

  var SECTORS_TITLE = "I Nostri Settori";
  var SECTORS_SUBTITLE =
    "Scegli l'ambito che ti interessa: ti portiamo direttamente ai progetti realizzati.";
  var ALL_TITLE = "Tutti i progetti";
  var ALL_SUBTITLE =
    "Preferisci dare un'occhiata d'insieme? Qui trovi ogni lavoro, senza filtri.";

  // ── Utility ────────────────────────────────────────────────────────────────
  function esc(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Percorso della home: esplicito (data-home) oppure dedotto dall'URL.
  function resolveHome(host) {
    var explicit = host.getAttribute("data-home");
    if (explicit) return explicit;

    var parts = location.pathname.split("/").filter(Boolean);
    parts.pop(); // toglie il nome del file
    var folder = (parts[parts.length - 1] || "").toLowerCase();

    return SUBFOLDERS.indexOf(folder) !== -1 ? "../index.html" : "index.html";
  }

  var ARROW =
    '<svg class="cta-arrow" viewBox="0 0 24 24" width="18" height="18" ' +
    'fill="none" stroke="currentColor" stroke-width="2.4" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  function cardHTML(card) {
    var cls = "feature-card feature-card--link";
    if (card.modifier) cls += " " + card.modifier;

    return (
      '<div class="' +
      cls +
      '" data-filter="' +
      esc(card.filter) +
      '" role="button" tabindex="0" aria-label="' +
      esc(card.aria) +
      '">' +
      '<div class="feature-icon">' +
      '<span class="material-icons">' +
      esc(card.icon) +
      "</span>" +
      "</div>" +
      "<h3>" +
      esc(card.title) +
      "</h3>" +
      "<p>" +
      esc(card.text) +
      "</p>" +
      '<span class="feature-card__cta" aria-hidden="true">' +
      esc(card.cta) +
      ARROW +
      "</span>" +
      "</div>"
    );
  }

  function sectionHTML(opts) {
    var cards = opts.cards.map(cardHTML).join("");

    return (
      '<section id="' +
      esc(opts.id) +
      '" class="about-section ' +
      opts.sectionClass +
      '">' +
      '<div class="container">' +
      '<h2 class="section-title">' +
      esc(opts.title) +
      "</h2>" +
      '<p class="section-subtitle">' +
      esc(opts.subtitle) +
      "</p>" +
      '<div class="features-grid ' +
      opts.gridClass +
      '" data-home="' +
      esc(opts.home) +
      '">' +
      cards +
      "</div>" +
      "</div>" +
      "</section>"
    );
  }

  function buildFor(host) {
    var home = resolveHome(host);

    return (
      sectionHTML({
        id: SECTORS_ID,
        sectionClass: "idealegno-explore",
        gridClass: "features-grid--sectors",
        title: SECTORS_TITLE,
        subtitle: SECTORS_SUBTITLE,
        cards: SECTORS,
        home: home,
      }) +
      sectionHTML({
        id: ALL_ID,
        sectionClass: "idealegno-explore-all",
        gridClass: "features-grid--all",
        title: ALL_TITLE,
        subtitle: ALL_SUBTITLE,
        cards: [ALL_CARD],
        home: home,
      })
    );
  }

  // ── Render: sostituisce il segnaposto con le due sezioni ───────────────────
  function render() {
    var hosts = document.querySelectorAll("[data-idealegno-sectors]");

    Array.prototype.forEach.call(hosts, function (host) {
      var parent = host.parentNode;
      if (!parent) return;

      var buffer = document.createElement("div");
      buffer.innerHTML = buildFor(host);

      while (buffer.firstChild) {
        parent.insertBefore(buffer.firstChild, host);
      }
      parent.removeChild(host);
    });
  }

  // Se si arriva sulla pagina con l'ancora già nell'URL
  // (es. Progetti/scale.html#Settori oppure index.html#TuttiProgetti) e il
  // browser non ha fatto il salto perché la sezione non esisteva ancora,
  // ci pensiamo noi. Non interviene se la pagina è già stata spostata.
  function honourHash() {
    var id = location.hash.replace("#", "");
    if (id !== SECTORS_ID && id !== ALL_ID) return;
    if (window.scrollY > 10) return;

    var target = document.getElementById(id);
    if (target) target.scrollIntoView();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }

  window.addEventListener("load", function () {
    setTimeout(honourHash, 80);
  });
})();
