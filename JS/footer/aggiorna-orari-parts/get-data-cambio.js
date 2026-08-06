// ---- estratto da JS/footer/aggiorna-orari.js (righe 73-91) ----
function _getDataCambio(transizione, dataRiferimento) {
  if (!transizione) return null;
  const oggi = new Date(dataRiferimento || getNow());
  oggi.setHours(0, 0, 0, 0);
  const anno = oggi.getFullYear();

  for (const offset of [-1, 0, 1]) {
    const a = anno + offset;
    const date = getDateCambioStagione(a);
    const candidata = new Date(
      transizione.a === "Estivo" ? date.inizioEstivo : date.inizioInvernale,
    );
    candidata.setHours(0, 0, 0, 0);
    if (candidata >= oggi) return candidata;
  }
  return null;
}

// ── Funzione principale ─────────────────────────────────────
