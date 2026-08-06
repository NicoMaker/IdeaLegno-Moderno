// ---- estratto da JS/footer/Gestisci_chiusure.js (righe 50-85) ----
function _buildChiusureMap(data, year) {
  const dateSet = new Set();
  const motiviMap = new Map(); // DD/MM → motivo

  const chiusure = data.chiusure || [];

  for (const voce of chiusure) {
    if (!voce) continue;

    if (voce.tipo === "giorno" && voce.data && voce.data.trim()) {
      const d = voce.data.trim();
      dateSet.add(d);
      motiviMap.set(d, _motivo(voce));
    } else if (
      voce.tipo === "periodo" &&
      voce.inizio &&
      voce.inizio.trim() &&
      voce.fine &&
      voce.fine.trim()
    ) {
      const tmpSet = new Set();
      _espandiPeriodo(voce.inizio.trim(), voce.fine.trim(), year, tmpSet);
      const motivo = _motivo(voce);
      for (const d of tmpSet) {
        dateSet.add(d);
        motiviMap.set(d, motivo);
      }
    }
    // Voci con data/inizio/fine vuoti → ignorate silenziosamente
  }

  return { dateSet, motiviMap };
}

// ── API pubblica ─────────────────────────────────────────────

