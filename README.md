# 🍹 Menu Bar

Micro-app per ordinare da bere a una festa. Gli ospiti scelgono dal menu e
inviano l'ordine con il proprio nome; il barista vede la coda in tempo reale
su un tablet e segna gli ordini come fatti.

Niente pagamenti, niente login, niente carrello persistente: solo ordini.

## Come funziona

```
Ospite (telefono)          Firebase RTDB           Barista (tablet)
  /#/       ─ push ─►      /orders/{id}   ◄─ live ──  /#/barista
                                          ─ update ─►
```

- `#/`         → menu ospite
- `#/barista`  → bancone (URL "segreto", nessuna password)

## Setup

1. Crea un progetto su [Firebase](https://console.firebase.google.com/) e
   abilita **Realtime Database**.
2. Copia le rules da [`database.rules.json`](database.rules.json).
3. Configura le variabili:

   ```bash
   cp .env.example .env.local
   # incolla i valori dal tuo progetto Firebase
   npm install
   npm run dev
   ```

Senza `.env.local` l'app mostra una schermata che elenca le variabili mancanti.

## Menu

Il menu è hardcoded in [`src/menu.js`](src/menu.js). Per cambiarlo, edita il
file e rideploya. Gli `id` finiscono negli ordini salvati: non riusarli per
bevande diverse.

## Deploy su GitHub Pages

1. Settings → Pages → Source: **GitHub Actions**
2. Settings → Secrets and variables → Actions, aggiungi i cinque
   `VITE_FIREBASE_*`
3. Push su `main`

Se il repo non si chiama `menu-bar`, aggiorna `base` in
[`vite.config.js`](vite.config.js).

## ⚠️ Sicurezza

Le rules sono **aperte in lettura e scrittura**: chiunque abbia l'URL può
creare ordini o marcarli come fatti. È una scelta deliberata per una serata
tra amici, non un'app di produzione.

**Dopo la festa**: metti le rules a `false` o cancella il progetto Firebase.

Le chiavi `VITE_FIREBASE_*` finiscono nel bundle JS: è normale per un'app web
Firebase, la protezione reale sono le rules del database.
