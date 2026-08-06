// ─────────────────────────────────────────────────────────────────────────────
// sectors-section.js — IdeaLegno
// Genera via JavaScript un'unica sezione finale, identica su home e pagine
// interne: #Settori → "I Nostri Settori", che contiene
//   • le 3 schede categoria
//   • la scheda "Tutti i progetti" (#TuttiProgetti) centrata sotto
//   • la barra con i numeri (#Dati): anni, progetti, settori, % su misura —
//     SOLO in home. Nelle pagine interne la sezione si ferma alle schede.
// Gli id restano validi come ancore per le voci di menu.
//
// La barra dei numeri si può forzare con data-stats sul segnaposto:
//     <div data-idealegno-sectors data-stats="false"></div>   → mai
//     <div data-idealegno-sectors data-stats="true"></div>    → sempre
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

  // Ancore usate dai link nell'header e dai collegamenti esterni.
  var SECTORS_ID = "Settori";
  var ALL_ID = "TuttiProgetti";
  var STATS_ID = "Dati";

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
    id: ALL_ID, // l'ancora #TuttiProgetti resta valida
  };

  var SECTORS_TITLE = "I Nostri Settori";
  var SECTORS_SUBTITLE =
    "Scegli l'ambito che ti interessa, oppure sfoglia tutti i lavori: " +
    "ti portiamo direttamente ai progetti realizzati.";

  // ── Utility ────────────────────────────────────────────────────────────────
  function esc(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Siamo in una pagina interna (Projects/…) o nella home?
  function isSubpage() {
    var parts = location.pathname.split("/").filter(Boolean);
    parts.pop(); // toglie il nome del file
    var folder = (parts[parts.length - 1] || "").toLowerCase();
    return SUBFOLDERS.indexOf(folder) !== -1;
  }

  // Percorso della home: esplicito (data-home) oppure dedotto dall'URL.
  function resolveHome(host) {
    var explicit = host.getAttribute("data-home");
    if (explicit) return explicit;

    return isSubpage() ? "../index.html" : "index.html";
  }

  // La barra dei numeri va solo in home, salvo indicazione contraria.
  function wantsStats(host) {
    var attr = host.getAttribute("data-stats");
    if (attr !== null) return attr !== "false";
    return !isSubpage();
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
      "<div" +
      (card.id ? ' id="' + esc(card.id) + '"' : "") +
      ' class="' +
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

  // ── Barra dei numeri ───────────────────────────────────────────────────────
  // I valori vengono riempiti da JS/ui/extra-animations.js: "anni di attività"
  // dall'anno di fondazione in app-config.js, progetti e settori dall'evento
  // "prodottiCaricati" emesso da products-loader.js.
  function statsHTML() {
    return (
      '<div id="' +
      STATS_ID +
      '" class="stats-strip">' +
      '<div class="stat-item">' +
      '<div class="stat-value" data-since="">0</div>' +
      '<div class="stat-label">Anni di attività</div>' +
      "</div>" +
      '<div class="stat-item">' +
      '<div class="stat-value" data-source="progetti">0</div>' +
      '<div class="stat-label">Progetti in vetrina</div>' +
      "</div>" +
      '<div class="stat-item">' +
      '<div class="stat-value" data-source="categorie">0</div>' +
      '<div class="stat-label" id="categorie-label">Settori: ...</div>' +
      "</div>" +
      '<div class="stat-item">' +
      '<div class="stat-value" data-count="100" data-suffix="%">0</div>' +
      '<div class="stat-label">Su misura</div>' +
      "</div>" +
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
      (opts.extra || "") +
      "</div>" +
      "</section>"
    );
  }

  function buildFor(host) {
    var home = resolveHome(host);

    return sectionHTML({
      id: SECTORS_ID,
      sectionClass: "idealegno-explore",
      gridClass: "features-grid--sectors",
      title: SECTORS_TITLE,
      subtitle: SECTORS_SUBTITLE,
      cards: SECTORS.concat([ALL_CARD]),
      home: home,
      extra: wantsStats(host) ? statsHTML() : "",
    });
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
    if (id !== SECTORS_ID && id !== ALL_ID && id !== STATS_ID) return;
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
