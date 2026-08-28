// Menu della festa. Per cambiarlo: edita qui e rideploya.
// Gli `id` finiscono negli ordini salvati: non riusarli per bevande diverse.
export const MENU = [
  { id: 'spritz',    name: 'Spritz',          emoji: '🧡', category: 'Cocktail' },
  { id: 'negroni',   name: 'Negroni',         emoji: '🍸', category: 'Cocktail' },
  { id: 'gintonic',  name: 'Gin Tonic',       emoji: '🍹', category: 'Cocktail' },
  { id: 'mojito',    name: 'Mojito',          emoji: '🌿', category: 'Cocktail' },
  { id: 'birra',     name: 'Birra',           emoji: '🍺', category: 'Alcolici' },
  { id: 'vino_r',    name: 'Vino rosso',      emoji: '🍷', category: 'Alcolici' },
  { id: 'vino_b',    name: 'Vino bianco',     emoji: '🥂', category: 'Alcolici' },
  { id: 'prosecco',  name: 'Prosecco',        emoji: '🍾', category: 'Alcolici' },
  { id: 'cola',      name: 'Coca Cola',       emoji: '🥤', category: 'Analcolici' },
  { id: 'aranciata', name: 'Aranciata',       emoji: '🍊', category: 'Analcolici' },
  { id: 'acqua',     name: 'Acqua',           emoji: '💧', category: 'Analcolici' },
  { id: 'analcolico',name: 'Spritz analcolico', emoji: '🍊', category: 'Analcolici' },
]

export const CATEGORIES = [...new Set(MENU.map((d) => d.category))]
