// ---- estratto da JS/footer/date-utils.js (righe 276-296) ----
function ultimaDomenica(anno, mese) {
  const ultimo = new Date(anno, mese, 0, 0, 0, 0, 0);
  while (ultimo.getDay() !== 0) {
    ultimo.setDate(ultimo.getDate() - 1);
  }
  return ultimo;
}

// ============================================================
// Date di cambio stagione per un dato anno.
// I mesi di cambio si leggono da data.cambioStagione nel JSON:
//   { "meseEstivo": 3, "meseInvernale": 10 }
// Se assenti, si usano i valori di default (marzo=3, ottobre=10).
//
//   inizioEstivo    = ultima domenica del mese estivo
//   fineEstivo      = sabato prima dell'ultima domenica del mese invernale
//   inizioInvernale = ultima domenica del mese invernale
//   fineInvernale   = sabato prima dell'ultima domenica del mese estivo
// ============================================================

// Cache globale dei mesi (viene popolata al primo uso)
