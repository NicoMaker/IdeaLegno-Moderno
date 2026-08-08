// ---- estratto da JS/footer/Gestisci_chiusure.js (righe 1-26) ----
// ============================================================
// Gestisci_chiusure.js — Logica chiusure (ferie, festività, extra)
// Dipende da: date-utils.js
//
// Unico array "chiusure" nel JSON — due formati:
//   { "tipo": "giorno",  "data": "31/10",   "motivo": "" }
//   { "tipo": "periodo", "inizio": "12/02", "fine": "19/02", "motivo": "Pippo" }
//
// Regola motivo:
//   - stringa non vuota → viene mostrata (es. "Chiusura natalizia")
//   - stringa vuota o assente → mostra "Ferie"
//
// Regola fine chiusura:
//   - la consecutività si ferma quando il giorno successivo
//     NON è chiuso OPPURE ha un motivo DIVERSO
//
// Voci con data/inizio/fine vuoti vengono ignorate automaticamente.
// ============================================================

// ── Utility interna ──────────────────────────────────────────

function _parseDDMM(ddmm, year) {
  const [day, month] = ddmm.split("/").map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}
