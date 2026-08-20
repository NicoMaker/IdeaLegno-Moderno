// ---- estratto da JS/footer/date-utils.js (righe 262-275) ----
function getDatePasquali(anno) {
  const pasqua = calcolaPasqua(anno);
  const pasquetta = new Date(pasqua);
  pasquetta.setDate(pasquetta.getDate() + 1);

  return {
    pasqua: formatDateDM(pasqua),
    pasquetta: formatDateDM(pasquetta),
  };
}

// ============================================================
// Calcola l'ultima domenica di un dato mese e anno.
// ============================================================
