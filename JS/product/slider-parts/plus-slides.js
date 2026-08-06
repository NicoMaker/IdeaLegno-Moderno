// ---- estratto da JS/product/slider.js (righe 60-66) ----
const plusSlides = (n) => {
  const direction = n < 0 ? "prev" : "next";
  slideIndex += n;
  showSlides(slideIndex, direction);
};

// Navigazione diretta tramite pallini / miniature
