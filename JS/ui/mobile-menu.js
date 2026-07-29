// Mobile menu functionality
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".mobile-menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  const mobileMenuClose = document.querySelector(".mobile-menu-close");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

  if (menuToggle && mobileMenu) {
    const openMenu = () => {
      menuToggle.classList.add("active");
      mobileMenu.classList.add("active");
      document.body.style.overflow = "hidden";
    };

    const closeMenu = () => {
      menuToggle.classList.remove("active");
      mobileMenu.classList.remove("active");
      document.body.style.overflow = "";
    };

    menuToggle.addEventListener("click", () => {
      if (mobileMenu.classList.contains("active")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Pulsante "X" dentro l'overlay
    if (mobileMenuClose) {
      mobileMenuClose.addEventListener("click", closeMenu);
    }

    // Chiudi il menu quando si clicca su un link
    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Chiudi il menu con il tasto Esc
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileMenu.classList.contains("active")) {
        closeMenu();
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
