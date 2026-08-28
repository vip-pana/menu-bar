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
  { name: 'Americano',                emoji: '🍊', category: 'Aperitivi' },
  { name: 'Negroni',                  emoji: '🍸', category: 'Aperitivi' },
  { name: 'Negroni sbagliato',        emoji: '🥂', category: 'Aperitivi' },
  { name: 'Milano-Torino',            emoji: '🧡', category: 'Aperitivi' },
  // Sour
  { name: 'Whisky Sour',              emoji: '🥃', category: 'Sour' },
  { name: 'Fireman Sour',             emoji: '🔥', category: 'Sour' },
  { name: 'Blood orange Whisky sour', emoji: '🩸', category: 'Sour' },
  // Highball & Long drinks
  { name: 'Gin Tonic',                emoji: '🍹', category: 'Highball & Long drinks' },
  { name: 'Gin Fizz',                 emoji: '🍋', category: 'Highball & Long drinks' },
  { name: 'Tom Collins',              emoji: '🥤', category: 'Highball & Long drinks' },
  { name: 'Moscow Mule',              emoji: '🫚', category: 'Highball & Long drinks' },
  { name: 'Cuba Libre',               emoji: '🥤', category: 'Highball & Long drinks' },
]

// Emoji proposte nel form "Aggiungi bevanda".
export const EMOJI_CHOICES = [
  '🍹', '🍸', '🍺', '🍷', '🥂', '🍾', '🥃', '🍶',
  '🥤', '🧃', '💧', '☕', '🍊', '🍋', '🌿', '🧡',
]

export const DEFAULT_EMOJI = '🥤'
