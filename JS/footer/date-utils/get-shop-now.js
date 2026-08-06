// ---- estratto da JS/footer/date-utils.js (righe 79-101) ----
function getShopNow() {
  if (typeof TEST_DATE !== "undefined" && TEST_DATE) {
    return new Date(TEST_DATE);
  }
  try {
    const o = _shopParts(new Date());
    let h = Number.parseInt(o.hour, 10);
    if (h === 24) h = 0;
    return new Date(
      Number.parseInt(o.year, 10),
      Number.parseInt(o.month, 10) - 1,
      Number.parseInt(o.day, 10),
      h,
      Number.parseInt(o.minute, 10),
      Number.parseInt(o.second, 10),
      0,
    );
  } catch (e) {
    return new Date(); // fallback legacy se Intl non disponibile
  }
}

// "Adesso" nel fuso del visitatore (per mostrargli la sua ora)
