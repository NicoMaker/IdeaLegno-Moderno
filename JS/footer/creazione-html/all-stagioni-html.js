// ---- estratto da JS/footer/creazione_html.js (righe 11-61) ----
function getAllStagioniHTML(data, dataRiferimento) {
  const stagioni = data.orariStagionali || [];
  if (!stagioni.length)
    return `<div id="descrizione-stagione" style="display:none;"></div>`;

  const ref = dataRiferimento || new Date();
  const stagioneAttivaResult = getStagioneAttivaConDate(data, ref);
  const stagioneAttiva = stagioneAttivaResult
    ? stagioneAttivaResult.stagione
    : null;

  const valide = stagioni.filter(function (s) {
    return s.nome && s.orari;
  });
  const attive = valide.filter(function (s) {
    return stagioneAttiva && s.nome === stagioneAttiva.nome;
  });
  const nonAttive = valide.filter(function (s) {
    return !stagioneAttiva || s.nome !== stagioneAttiva.nome;
  });

  function _riga(s, isAttiva) {
    let annoInizio, annoFine;
    if (isAttiva && stagioneAttivaResult) {
      annoInizio = stagioneAttivaResult.annoInizio;
      annoFine = stagioneAttivaResult.annoFine;
    } else {
      const prossima = _getProssimaIstanzaStagione(s, ref);
      annoInizio = prossima.annoInizio;
      annoFine = prossima.annoFine;
    }
    const testo = _testoStagioneConAnni(s, annoInizio, annoFine);
    return `<div style="${isAttiva ? "font-weight:bold;" : "opacity:0.65;"}">${testo}</div>`;
  }

  var righe = [];
  for (var i = 0; i < attive.length; i++) {
    righe.push(_riga(attive[i], true));
  }
  for (var i = 0; i < nonAttive.length; i++) {
    righe.push(_riga(nonAttive[i], false));
  }

  return `<div id="descrizione-stagione" style="margin-top:14px;font-size:0.85em;">${righe.join("")}</div>`;
}

// ── Genera HTML per le chiusure programmate nel footer ──────────────────────
// Mostra:
//   - se c'è una chiusura ATTIVA → banner rosso con i dettagli
//   - poi le 2 prossime chiusure imminenti (ferie + festività + Pasqua)
// ─────────────────────────────────────────────────────────────────────────────
