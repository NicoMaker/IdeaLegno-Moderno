// ---- estratto da JS/footer/creazione_html.js (righe 1-10) ----
// ============================================================
// creazione_html.js — Costruzione HTML del footer
// ============================================================

function getWhatsappURL(contatti) {
  if (!contatti || !contatti.telefono) return null;
  const numSoloCifre = contatti.telefono.replace(/[^\d]/g, "");
  return `https://wa.me/${numSoloCifre}`;
}
