// ─────────────────────────────────────────────────────────────────────────────
// json-paths.js — Utility unica per calcolare i path dei JSON
// Uso:
//   JsonPaths.get("Contenuti/progetti.json")  -> "JSON/Contenuti/progetti.json" oppure "../../JSON/Contenuti/progetti.json"
//   JsonPaths.get("Config/footer.json")       -> "JSON/Config/footer.json"      oppure "../../JSON/Config/footer.json"
//   JsonPaths.get("Config/palette.json")      -> "JSON/Config/palette.json"     oppure "../../JSON/Config/palette.json"
// ─────────────────────────────────────────────────────────────────────────────

const JsonPaths = (() => {
  const isInProjectsSubfolder = () =>
    window.location.pathname.includes("/Projects/");

  function get(jsonFilename) {
    if (!jsonFilename) throw new Error("JsonPaths.get: filename mancante");
    const prefix = isInProjectsSubfolder() ? "../../JSON/" : "JSON/";
    return `${prefix}${jsonFilename}`;
  }

  return { get, isInProjectsSubfolder };
})();
