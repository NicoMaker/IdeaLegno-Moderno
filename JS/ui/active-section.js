// Active section highlighting on scroll
// Questo script è il SOLO responsabile di aggiornare l'hash dell'URL

document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section[id], footer#Contatti");
  const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link");

  let isManualNavigation = false;
  let scrollTimeout;
  let preventHashUpdate = false;
  let isInitialLoad = true;

  function highlightNavigation() {
    if (isInitialLoad) return;

    const scrollY = window.pageYOffset;
    let currentSectionId = "";

    // Crea un array di sezioni con le loro posizioni
    const sectionPositions = Array.from(sections).map((section) => ({
      id: section.getAttribute("id"),
      top: section.offsetTop,
      bottom: section.offsetTop + section.offsetHeight,
    }));

    // Controlla se siamo alla fine della pagina (Contatti)
    const windowBottom = scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (windowBottom >= documentHeight - 50) {
      currentSectionId = "Contatti";
    } else {
      // Trova la sezione corrente basandosi sulla posizione di scroll
      // Usa un offset per l'header
      const header = document.querySelector(".site-header");
      const headerHeight = header ? header.offsetHeight : 80;
      const scrollPosition = scrollY + headerHeight + 100; // Aggiungi un margine

      // Trova la sezione che contiene la posizione corrente
      for (let i = sectionPositions.length - 1; i >= 0; i--) {
        const section = sectionPositions[i];
        if (scrollPosition >= section.top) {
          currentSectionId = section.id;
          break;
        }
      }

      // Se siamo in cima alla pagina
      if (scrollY < 100) {
        currentSectionId = "Home";
      }
    }

    // Se non abbiamo trovato una sezione, usa Home come default
    if (!currentSectionId) {
      currentSectionId = "Home";
    }

    // Aggiorna i link di navigazione
    updateActiveLink(currentSectionId);

    // NON aggiornare l'hash se è bloccato
    if (preventHashUpdate) return;

    // Aggiorna l'hash SOLO se è diverso dall'attuale
    const currentHash = window.location.hash.substring(1);
    if (currentHash !== currentSectionId) {
      try {
        history.replaceState(null, null, `#${currentSectionId}`);
        console.log(`📍 Hash aggiornato: #${currentSectionId}`);
      } catch (e) {
        console.error("Errore nell'aggiornamento dell'hash:", e);
      }
    }
  }

  function updateActiveLink(sectionId) {
    navLinks.forEach((link) => {
      const targetId = link.getAttribute("href").substring(1);
      if (targetId === sectionId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
    console.log(`🎯 Link attivo: ${sectionId}`);
  }

  // Click su link
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const targetId = link.getAttribute("href").substring(1);

      if (targetId === "Contatti" && !document.getElementById("Contatti")) {
        document.addEventListener(
          "footerLoaded",
          () => {
            scrollToSection(targetId);
          },
          { once: true },
        );
        return;
      }

      scrollToSection(targetId);
    });
  });

  function scrollToSection(targetId) {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) {
      console.warn(`⚠️ Sezione ${targetId} non trovata`);
      return;
    }

    isManualNavigation = true;
    preventHashUpdate = true;

    updateActiveLink(targetId);
    history.replaceState(null, null, `#${targetId}`);

    const header = document.querySelector(".site-header");
    const totalOffset = header ? header.offsetHeight : 80;

    const offsetPosition = targetElement.offsetTop - totalOffset;
    window.scrollTo({ top: offsetPosition, behavior: "smooth" });

    console.log(`🔄 Scroll verso: ${targetId}`);

    setTimeout(() => {
      preventHashUpdate = false;
      isManualNavigation = false;
    }, 800);
  }

  // Scroll listener con debounce
  window.addEventListener("scroll", () => {
    if (isManualNavigation || isInitialLoad) return;

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(highlightNavigation, 150);
  });

  // Inizializzazione
  function initializePage() {
    const hash = window.location.hash.substring(1);

    // Se l'utente interagisce (scroll/touch), non forziamo più la posizione.
    let userInterrupted = false;
    ["wheel", "touchstart", "keydown", "pointerdown"].forEach((ev) =>
      window.addEventListener(
        ev,
        () => {
          userInterrupted = true;
        },
        { passive: true, once: true },
      ),
    );

    const scrollToHash = (targetId) => {
      const targetElement = document.getElementById(targetId);
      if (!targetElement) {
        preventHashUpdate = false;
        isInitialLoad = false;
        highlightNavigation();
        return;
      }

      updateActiveLink(targetId);
      preventHashUpdate = true;

      const doScroll = () => {
        if (userInterrupted) return;
        const el = document.getElementById(targetId);
        if (!el) return;
        const header = document.querySelector(".site-header");
        const headerHeight = header ? header.offsetHeight : 80;
        const top =
          targetId === "Contatti"
            ? document.body.scrollHeight
            : el.offsetTop - headerHeight;
        window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
      };

      if (targetId !== "Home") {
        doScroll();
        // I progetti sono generati dal JSON dopo il caricamento: quando
        // arrivano (e quando le immagini finiscono di caricarsi) la pagina
        // cambia altezza, quindi riposizioniamo lo scroll sul target reale.
        document.addEventListener(
          "prodottiCaricati",
          () => setTimeout(doScroll, 60),
          { once: true },
        );
        window.addEventListener("load", () => setTimeout(doScroll, 120), {
          once: true,
        });
        [250, 600, 1200].forEach((t) => setTimeout(doScroll, t));
      }

      setTimeout(() => {
        preventHashUpdate = false;
        isInitialLoad = false;
        console.log("✅ Inizializzazione completata, sistema sbloccato");
      }, 1500);
    };

    if (hash) {
      console.log(`🎯 Hash rilevato al caricamento: #${hash}`);

      if (hash === "Contatti") {
        preventHashUpdate = true;
        console.log(
          "🔄 In attesa del caricamento del footer per sezione Contatti...",
        );

        document.addEventListener(
          "footerLoaded",
          () => {
            console.log("✅ Footer caricato, scroll verso Contatti");
            scrollToHash(hash);
          },
          { once: true },
        );

        setTimeout(() => {
          if (!document.getElementById("Contatti")) {
            console.warn("⚠️ Timeout: Footer non caricato entro 5 secondi");
            preventHashUpdate = false;
            isInitialLoad = false;
            highlightNavigation();
          }
        }, 5000);
      } else {
        scrollToHash(hash);
      }
    } else {
      console.log("🏠 Nessun hash, imposto #Home");
      updateActiveLink("Home");
      history.replaceState(null, null, "#Home");

      setTimeout(() => {
        preventHashUpdate = false;
        isInitialLoad = false;
      }, 500);
    }
  }

  initializePage();
});
