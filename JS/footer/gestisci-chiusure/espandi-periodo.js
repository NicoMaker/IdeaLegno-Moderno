// ---- estratto da JS/footer/Gestisci_chiusure.js (righe 27-43) ----
function _espandiPeriodo(inizio, fine, year, targetSet) {
  let dataInizio = _parseDDMM(inizio, year);
  let dataFine = _parseDDMM(fine, year);

  // Periodo a cavallo d'anno (es. 24/12 → 06/01)
  if (dataInizio.getTime() > dataFine.getTime()) {
    dataFine = _parseDDMM(fine, year + 1);
  }

  const cur = new Date(dataInizio);
  while (cur.getTime() <= dataFine.getTime()) {
    targetSet.add(formatDateDM(cur));
    cur.setDate(cur.getDate() + 1);
  }
}

// Normalizza il motivo: vuoto → "Ferie"
