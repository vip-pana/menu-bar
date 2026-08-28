// Menu di PARTENZA (seed).
//
// La verita' a runtime e' il nodo /menu su Firebase: il barista lo modifica dal
// bancone. Questo array viene scritto sul DB solo la prima volta, quando /menu
// e' ancora vuoto (vedi seedIfEmpty in useMenu.js).
//
// Editare qui NON cambia il menu di una festa gia' avviata: per quello si usa
// la sezione "Menu" nella pagina /#/barista.
export const SEED_MENU = [
  { name: 'Spritz',            emoji: '🧡', category: 'Cocktail' },
  { name: 'Negroni',           emoji: '🍸', category: 'Cocktail' },
  { name: 'Gin Tonic',         emoji: '🍹', category: 'Cocktail' },
  { name: 'Mojito',            emoji: '🌿', category: 'Cocktail' },
  { name: 'Birra',             emoji: '🍺', category: 'Alcolici' },
  { name: 'Vino rosso',        emoji: '🍷', category: 'Alcolici' },
  { name: 'Vino bianco',       emoji: '🥂', category: 'Alcolici' },
  { name: 'Prosecco',          emoji: '🍾', category: 'Alcolici' },
  { name: 'Coca Cola',         emoji: '🥤', category: 'Analcolici' },
  { name: 'Aranciata',         emoji: '🍊', category: 'Analcolici' },
  { name: 'Acqua',             emoji: '💧', category: 'Analcolici' },
  { name: 'Spritz analcolico', emoji: '🍊', category: 'Analcolici' },
]

// Emoji proposte nel form "Aggiungi bevanda".
export const EMOJI_CHOICES = [
  '🍹', '🍸', '🍺', '🍷', '🥂', '🍾', '🥃', '🍶',
  '🥤', '🧃', '💧', '☕', '🍊', '🍋', '🌿', '🧡',
]

export const DEFAULT_EMOJI = '🥤'
