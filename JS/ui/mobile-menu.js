// Mobile menu functionality
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".mobile-menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

  if (menuToggle && mobileMenu) {
    const setMenuTop = () => {
      const header = document.querySelector(".site-header");
      const top = header
        ? Math.round(header.getBoundingClientRect().height)
        : 72;
      document.documentElement.style.setProperty("--mm-top", top + "px");
    };

    menuToggle.addEventListener("click", () => {
      // Calcola l'altezza dell'header PRIMA di aprire (menu ancora chiuso),
      // così l'overlay parte esattamente sotto la barra.
      if (!mobileMenu.classList.contains("active")) setMenuTop();

      menuToggle.classList.toggle("active");
      mobileMenu.classList.toggle("active");

      // Blocca lo scroll della pagina quando il menu è aperto
      document.body.style.overflow = mobileMenu.classList.contains("active")
        ? "hidden"
        : "";
    });

    // Se ruoti/ridimensioni con il menu aperto, riallinea l'overlay
    window.addEventListener("resize", () => {
      if (mobileMenu.classList.contains("active")) setMenuTop();
    });

    // Close menu when clicking on a link
    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.classList.remove("active");
        mobileMenu.classList.remove("active");
        document.body.style.overflow = "";
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!menuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
        menuToggle.classList.remove("active");
        if (mobileMenu.classList.contains("active")) {
          mobileMenu.classList.remove("active");
          document.body.style.overflow = "";
        }
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const homeLinks = document.querySelectorAll('a[href="#Home"]');

  homeLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      // Chiudi eventuale menu mobile aperto (facoltativo)
      const mobileMenu = document.querySelector(".mobile-menu");
      const toggle = document.querySelector(".mobile-menu-toggle");
      if (mobileMenu && toggle && mobileMenu.classList.contains("active")) {
        mobileMenu.classList.remove("active");
        toggle.classList.remove("active");
      }

      // Scrolla all'inizio della pagina, sopra la hero
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  });
});
