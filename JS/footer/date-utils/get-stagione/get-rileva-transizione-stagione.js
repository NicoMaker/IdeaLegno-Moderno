// ---- estratto da JS/footer/date-utils.js (righe 485-534) ----
function getRilevaTransizioneStagione(data, dataRiferimento) {
  const stagioni = data.orariStagionali || [];
  if (stagioni.length < 2) return null;

  const ref = dataRiferimento || getShopNow();
  const oggi = new Date(ref);
  oggi.setHours(0, 0, 0, 0);
  const anno = oggi.getFullYear();

  const fine7gg = new Date(oggi);
  fine7gg.setDate(fine7gg.getDate() + 6);
  fine7gg.setHours(0, 0, 0, 0);

  // Helper: differenza in giorni interi (dateA - dateB)
  const diffGiorni = (dateA, dateB) =>
    Math.round((dateA.getTime() - dateB.getTime()) / (1000 * 60 * 60 * 24));

  for (const offset of [-1, 0, 1]) {
    const a = anno + offset;
    const date = getDateCambioStagione(a);

    // Cambio verso Estivo: inizioEstivo cade nei 7 giorni?
    const iniEst = new Date(date.inizioEstivo);
    iniEst.setHours(0, 0, 0, 0);
    if (iniEst >= oggi && iniEst <= fine7gg) {
      const giorni = diffGiorni(iniEst, oggi);
      return {
        da: "Invernale",
        a: "Estivo",
        giorniMancanti: giorni,
        eCambioOggi: giorni === 0,
      };
    }

    // Cambio verso Invernale: inizioInvernale cade nei 7 giorni?
    const iniInv = new Date(date.inizioInvernale);
    iniInv.setHours(0, 0, 0, 0);
    if (iniInv >= oggi && iniInv <= fine7gg) {
      const giorni = diffGiorni(iniInv, oggi);
      return {
        da: "Estivo",
        a: "Invernale",
        giorniMancanti: giorni,
        eCambioOggi: giorni === 0,
      };
    }
  }

  return null;
}
