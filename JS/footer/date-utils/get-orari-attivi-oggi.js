// ---- estratto da JS/footer/date-utils.js (righe 417-428) ----
function getOrariAttiviOggi(data, dataRiferimento) {
  const result = getStagioneAttivaConDate(data, dataRiferimento);
  return {
    orari: result ? result.stagione.orari : data.orari || [],
    nomeStagione: result ? result.stagione.nome : null,
  };
}

// ============================================================
// Calcola il testo descrittivo di una stagione con le date reali
// Es: "Orario Estivo: dal 30/03/2025 al 25/10/2025"
// ============================================================
