// ---- estratto da JS/footer/date-utils.js (righe 55-71) ----
function getShopOffsetMinutesForDate(refInstant) {
  const now = refInstant || new Date();
  const o = _shopParts(now);
  let h = Number.parseInt(o.hour, 10);
  if (h === 24) h = 0;
  const asUTC = Date.UTC(
    Number.parseInt(o.year, 10),
    Number.parseInt(o.month, 10) - 1,
    Number.parseInt(o.day, 10),
    h,
    Number.parseInt(o.minute, 10),
    Number.parseInt(o.second, 10),
  );
  return (asUTC - now.getTime()) / 60000;
}

// Offset (in minuti) del fuso dell'attività rispetto a UTC, adesso
