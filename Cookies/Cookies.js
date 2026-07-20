// ─────────────────────────────────────────────────────────────
// Cookies.js — gestione preferenze dalla pagina Cookie Policy
// Salva la scelta in localStorage ("cookiesAccepted": "true"/"false"),
// la stessa chiave letta dal banner del sito (JS/ui/cookie-banner.js).
// ─────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const acceptBtn = document.getElementById("accept-cookies-page");
  const declineBtn = document.getElementById("decline-cookies-page");
  const statusEl = document.getElementById("cookie-status");
  const yearEl = document.getElementById("year");

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const refreshStatus = () => {
    if (!statusEl) return;
    const val = localStorage.getItem("cookiesAccepted");

    statusEl.classList.remove("is-accepted", "is-declined");
    if (acceptBtn) acceptBtn.classList.remove("is-active");
    if (declineBtn) declineBtn.classList.remove("is-active");

    if (val === "true") {
      statusEl.textContent = "Cookie accettati";
      statusEl.classList.add("is-accepted");
      if (acceptBtn) acceptBtn.classList.add("is-active");
    } else if (val === "false") {
      statusEl.textContent = "Solo cookie essenziali";
      statusEl.classList.add("is-declined");
      if (declineBtn) declineBtn.classList.add("is-active");
    } else {
      statusEl.textContent = "Nessuna preferenza salvata";
    }
  };

  if (acceptBtn)
    acceptBtn.addEventListener("click", () => {
      localStorage.setItem("cookiesAccepted", "true");
      refreshStatus();
    });

  if (declineBtn)
    declineBtn.addEventListener("click", () => {
      localStorage.setItem("cookiesAccepted", "false");
      refreshStatus();
    });

  refreshStatus();
});
