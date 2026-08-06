// ---- estratto da JS/footer/date-utils.js (righe 72-78) ----
function getShopOffsetMinutes() {
  return getShopOffsetMinutesForDate(new Date());
}

// "Adesso" nell'ora dell'attività. I getter LOCALI di questo Date
// restituiscono l'orario italiano, indipendentemente dal fuso del
// dispositivo. Rispetta l'eventuale TEST_DATE definita in config.js.
