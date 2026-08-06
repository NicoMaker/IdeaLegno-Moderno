// ---- estratto da JS/footer/date-utils.js (righe 34-54) ----
function _shopParts(instant) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: _shopTimezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const obj = {};
  formatter.formatToParts(instant).forEach((p) => {
    obj[p.type] = p.value;
  });
  return obj;
}

// Offset (in minuti) del fuso dell'attività rispetto a UTC per un dato istante.
// Passare un istante specifico serve per gestire correttamente i cambi di ora
// legale sui giorni futuri.
