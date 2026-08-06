// ---- estratto da JS/footer/Gestisci_chiusure.js (righe 119-146) ----
function findConsecutiveClosureEnd(startDate, unifiedFerieDates, motiviMap) {
  const startDateDM = formatDateDM(startDate);
  const motivoInizio = motiviMap ? motiviMap.get(startDateDM) : null;

  if (!unifiedFerieDates.has(startDateDM)) return startDateDM;

  const cur = new Date(startDate);
  let end = new Date(startDate);

  while (true) {
    cur.setDate(cur.getDate() + 1);
    const nextDM = formatDateDM(cur);

    // Fermati se il giorno successivo non è chiuso
    if (!unifiedFerieDates.has(nextDM)) break;

    // Fermati se il motivo del giorno successivo è diverso
    const motivoNext = motiviMap ? motiviMap.get(nextDM) : null;
    if (motivoInizio !== motivoNext) break;

    end = new Date(cur);
  }

  return formatDateDM(end);
}

// ── Controllo chiusura per un singolo giorno ─────────────────

