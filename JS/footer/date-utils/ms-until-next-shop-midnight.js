// ---- estratto da JS/footer/date-utils.js (righe 207-218) ----
function msUntilNextShopMidnight() {
  const wall = getShopNow();
  const into =
    wall.getHours() * 3600000 +
    wall.getMinutes() * 60000 +
    wall.getSeconds() * 1000 +
    wall.getMilliseconds();
  let rem = 24 * 3600000 - into;
  if (rem <= 0) rem += 24 * 3600000;
  return rem + 1000;
}

