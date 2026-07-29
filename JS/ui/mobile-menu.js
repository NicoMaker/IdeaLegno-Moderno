// Mobile menu functionality – con creazione automatica del header (X + logo)
document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.querySelector(".mobile-menu-toggle");
  let mobileMenu = document.querySelector(".mobile-menu");

  if (!menuToggle || !mobileMenu) return;

  // ── Assicura che il menu mobile abbia il header con logo e X ──
  function ensureMobileMenuHeader() {
    if (mobileMenu.querySelector(".mobile-menu-header")) return;
    const isSubpage = window.location.pathname.includes("/Projects/");
    const logoPath = isSubpage ? "../Img/IDEALEGNO.jpg" : "Img/IDEALEGNO.jpg";
    const homeLink = isSubpage ? "../index.html" : "index.html";

    const header = document.createElement("div");
    header.className = "mobile-menu-header";
    header.innerHTML = `
      <a href="${homeLink}" class="mobile-menu-logo-link">
        <img src="${logoPath}" alt="IdeaLegno" class="mobile-menu-logo" />
      </a>
      <button class="mobile-menu-close" aria-label="Chiudi menu">
        <span></span><span></span>
      </button>
    `;
    mobileMenu.prepend(header);
  }

  ensureMobileMenuHeader();

  const mobileMenuClose = mobileMenu.querySelector(".mobile-menu-close");
  const mobileNavLinks = mobileMenu.querySelectorAll(".mobile-nav-link");

  const openMenu = function () {
    menuToggle.classList.add("active");
    mobileMenu.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeMenu = function () {
    menuToggle.classList.remove("active");
    mobileMenu.classList.remove("active");
    document.body.style.overflow = "";
  };

  // Apri/chiudi con il toggle hamburger
  menuToggle.addEventListener("click", function () {
    if (mobileMenu.classList.contains("active")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Chiudi con il pulsante X
  if (mobileMenuClose) {
    mobileMenuClose.addEventListener("click", closeMenu);
  }

  // Chiudi quando si clicca su un link
  mobileNavLinks.forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  // Chiudi con tasto Esc
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && mobileMenu.classList.contains("active")) {
      closeMenu();
    }
  });
});

// Gestione click su link #Home per scrollare in alto (funziona ovunque)
document.addEventListener("DOMContentLoaded", function () {
  const homeLinks = document.querySelectorAll('a[href="#Home"]');
  homeLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const mobileMenu = document.querySelector(".mobile-menu");
      const toggle = document.querySelector(".mobile-menu-toggle");
      if (mobileMenu && toggle && mobileMenu.classList.contains("active")) {
        mobileMenu.classList.remove("active");
        toggle.classList.remove("active");
        document.body.style.overflow = "";
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
});