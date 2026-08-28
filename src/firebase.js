import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Senza databaseURL l'SDK muore con un errore criptico e schermata bianca.
// Meglio accorgersene con un messaggio leggibile.
export const missingConfig = Object.entries(config)
  .filter(([, v]) => !v)
  .map(([k]) => k)

export const db = missingConfig.length ? null : getDatabase(initializeApp(config))
