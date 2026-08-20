// ---- estratto da JS/footer/date-utils.js (righe 117-131) ----
function getTimezoneOffsetHours() {
  return getTimezoneOffsetHoursForDate(new Date());
}

// Converte gli orari testuali (HH:MM) nel fuso del visitatore.
// - Lavora in MINUTI totali → i fusi con mezz'ora (es. +5:30) sono corretti.
// - Se un orario scavalca la mezzanotte e vengono passati baseDate + nomiGiorni,
//   l'orario viene scritto col NOME del giorno reale (es. "Mercoledì alle 05:00").
//   Se baseDate/nomiGiorni non ci sono, ripiega sul marcatore (+1g)/(-1g).
//
// Parametri:
//   orarioStr  — stringa con gli orari (es. "09:00 - 22:00")
//   diffHours  — differenza in ore da applicare (può essere frazionaria)
//   baseDate   — (opzionale) Date del giorno a cui appartengono gli orari
//   nomiGiorni — (opzionale) array nomi giorni indicizzato come getDay() (0 = Domenica)
