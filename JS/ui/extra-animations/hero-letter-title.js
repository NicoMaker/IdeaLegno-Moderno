// ---- estratto da JS/ui/extra-animations.js (originariamente un unico file) ----
// extra-animations/hero-letter-title.js — Titolo hero: split in lettere
"use strict";

function initLetterTitle() {
  var title = document.querySelector(".hero-title");
  if (!title || title.classList.contains("is-split")) return;

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
