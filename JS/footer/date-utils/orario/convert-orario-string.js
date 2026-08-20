// ---- estratto da JS/footer/date-utils.js (righe 132-164) ----
function convertOrarioString(orarioStr, diffHours, baseDate, nomiGiorni) {
  if (Math.abs(diffHours) < 0.01) return orarioStr;
  const deltaMin = Math.round(diffHours * 60);

  return orarioStr.replace(/(\d{1,2}):(\d{2})/g, (match, hh, mm) => {
    const totale = Number(hh) * 60 + Number(mm) + deltaMin;
    const shift = Math.floor(totale / 1440); // -1 = giorno prima, +1 = giorno dopo
    const wrapped = ((totale % 1440) + 1440) % 1440;
    const nh = Math.floor(wrapped / 60);
    const nm = wrapped % 60;

    let s = `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}`;

    if (shift !== 0) {
      if (baseDate && nomiGiorni) {
        const d = new Date(baseDate);
        d.setDate(d.getDate() + shift);
        const nome = nomiGiorni[d.getDay()];
        // Es. "Mercoledì alle 05:00" quando l'orario finisce in un altro giorno
        if (nome) s = `${nome} alle ${s}`;
        else s += shift > 0 ? `(+${shift}g)` : `(${shift}g)`;
      } else {
        s += shift > 0 ? `(+${shift}g)` : `(${shift}g)`;
      }
    }
    return s;
  });
}

// Compone la riga orario con le etichette che chiariscono quale blocco è
// l'ora dell'attività e quale l'ora locale del visitatore.
//   testoBase        → orario nel fuso dell'attività (es. "Domenica: 09:00 - 22:00")
//   orarioConvertito → stesso orario convertito nel fuso del visitatore
