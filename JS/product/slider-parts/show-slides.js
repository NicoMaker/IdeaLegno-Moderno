// ---- estratto da JS/product/slider.js (righe 77-110) ----
function showSlides(n, direction) {
  const slides = document.getElementsByClassName("slide");
  const dots = document.getElementsByClassName("dot");

  // Gestione loop ciclico: se supera il numero di slide, torna all'inizio
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }

  // Nascondi tutte le slide
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  // Rimuovi la classe 'active' da tutti i pallini
  for (let i = 0; i < dots.length; i++) {
    dots[i].classList.remove("active");
  }

  // Mostra la slide corrente e attiva il pallino corrispondente
  const current = slides[slideIndex - 1];
  current.style.display = "block";
  if (dots[slideIndex - 1]) dots[slideIndex - 1].classList.add("active");

  animateEntrance(current, direction);
}

// ============================================================================
// ANIMAZIONE DI ENTRATA DELLA FOTO
// ============================================================================
