// ─────────────────────────────────────────────────────────────────────────────
// app-config.js — Config generale del sito
//
// Qui definisci le chiavi JSON e le opzioni di ogni sezione.
// Le sezioni NON devono hardcodare "palette/footer/progetti": le leggono da qui.
// ─────────────────────────────────────────────────────────────────────────────

const AppConfig = (() => {
  const jsonKeys = {
    progetti: "progetti",
    footer: "footer",
    palette: "palette",
  };

  const products = {
    jsonKey: jsonKeys.progetti,
    storageKeyCategory: "idealegnoSelectedCategory",
    storageKeySearch: "idealegnoSearchTerm",
    defaultFilter: "Tutti",
    scrollMargin: 20, // px extra sotto header + controls
  };

  // Dati aziendali. Cambia SOLO qui l'anno di fondazione:
  // gli "anni di attività" nel sito si calcolano da soli (anno corrente - questo).
  const azienda = {
    annoFondazione: 2018,
  };

  const footer = {
    jsonKey: jsonKeys.footer,
  };

  const palette = {
    jsonKey: jsonKeys.palette,
  };

  return { jsonKeys, products, footer, palette, azienda };
})();
