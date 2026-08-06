// ---- estratto da JS/footer/Gestisci_chiusure.js (righe 91-102) ----
function getMotivoChiusuraForDate(data, dataFormattata) {
  const year = getShopNow().getFullYear();
  const { motiviMap } = _buildChiusureMap(data, year);
  if (motiviMap.has(dataFormattata)) return motiviMap.get(dataFormattata);

  // Controlla anche anno precedente per periodi a cavallo d'anno
  const { motiviMap: mapPrec } = _buildChiusureMap(data, year - 1);
  return mapPrec.get(dataFormattata) || null;
}

// ── Orari Extra ──────────────────────────────────────────────

