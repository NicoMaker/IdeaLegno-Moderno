// ---- estratto da JS/footer/date-utils.js (righe 165-176) ----
function formattaOrarioConFuso(testoBase, orarioConvertito) {
  const lbl =
    "font-size:0.8em;opacity:0.55;font-weight:400;letter-spacing:0.02em;";
  return (
    testoBase +
    ` <span style="${lbl}">(negozio)</span> → ` +
    orarioConvertito +
    ` <span style="${lbl}">(tua ora)</span>`
  );
}

// Testo leggibile della differenza di fuso (plurale corretto)
