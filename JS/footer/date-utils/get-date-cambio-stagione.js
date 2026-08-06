// ---- estratto da JS/footer/date-utils.js (righe 307-331) ----
function getDateCambioStagione(anno) {
  const ultimaDomEstivo = ultimaDomenica(anno, _meseEstivo);
  const ultimaDomInvernale = ultimaDomenica(anno, _meseInvernale);
  const ultimaDomMarzo = ultimaDomEstivo;
  const ultimaDomOttobre = ultimaDomInvernale;

  const fineEstivo = new Date(ultimaDomOttobre);
  fineEstivo.setDate(fineEstivo.getDate() - 1); // sabato prima

  const fineInvernale = new Date(ultimaDomMarzo);
  fineInvernale.setDate(fineInvernale.getDate() - 1); // sabato prima

  return {
    inizioEstivo: ultimaDomMarzo,
    fineEstivo: fineEstivo,
    inizioInvernale: ultimaDomOttobre,
    fineInvernale: fineInvernale,
  };
}

// ============================================================
// Determina la stagione attiva in base alla data fornita.
// Cerca tra le stagioni del JSON abbinando per nome "Estivo"/"Invernale".
// Restituisce: { stagione, annoInizio, annoFine } oppure null.
// ============================================================
