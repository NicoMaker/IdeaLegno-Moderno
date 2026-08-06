// ---- estratto da JS/footer/date-utils.js (righe 455-484) ----
function _getProssimaIstanzaStagione(stagione, dataRiferimento) {
  const ref = dataRiferimento || getShopNow();
  const oggi = new Date(ref);
  oggi.setHours(0, 0, 0, 0);
  const anno = oggi.getFullYear();
  const isEstivo = stagione.nome && stagione.nome.toLowerCase() === "estivo";

  for (const offset of [0, 1, 2]) {
    const a = anno + offset;
    const date = getDateCambioStagione(a);
    const ini = new Date(isEstivo ? date.inizioEstivo : date.inizioInvernale);
    ini.setHours(0, 0, 0, 0);
    if (ini.getTime() >= oggi.getTime()) {
      const annoFine = isEstivo ? a : a + 1;
      return { annoInizio: a, annoFine };
    }
  }

  return { annoInizio: anno + 1, annoFine: anno + 1 };
}

// ============================================================
// Rileva se nei prossimi 7 giorni a partire da dataRiferimento
// avviene un cambio stagione, e se sì quale.
//
// Restituisce:
//   null → nessun cambio nella settimana
//   { da: "Invernale", a: "Estivo" }   → cambio verso estivo
//   { da: "Estivo",    a: "Invernale" } → cambio verso invernale
// ============================================================
