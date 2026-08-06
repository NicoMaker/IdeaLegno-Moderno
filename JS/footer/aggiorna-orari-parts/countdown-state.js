// ---- estratto da JS/footer/aggiorna-orari.js (righe 1-10) ----
// ============================================================
// aggiorna-orari.js — Aggiornamento live della lista orari
// Dipende da: date-utils.js, Gestisci_chiusure.js, gestisci_apertura.js
// Le date di cambio stagione sono gestite in date-utils.js
// ============================================================

// ── Countdown cambio stagione ───────────────────────────────
let _countdownInterval = null;
let _stagionePrecedente = null; // traccia la stagione attiva per rilevare i cambi

