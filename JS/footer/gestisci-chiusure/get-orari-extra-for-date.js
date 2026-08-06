// ---- estratto da JS/footer/Gestisci_chiusure.js (righe 103-118) ----
function getOrariExtraForDate(data, dataFormattata, dayOfWeek) {
  const orariExtra = data.orariExtra || [];
  const nomiGiorni = data.nomiGiorni;

  for (const item of orariExtra) {
    if (item.giorno === dataFormattata && item.orari) {
      const motivoTesto =
        item.motivo === "" || item.motivo == null ? "" : ` (${item.motivo})`;
      return `${nomiGiorni[dayOfWeek]}: ${item.orari}${motivoTesto}`;
    }
  }
  return null;
}

// ── Fine chiusura consecutiva (si ferma se cambia il motivo) ─

