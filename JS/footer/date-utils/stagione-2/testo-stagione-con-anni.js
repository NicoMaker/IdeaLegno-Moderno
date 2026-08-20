// ---- estratto da JS/footer/date-utils.js (righe 429-454) ----
function _testoStagioneConAnni(stagione, annoInizio, annoFine) {
  const nome = stagione.nome || "";
  const isEstivo = nome.toLowerCase() === "estivo";

  const dateIni = getDateCambioStagione(annoInizio);
  const dateFin = getDateCambioStagione(annoFine);

  let dataInizio, dataFine;
  if (isEstivo) {
    dataInizio = dateIni.inizioEstivo;
    dataFine = dateFin.fineEstivo;
  } else {
    dataInizio = dateIni.inizioInvernale;
    dataFine = dateFin.fineInvernale;
  }

  const strIni = `${formatDateDM(dataInizio)}/${annoInizio}`;
  const strFin = `${formatDateDM(dataFine)}/${annoFine}`;

  return `Orario ${nome}: dal ${strIni} al ${strFin}`;
}

// ============================================================
// Calcola la prossima istanza futura di una stagione
// Usata per le stagioni non attive
// ============================================================
