// ---- estratto da JS/footer/date-utils.js (righe 332-407) ----
function getStagioneAttivaConDate(data, dataRiferimento) {
  const stagioni = data.orariStagionali || [];
  if (!stagioni.length) return null;

  const ref = dataRiferimento || getShopNow();
  const oggi = new Date(ref);
  oggi.setHours(0, 0, 0, 0);
  const anno = oggi.getFullYear();

  // Controlla anni corrente e adiacenti per gestire cavallo d'anno
  for (const offset of [-1, 0, 1]) {
    const a = anno + offset;
    const date = getDateCambioStagione(a);

    // Stagione Estiva: inizioEstivo(a) → fineEstivo(a)
    const stagEstiva = stagioni.find(
      (s) => s.nome && s.nome.toLowerCase() === "estivo",
    );
    if (stagEstiva) {
      const ini = new Date(date.inizioEstivo);
      ini.setHours(0, 0, 0, 0);
      const fin = new Date(date.fineEstivo);
      fin.setHours(0, 0, 0, 0);
      if (oggi >= ini && oggi <= fin) {
        return { stagione: stagEstiva, annoInizio: a, annoFine: a };
      }
    }

    // Stagione Invernale: inizioInvernale(a) → fineInvernale(a+1)
    const stagInvernale = stagioni.find(
      (s) => s.nome && s.nome.toLowerCase() === "invernale",
    );
    if (stagInvernale) {
      const ini = new Date(date.inizioInvernale);
      ini.setHours(0, 0, 0, 0);
      const dateNext = getDateCambioStagione(a + 1);
      const fin = new Date(dateNext.fineInvernale);
      fin.setHours(0, 0, 0, 0);
      if (oggi >= ini && oggi <= fin) {
        return { stagione: stagInvernale, annoInizio: a, annoFine: a + 1 };
      }
    }
  }

  // Fallback: nessun match (non dovrebbe succedere con Estivo+Invernale completi)
  // Usa la stagione il cui inizio è più recente prima di oggi
  const valide = stagioni.filter((s) => s.orari);
  if (!valide.length) return null;

  // Prova a trovare quella più vicina
  let best = null;
  let bestDelta = Infinity;

  for (const stagione of valide) {
    const isEstivo = stagione.nome && stagione.nome.toLowerCase() === "estivo";
    for (const offset of [-1, 0, 1]) {
      const a = anno + offset;
      const date = getDateCambioStagione(a);
      const ini = isEstivo ? date.inizioEstivo : date.inizioInvernale;
      const dataInizio = new Date(ini);
      dataInizio.setHours(0, 0, 0, 0);
      const delta = oggi.getTime() - dataInizio.getTime();
      if (delta >= 0 && delta < bestDelta) {
        bestDelta = delta;
        const annoFine = isEstivo ? a : a + 1;
        best = { stagione, annoInizio: a, annoFine };
      }
    }
  }

  return best;
}

// ============================================================
// Wrapper per compatibilità: restituisce solo la stagione
// ============================================================
