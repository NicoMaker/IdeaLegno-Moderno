// Active section highlighting on scroll
// Questo script è il SOLO responsabile di aggiornare l'hash dell'URL

document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section[id], footer#Contatti");
  const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link");

  let isManualNavigation = false;
  let scrollTimeout;
  let preventHashUpdate = false;
  let isInitialLoad = true;

  // ── Rileva se siamo in una pagina di dettaglio progetto ──
  function isProjectPage() {
    return (
      document.querySelector(".product-detail-container") !== null ||
      window.location.pathname.includes("/Projects/")
    );
  }

  function highlightNavigation() {
    // Se siamo in una pagina progetto, attiviamo "Progetti" e usciamo
    if (isProjectPage()) {
      updateActiveLink("Prodotti");
      return;
    }

    if (isInitialLoad) return;

    const scrollY = window.pageYOffset;
    let currentSectionId = "";

    // Crea un array di sezioni con le loro posizioni
    const sectionPositions = Array.from(sections).map((section) => ({
      id: section.getAttribute("id"),
      top: section.offsetTop,
      bottom: section.offsetTop + section.offsetHeight,
    }));

    // Se non ci sono sezioni, esci (non dovrebbe succedere in home)
    if (sectionPositions.length === 0) return;

    // Controlla se siamo alla fine della pagina (Contatti)
    const windowBottom = scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (windowBottom >= documentHeight - 50) {
      currentSectionId = "Contatti";
    } else {
      // Trova la sezione corrente basandosi sulla posizione di scroll
      const header = document.querySelector(".site-header");
      const headerHeight = header ? header.offsetHeight : 80;
      const scrollPosition = scrollY + headerHeight + 100;

      for (let i = sectionPositions.length - 1; i >= 0; i--) {
        const section = sectionPositions[i];
        if (scrollPosition >= section.top) {
          currentSectionId = section.id;
          break;
        }
      }

      if (scrollY < 100) {
        currentSectionId = "Home";
      }
    }

    if (!currentSectionId) {
      currentSectionId = "Home";
    }

    updateActiveLink(currentSectionId);

    if (preventHashUpdate) return;

    const currentHash = window.location.hash.substring(1);
    if (currentHash !== currentSectionId) {
      try {
        history.replaceState(null, null, `#${currentSectionId}`);
      } catch (e) {
        console.error("Errore nell'aggiornamento dell'hash:", e);
      }
    }
  }

  function updateActiveLink(sectionId) {
    navLinks.forEach((link) => {
      const targetId = link.getAttribute("href").substring(1);
      // Gestisce link relativi come "../index.html#Prodotti"
      const hashIndex = targetId.indexOf("#");
      const targetHash =
        hashIndex !== -1 ? targetId.substring(hashIndex + 1) : targetId;
      if (targetHash === sectionId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  // Click su link
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      let href = link.getAttribute("href");
      // Se il link punta a una pagina esterna (es. ../index.html#...), gestisci
      if (
        href.startsWith("..") ||
        href.startsWith("/") ||
        href.includes(".html")
      ) {
        window.location.href = href;
        return;
      }
      const targetId = href.substring(1);
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
    // Se siamo in una pagina progetto, attiviamo subito "Progetti" e non facciamo altro
    if (isProjectPage()) {
      updateActiveLink("Prodotti");
      return;
    }

    const hash = window.location.hash.substring(1);
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
      }, 1500);
    };

    if (hash) {
      if (hash === "Contatti") {
        preventHashUpdate = true;
        document.addEventListener(
          "footerLoaded",
          () => {
            scrollToHash(hash);
          },
          { once: true },
        );
        setTimeout(() => {
          if (!document.getElementById("Contatti")) {
            preventHashUpdate = false;
            isInitialLoad = false;
            highlightNavigation();
          }
        }, 5000);
      } else {
        scrollToHash(hash);
      }
    } else {
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
