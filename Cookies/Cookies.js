// Cookies.js — gestione preferenze dalla pagina Cookie Policy
document.addEventListener("DOMContentLoaded", () => {
  const acceptBtn = document.getElementById("accept-cookies-page");
  const declineBtn = document.getElementById("decline-cookies-page");
  const statusEl = document.getElementById("cookie-status");

  const refreshStatus = () => {
    if (!statusEl) return;
    const val = localStorage.getItem("cookiesAccepted");
    if (val === "true") statusEl.textContent = "Stato attuale: cookie accettati";
    else if (val === "false")
      statusEl.textContent = "Stato attuale: cookie rifiutati";
    else statusEl.textContent = "Stato attuale: nessuna preferenza salvata";
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
