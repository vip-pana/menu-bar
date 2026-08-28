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
    ingredients: 'Campari, vermouth rosso, soda, arancia' },
  { name: 'Negroni',                  emoji: '🍸', category: 'Aperitivi',
    ingredients: 'Gin, Campari, vermouth rosso, arancia' },
  { name: 'Negroni sbagliato',        emoji: '🥂', category: 'Aperitivi',
    ingredients: 'Campari, vermouth rosso, spumante, arancia' },
  { name: 'Milano-Torino',            emoji: '🧡', category: 'Aperitivi',
    ingredients: 'Vermouth rosso, Campari, arancia' },
  // Sour
  { name: 'Whisky Sour',              emoji: '🥃', category: 'Sour',
    ingredients: 'Bourbon, limone, sciroppo di zucchero, albume' },
  { name: 'Fireman Sour',             emoji: '🔥', category: 'Sour',
    ingredients: 'Rum bianco, lime, sciroppo di granatina, albume' },
  { name: 'Blood orange Whisky sour', emoji: '🩸', category: 'Sour',
    ingredients: 'Whisky, arancia rossa, limone, sciroppo di zucchero, albume' },
  // Highball & Long drinks
  { name: 'Gin Tonic',                emoji: '🍹', category: 'Highball & Long drinks',
    ingredients: 'Gin, acqua tonica, lime' },
  { name: 'Gin Fizz',                 emoji: '🍋', category: 'Highball & Long drinks',
    ingredients: 'Gin, limone, sciroppo di zucchero, soda' },
  { name: 'Tom Collins',              emoji: '🥤', category: 'Highball & Long drinks',
    ingredients: 'Gin, limone, sciroppo di zucchero, soda' },
  { name: 'Moscow Mule',              emoji: '🫚', category: 'Highball & Long drinks',
    ingredients: 'Vodka, lime, ginger beer, angostura, menta, zenzero' },
  { name: 'Cuba Libre',               emoji: '🥤', category: 'Highball & Long drinks',
    ingredients: 'Rum bianco, cola, lime' },
]

// Emoji proposte nel form "Aggiungi bevanda".
export const EMOJI_CHOICES = [
  '🍹', '🍸', '🍺', '🍷', '🥂', '🍾', '🥃', '🍶',
  '🥤', '🧃', '💧', '☕', '🍊', '🍋', '🌿', '🧡',
]

export const DEFAULT_EMOJI = '🥤'
