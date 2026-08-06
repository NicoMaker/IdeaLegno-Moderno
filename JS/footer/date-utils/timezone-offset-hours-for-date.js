// ---- estratto da JS/footer/date-utils.js (righe 109-116) ----
function getTimezoneOffsetHoursForDate(refInstant) {
  const d = refInstant || new Date();
  const shopOffset = getShopOffsetMinutesForDate(d);
  const userOffset = -d.getTimezoneOffset();
  return (shopOffset - userOffset) / 60;
}

// Differenza in ore tra il fuso dell'attività e quello del visitatore, adesso
