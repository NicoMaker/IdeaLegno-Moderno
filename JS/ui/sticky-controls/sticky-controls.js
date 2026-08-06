// sticky-controls.js
// Gestisce la barra di ricerca/filtri "sticky" usando position: fixed
// controllato via JS invece di position: sticky via CSS.
//
// Perché: su Safari (iOS/macOS) c'è un bug noto per cui, se un qualsiasi
// antenato (anche <html> o <body>) ha "overflow" diverso da "visible"
// (incluso "overflow-x: clip", usato altrove in questo sito per evitare
// lo scroll orizzontale), "position: sticky" smette di funzionare sui
// discendenti. Con position: fixed calcolato via scroll listener il
// problema non si presenta, perché fixed non dipende dagli antenati.
//
// La barra resta agganciata SOLO all'interno della sezione "I Nostri
// Progetti": appena il fondo della sezione passa sopra la barra, questa
// sparisce in dissolvenza (classe .is-out) e ricompare tornando indietro.
// Non viene sganciata davvero, così il segnaposto mantiene la sua altezza
// e il contenuto sotto non fa salti.

document.addEventListener("DOMContentLoaded", () => {
  const siteHeader = document.querySelector(".site-header");
  const stickyControls = document.getElementById("product-controls-sticky");
  const placeholder = document.getElementById("product-controls-placeholder");

  // Sezione che "possiede" la barra: fuori di qui la barra non si vede.
  const projectsSection =
    stickyControls.closest("section") || document.getElementById("Prodotti");

  if (!siteHeader || !stickyControls || !placeholder) return;

  let naturalOffsetTop = 0; // posizione della barra nel flusso normale (non pinned)
  let pinTop = 0; // distanza dal top quando è pinned (= altezza header + margine)
  let isPinned = false;

  function measure() {
    // Se è già pinned, la rimuoviamo temporaneamente per misurare
    // la sua posizione naturale nel flusso del documento.
    const wasPinned = isPinned;
    if (wasPinned) {
      stickyControls.classList.remove("is-pinned");
      placeholder.style.height = "0px";
    }

    const headerHeight = siteHeader.offsetHeight;
    pinTop = headerHeight + 5;

    const rect = stickyControls.getBoundingClientRect();
    naturalOffsetTop = rect.top + window.scrollY;

    if (wasPinned) {
      stickyControls.classList.add("is-pinned");
      placeholder.style.height = `${stickyControls.offsetHeight}px`;
    }

    updatePinState();
  }

  // La barra è "fuori sezione" quando il fondo della sezione progetti
  // è ormai risalito sopra la barra stessa.
  function updateOutOfSection() {
    if (!projectsSection) return;

    const barHeight = stickyControls.offsetHeight;
    const sectionBottom = projectsSection.getBoundingClientRect().bottom;
    const isOut = isPinned && sectionBottom < pinTop + barHeight;

    stickyControls.classList.toggle("is-out", isOut);
  }

  function updatePinState() {
    const triggerPoint = naturalOffsetTop - pinTop;
    const shouldPin = window.scrollY >= triggerPoint;

    if (shouldPin && !isPinned) {
      isPinned = true;
      stickyControls.classList.add("is-pinned");
      stickyControls.style.top = `${pinTop}px`;
      placeholder.style.height = `${stickyControls.offsetHeight}px`;
    } else if (!shouldPin && isPinned) {
      isPinned = false;
      stickyControls.classList.remove("is-pinned");
      stickyControls.style.top = "";
      placeholder.style.height = "0px";
    } else if (isPinned) {
      // Header potrebbe cambiare altezza durante lo scroll (es. si compatta)
      stickyControls.style.top = `${pinTop}px`;
    }

    if (!isPinned) stickyControls.classList.remove("is-out");
    updateOutOfSection();
  }

  measure();

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updatePinState();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true },
  );

  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(measure, 100);
  });

  window.addEventListener("orientationchange", () => {
    setTimeout(measure, 300);
  });

  // Ricalcola anche quando cambia il contenuto della sezione (es. filtri
  // che cambiano l'altezza della griglia sottostante non influenzano la
  // barra, ma un cambio di font/immagini nell'header sì).
  window.addEventListener("load", measure);

  // I progetti arrivano dal JSON dopo il caricamento: la sezione cambia
  // altezza, quindi rimisuriamo.
  document.addEventListener("prodottiCaricati", () => setTimeout(measure, 60));
});
