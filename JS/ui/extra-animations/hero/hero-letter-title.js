// ---- estratto da JS/ui/extra-animations.js (originariamente un unico file) ----
// extra-animations/hero-letter-title.js — Titolo hero: split in lettere
"use strict";

function initLetterTitle() {
  var title = document.querySelector(".hero-title");
  if (!title || title.classList.contains("is-split")) return;

  /* Se la pagina è tradotta (lingua diversa dall'italiano), NON spezzettiamo
     il titolo in singole lettere: Google Translate traduce il testo intero
     dei nodi DOM, e se lo troviamo già diviso in decine di <span> da una
     lettera ciascuno la traduzione risulta corrotta/mischiata (lettere
     tradotte singolarmente e fuori ordine). In quel caso lasciamo il titolo
     come testo semplice, così viene tradotto correttamente. */
  if (window.IdeaLegnoI18n && window.IdeaLegnoI18n.getLang() !== "it") {
    title.classList.add("is-split");
    return;
  }

  var text = title.textContent;
  title.setAttribute("aria-label", text);
  title.textContent = "";

  var idx = 0;
  var words = text.split(" ");
  words.forEach(function (word, wIdx) {
    var wordSpan = document.createElement("span");
    wordSpan.className = "ht-word";

    word.split("").forEach(function (ch) {
      var span = document.createElement("span");
      span.className = "ht-letter";
      span.setAttribute("aria-hidden", "true");
      span.textContent = ch;
      span.style.setProperty("--li", String(idx));
      wordSpan.appendChild(span);
      idx++;
    });

    title.appendChild(wordSpan);
    if (wIdx < words.length - 1) {
      title.appendChild(document.createTextNode(" "));
    }
  });

  title.classList.add("is-split");
}
