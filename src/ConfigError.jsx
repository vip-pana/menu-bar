import { missingConfig } from './firebase'

const ENV_NAME = {
  apiKey: 'VITE_FIREBASE_API_KEY',
  authDomain: 'VITE_FIREBASE_AUTH_DOMAIN',
  databaseURL: 'VITE_FIREBASE_DATABASE_URL',
  projectId: 'VITE_FIREBASE_PROJECT_ID',
  appId: 'VITE_FIREBASE_APP_ID',
}

export default function ConfigError() {
  return (
    <div className="min-h-dvh flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-2xl bg-ink-raised border border-amber-400/40 p-6">
        <h1 className="text-xl font-bold mb-2">Firebase non configurato ⚙️</h1>
        <p className="text-frost-dim text-sm mb-4">
          Crea un file <code className="text-amber-300">.env.local</code> nella
          root del progetto (copia <code className="text-amber-300">.env.example</code>)
          e riavvia <code className="text-amber-300">npm run dev</code>.
        </p>
        <p className="text-frost-dim text-sm mb-2">Mancano queste variabili:</p>
        <ul className="space-y-1">
          {missingConfig.map((k) => (
            <li key={k} className="text-sm font-mono text-amber-300">
              {ENV_NAME[k] || k}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
