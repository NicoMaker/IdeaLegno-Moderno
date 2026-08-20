// ---- estratto da JS/footer/date-utils.js (righe 177-206) ----
function formatTimezoneOffsetText(offsetHours, shopName) {
  const abs = Math.abs(offsetHours);
  const ore = Math.floor(abs);
  const minuti = Math.round((abs - ore) * 60);

  if (ore === 0 && minuti === 0) {
    return "Sei nello stesso fuso orario dell'attività";
  }

  let oreFinale = ore;
  let minutiFinali = minuti;
  if (minutiFinali >= 60) {
    oreFinale += 1;
    minutiFinali = 0;
  }

  let diffText = "";
  if (oreFinale > 0 && minutiFinali > 0) {
    diffText = `${oreFinale}h ${minutiFinali}m`;
  } else if (oreFinale > 0) {
    diffText = `${oreFinale} ${oreFinale === 1 ? "ora" : "ore"}`;
  } else {
    diffText = `${minutiFinali} minuti`;
  }

  const direction = offsetHours > 0 ? "avanti" : "indietro";
  return `L'attività è ${diffText} ${direction} rispetto a te`;
}

// Millisecondi alla prossima mezzanotte NELL'ORA DELL'ATTIVITÀ
