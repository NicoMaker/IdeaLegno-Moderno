# IdeaLegno — Sito Modernizzato

Il sito è stato ristrutturato seguendo la stessa architettura del sito "Macelleria da Ketti",
mantenendo tutti i dati, le immagini e le pagine di IdeaLegno.

## Struttura

```
IdeaLegno/
├── index.html                  ← Home page (hero, storia, progetti, riconoscimenti, contatti)
├── NewsLetter.html             ← Newsletter (invariata)
├── CNAME / LICENSE             ← Invariati
├── LEGGIMI.md                  ← Questo file
│
├── CSS/
│   ├── styles.css              ← Stili principali (tema "Ash Wood")
│   ├── custom-styles.css       ← Stili sezioni e card
│   ├── modern.css              ← Animazioni moderne
│   ├── product-page.css        ← Pagine di dettaglio progetto
│   ├── category-colors.css     ← Badge categorie
│   ├── idealegno-extra.css     ← Riconoscimenti + cookie banner
│   └── extra-animations.css    ← Layer animazioni avanzate
│
├── JS/
│   ├── shared/                 ← json-paths, json-config, app-config, json-loader, category-colors
│   ├── data/                   ← caricamento progetti (evento "prodottiCaricati")
│   ├── products/               ← progetti.js (griglia+filtri+ricerca)
│   ├── product/                ← slider.js, product-page.js (badge automatici)
│   ├── footer/                 ← footer dinamico: orari, stato apertura, chiusure, mappa
│   └── ui/                     ← menu mobile, animazioni, sticky controls, breadcrumb,
│                                  banner chiusure hero, cookie banner
│
├── JSON/                       ← ★ TUTTI I DATI MODIFICABILI QUI ★
│   ├── progetti.json           ← Elenco progetti (nome, descrizione, immagine, categorie,
│   │                              link alla pagina di dettaglio)
│   ├── footer.json             ← Contatti, P.IVA, indirizzo, coordinate mappa, orari,
│   │                              festività, chiusure/ferie, social
│   └── palette.json            ← Colori automatici dei badge categoria
│
├── Projects/
│   ├── *.html                  ← 15 pagine di dettaglio (una per progetto, solo galleria)
│   └── Img/                    ← Tutte le foto dei progetti (invariate)
│
├── Img/                        ← Logo e immagini generali (hero, storia)
├── News/Img/                   ← Riconoscimenti (Premiazioni 2024)
├── Contact/Img/                ← Icone contatti (conservate)
└── Cookies/                    ← Cookie policy + gestione preferenze
```

## Animazioni

Il sito ha due motori di animazione (`JS/ui/modern-animations.js` + `JS/ui/extra-animations.js`):

- Hero cinematografica: zoom lento, titolo che appare lettera per lettera,
  typewriter "per la tua casa / il tuo negozio / il tuo yacht",
  particelle di segatura dorata (canvas leggero, attivo solo quando la hero è visibile)
- Reveal allo scroll di tutte le sezioni e card (con effetto a cascata)
- Tilt 3D con riflesso al passaggio del mouse sulle card progetto
- Bottoni "magnetici" che seguono il cursore + effetto ripple al click
- Contatori animati nella sezione Storia (anni, progetti, settori)
- Cursore personalizzato con anello che si allarga sugli elementi cliccabili (solo desktop)
- Header che si compatta + barra di progresso lettura + pulsanti flottanti
  WhatsApp / telefono / torna su
- Parallasse su hero e immagini, transizioni fluide tra le pagine,
  slider progetti con dissolvenza, menu mobile a cascata, badge Novità pulsante

Tutte le animazioni rispettano `prefers-reduced-motion`: se l'utente ha ridotto
il movimento nel sistema operativo, il sito resta perfettamente leggibile senza effetti.

## Come modificare i contenuti

- **Aggiungere/modificare un progetto** → `JSON/progetti.json`
  (per la pagina di dettaglio: duplica una pagina in `Projects/`, cambia titolo e immagini).
- **Orari, ferie, festività, contatti, mappa** → `JSON/footer.json`
  (il footer mostra automaticamente lo stato Aperto/Chiuso/In chiusura e le prossime chiusure;
  le coordinate della mappa sono indicative: correggile in `mappa.latitudine/longitudine`).
- **Chiusure per ferie** → in `footer.json`, sezione `chiusure`, es.
  `{ "tipo": "periodo", "inizio": "10/08", "fine": "20/08", "motivo": "Ferie estive" }`
  → appare sia nel footer sia come banner rosso nella hero.

## Nota

Il sito carica i dati via `fetch`: per provarlo in locale serve un piccolo server
(es. `python3 -m http.server` nella cartella del sito), come per il sito della Macelleria.
