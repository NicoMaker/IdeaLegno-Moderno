// ---- estratto da JS/footer/Gestisci_chiusure.js (righe 86-90) ----
function getUnifiedFerieDates(data, year) {
  const { dateSet } = _buildChiusureMap(data, year);
  return dateSet;
}

