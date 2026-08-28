// Menu di PARTENZA (seed).
//
// La verita' a runtime e' il nodo /menu su Firebase: il barista lo modifica dal
// bancone. Questo array viene scritto sul DB solo la prima volta, quando /menu
// e' ancora vuoto (vedi seedIfEmpty in useMenu.js).
//
// Editare qui NON cambia il menu di una festa gia' avviata: per quello si usa
// la sezione "Menu" nella pagina /#/barista.
export const SEED_MENU = [
  // Aperitivi / Bitter (Campari - Aperol - Vermouth)
  { name: 'Americano',                emoji: '🍊', category: 'Aperitivi',
    ingredients: 'Campari, Vermouth rosso, soda' },
  { name: 'Negroni',                  emoji: '🍸', category: 'Aperitivi',
    ingredients: 'Gin, Campari, Vermouth rosso' },
  { name: 'Negroni sbagliato',        emoji: '🥂', category: 'Aperitivi',
    ingredients: 'Campari, Vermouth rosso, spumante' },
  { name: 'Milano-Torino',            emoji: '🧡', category: 'Aperitivi',
    ingredients: 'Campari, Vermouth rosso' },
  // Sour
  { name: 'Whisky Sour',              emoji: '🥃', category: 'Sour',
    ingredients: 'Whisky, succo di limone, sciroppo di zucchero' },
  { name: 'Fireman Sour',             emoji: '🔥', category: 'Sour',
    ingredients: 'Rum, succo di limone, granatina, sciroppo di zucchero' },
  { name: 'Blood orange Whisky sour', emoji: '🩸', category: 'Sour',
    ingredients: 'Whisky, succo di arancia rossa, limone, sciroppo di zucchero' },
  // Highball & Long drinks
  { name: 'Gin Tonic',                emoji: '🍹', category: 'Highball & Long drinks',
    ingredients: 'Gin, acqua tonica' },
  { name: 'Gin Fizz',                 emoji: '🍋', category: 'Highball & Long drinks',
    ingredients: 'Gin, succo di limone, sciroppo di zucchero, soda' },
  { name: 'Tom Collins',              emoji: '🥤', category: 'Highball & Long drinks',
    ingredients: 'Gin, succo di limone, sciroppo di zucchero, soda' },
  { name: 'Moscow Mule',              emoji: '🫚', category: 'Highball & Long drinks',
    ingredients: 'Vodka, ginger beer, lime' },
  { name: 'Cuba Libre',               emoji: '🥤', category: 'Highball & Long drinks',
    ingredients: 'Rum, cola, lime' },
]

// Emoji proposte nel form "Aggiungi bevanda".
export const EMOJI_CHOICES = [
  '🍹', '🍸', '🍺', '🍷', '🥂', '🍾', '🥃', '🍶',
  '🥤', '🧃', '💧', '☕', '🍊', '🍋', '🌿', '🧡',
]

export const DEFAULT_EMOJI = '🥤'
