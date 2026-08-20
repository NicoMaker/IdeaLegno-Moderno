// ---- estratto da JS/footer/Gestisci_chiusure.js (righe 147-221) ----
function getSingleDayClosureReason(
  checkDate,
  data,
  unifiedFerieDates,
  unifiedFerieDatesNextYear = null,
) {
  const annoCorrente = checkDate.getFullYear();
  const { pasqua, pasquetta } = getDatePasquali(annoCorrente);

  const festivitaComplete = [...(data.festivita || []), pasqua, pasquetta];

  const dataFormattata = formatDateDM(new Date(checkDate));

  // 1. Festività
  if (festivitaComplete.includes(dataFormattata)) {
    return { reason: "festivita", dataChiusura: dataFormattata };
  }

  // 2. Chiusure anno corrente
  if (unifiedFerieDates.has(dataFormattata)) {
    const { motiviMap } = _buildChiusureMap(data, annoCorrente);
    const fineChiusura = findConsecutiveClosureEnd(
      new Date(checkDate),
      unifiedFerieDates,
      motiviMap,
    );
    const motivo = motiviMap.get(dataFormattata) || "Ferie";
    return {
      reason: "ferie",
      dataChiusura: fineChiusura,
      motivoSpecifico: motivo,
    };
  }

  // 3. Chiusure anno successivo (periodi a cavallo d'anno)
  if (
    unifiedFerieDatesNextYear &&
    unifiedFerieDatesNextYear.has(dataFormattata)
  ) {
    const { motiviMap } = _buildChiusureMap(data, annoCorrente + 1);
    const fineChiusura = findConsecutiveClosureEnd(
      new Date(checkDate),
      unifiedFerieDatesNextYear,
      motiviMap,
    );
    const motivo = motiviMap.get(dataFormattata) || "Ferie";
    return {
      reason: "ferie",
      dataChiusura: fineChiusura,
      motivoSpecifico: motivo,
    };
  }

  return null;
}

// ── Raccoglie TUTTE le chiusure future (ferie + festività + Pasqua) ──────────
//
// Restituisce un array ordinato per data di inizio di oggetti:
//   {
//     tipo:    "attiva" | "imminente",
//     label:   "Ferie" | "Festività" | nome motivo,
//     inizio:  Date,
//     fine:    Date,     // stesso giorno per giornate singole
//     inizioFmt: "DD/MM",
//     fineFmt:   "DD/MM",
//     giorni:  number,   // giorni mancanti all'inizio (0 = oggi)
//     isSingleDay: bool
//   }
//
// Parametri:
//   data          — oggetto JSON footer
//   oggiReal      — Date di riferimento
//   maxFuturedays — quanti giorni nel futuro considerare (default: 365)
// ─────────────────────────────────────────────────────────────────────────────
