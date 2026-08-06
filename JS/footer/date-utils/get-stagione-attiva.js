// ---- estratto da JS/footer/date-utils.js (righe 408-416) ----
function getStagioneAttiva(data, dataRiferimento) {
  const result = getStagioneAttivaConDate(data, dataRiferimento);
  return result ? result.stagione : null;
}

// ============================================================
// Restituisce gli orari da usare oggi:
// stagione attiva > orari base
// ============================================================
