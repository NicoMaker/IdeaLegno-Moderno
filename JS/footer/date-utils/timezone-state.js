// ---- estratto da JS/footer/date-utils.js (righe 1-26) ----
// ============================================================
// date-utils.js — Utility per date, formattazione e stagioni
// Le date di cambio stagione sono gestite qui, NON nel JSON.
// Estivo:   dall'ultima domenica di marzo → al sabato prima dell'ultima domenica di ottobre
// Invernale: dall'ultima domenica di ottobre → al sabato prima dell'ultima domenica di marzo
// ============================================================

// ============================================================
// GESTIONE FUSO ORARIO (stessa logica della Macelleria da Ketti)
// ------------------------------------------------------------
// Gli orari sono definiti nell'ora dell'attività (Europe/Rome).
// Il dispositivo del visitatore può avere un fuso diverso: senza
// correzione, "aperto/chiuso", stagione, festività e countdown
// verrebbero calcolati sull'ora sbagliata.
//
// - Il fuso si legge da data.timezone (default "Europe/Rome").
// - getShopNow() = "adesso" nell'ora dell'attività; i suoi getter
//   locali (getHours/getDay/...) restituiscono l'orario italiano,
//   così il resto del codice funziona senza modifiche.
// - getTimezoneOffsetHours()/formatTimezoneOffsetText() servono a
//   mostrare al visitatore lo scarto rispetto al suo fuso.
// - convertOrarioString() converte gli orari nel fuso del visitatore.
// ============================================================

let _shopTimezone = "Europe/Rome";

