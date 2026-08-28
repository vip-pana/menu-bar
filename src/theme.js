// Accenti che ruotano a ogni caricamento della pagina ospite.
//
// Ogni terna e' "R G B" (numeri separati da spazio, non esadecimale): serve
// perche' Tailwind li usa come rgb(var(--volt) / <alpha-value>), e cosi'
// continuano a funzionare le varianti tipo bg-volt/15 o border-volt/50.
//
// Vincoli rispettati da tutti:
//  - almeno 4.5:1 su ink-base (#07090F): la festa e' al buio
//  - il testo scuro sul bottone pieno resta leggibile
//  - niente rosso puro (= errore) ne' verde puro (= ordine pronto)
export const THEMES = [
  { name: 'cyan',    base: '34 211 238',  soft: '103 232 249', deep: '8 145 178'   },
  { name: 'magenta', base: '232 121 249', soft: '240 171 252', deep: '162 28 175'  },
  { name: 'lime',    base: '163 230 53',  soft: '190 242 100', deep: '101 163 13'  },
  { name: 'arancio', base: '251 146 60',  soft: '253 186 116', deep: '194 65 12'   },
  { name: 'viola',   base: '167 139 250', soft: '196 181 253', deep: '109 40 217'  },
  { name: 'rosa',    base: '244 114 182', soft: '249 168 212', deep: '190 24 93'   },
  { name: 'giallo',  base: '250 204 21',  soft: '253 224 71',  deep: '161 98 7'    },
  { name: 'acqua',   base: '45 212 191',  soft: '94 234 212',  deep: '15 118 110'  },
  { name: 'corallo', base: '255 138 128', soft: '255 171 164', deep: '190 55 45'   },
  { name: 'azzurro', base: '96 165 250',  soft: '147 197 253', deep: '29 78 216'   },
  { name: 'lavanda', base: '216 180 254', soft: '233 213 255', deep: '126 34 206'  },
  { name: 'pesca',   base: '253 186 116', soft: '254 215 170', deep: '180 83 9'    },
  { name: 'indaco',  base: '129 140 248', soft: '165 180 252', deep: '67 56 202'   },
  { name: 'fucsia',  base: '240 80 180',  soft: '246 145 208', deep: '157 23 108'  },
  { name: 'oro',     base: '253 230 138', soft: '254 240 190', deep: '161 98 7'    },
  // L'arcobaleno: `rainbow` accende i gradienti su titolo e superfici piene.
  // base/soft/deep restano una tinta solida di ripiego, perche' bordi, ombre e
  // colori con opacita' hanno bisogno di un colore singolo, non di un gradiente.
  {
    name: 'rainbow',
    base: '255 106 193', soft: '255 170 220', deep: '190 24 93',
    rainbow: 'linear-gradient(100deg,#FF5F6D,#FFC371,#F9F871,#5EE7A0,#4FC3F7,#B388FF,#FF5F6D)',
  },
]

export function randomTheme() {
  return THEMES[Math.floor(Math.random() * THEMES.length)]
}

// Scrive le variabili sul root: da li' le leggono sia Tailwind che il CSS
// scritto a mano (gradiente di fondo, glow, coriandoli).
export function applyTheme(theme) {
  const r = document.documentElement.style
  r.setProperty('--volt', theme.base)
  r.setProperty('--volt-soft', theme.soft)
  r.setProperty('--volt-deep', theme.deep)
  if (theme.rainbow) {
    r.setProperty('--rainbow', theme.rainbow)
    document.documentElement.dataset.rainbow = 'on'
  } else {
    r.removeProperty('--rainbow')
    delete document.documentElement.dataset.rainbow
  }
}

// Rimuove le variabili inline e torna ai default cyan di :root.
// Serve al bancone: navigando dall'ospite a #/barista la SPA non ricarica,
// quindi le variabili del tema ospite resterebbero appiccicate al root.
export function resetTheme() {
  const r = document.documentElement.style
  r.removeProperty('--volt')
  r.removeProperty('--volt-soft')
  r.removeProperty('--volt-deep')
  r.removeProperty('--rainbow')
  delete document.documentElement.dataset.rainbow
}
