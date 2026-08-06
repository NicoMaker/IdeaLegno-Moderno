// ---- estratto da JS/footer/aggiorna-orari.js (righe 63-72) ----
function _fermaCountdownStagione() {
  if (_countdownInterval) {
    clearInterval(_countdownInterval);
    _countdownInterval = null;
  }
  const el = document.getElementById("countdown-stagione");
  if (el) el.remove();
}

// Calcola la data esatta (mezzanotte) del prossimo cambio stagione
