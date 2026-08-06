// ---- estratto da JS/footer/creazione_html.js (righe 62-143) ----
function getClosuresHTML(data, oggiReal) {
  const oggi = oggiReal || new Date();

  // Usa la nuova funzione unificata (ferie + festività + Pasqua, 365 giorni)
  const allClosures = getAllUpcomingClosures(data, oggi, 365);

  if (!allClosures.length) return "";

  var html = "";

  // ── Chiusure attive ──
  const active = allClosures.filter(function (c) {
    return c.tipo === "attiva";
  });
  for (var i = 0; i < active.length; i++) {
    var c = active[i];
    var motivoTesto =
      c.label === "Festività"
        ? "Festività"
        : "Ferie" + (c.label !== "Ferie" ? " - " + c.label : "");
    html += '<div class="footer-closure-alert">';
    html +=
      '<span class="material-icons">warning</span> <strong>🔴 CHIUSO - ' +
      motivoTesto.toUpperCase() +
      "</strong>";
    if (!c.isSingleDay) {
      html += "<br>dal " + c.inizioFmt + " al " + c.fineFmt;
    } else {
      html += "<br>" + c.inizioFmt;
    }
    html += "</div>";
  }

  // ── Prossime 2 chiusure (non ancora iniziate) ──
  const upcoming = allClosures.filter(function (c) {
    return c.tipo === "imminente";
  });
  const toShow = upcoming.slice(0, 2);

  if (toShow.length > 0) {
    html += '<div class="footer-future-closures">';
    html +=
      '<div class="footer-future-closures-title"><span>📅</span> Prossime chiusure:</div>';

    for (var j = 0; j < toShow.length; j++) {
      var c = toShow[j];
      var giorni = c.giorni;
      var giornoTesto =
        giorni === 0
          ? "oggi"
          : giorni === 1
            ? "domani"
            : "tra " + giorni + " giorni";

      if (c.isSingleDay) {
        html +=
          '<div class="footer-future-closures-item">• ' +
          c.inizioFmt +
          ": " +
          c.label +
          " (" +
          giornoTesto +
          ")</div>";
      } else {
        html +=
          '<div class="footer-future-closures-item">• ' +
          c.inizioFmt +
          " → " +
          c.fineFmt +
          ": " +
          c.label +
          " (" +
          giornoTesto +
          ")</div>";
      }
    }
    html += "</div>";
  }

  return html;
}

