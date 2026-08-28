// Frasi che ruotano al posto del titolo, a ogni caricamento della pagina.
// Sono meme interni: vanno lasciate esattamente come sono scritte.
export const PHRASES = [
  'Daus',
  'Ongolo',
  'Cinghiate sul Membro (MI)',
  'Baddie',
  'Baarrggghhh',
  'Dc',
  'Escape',
  'MOR TA',
  'Ma totalee',
  'A POCO DAUS',
]

export function randomPhrase() {
  return PHRASES[Math.floor(Math.random() * PHRASES.length)]
}
