import { useEffect, useMemo, useState } from 'react'
import { push, ref, serverTimestamp } from 'firebase/database'
import { db } from '../firebase'
import { CATEGORIES, MENU } from '../menu'
import { useOrders } from '../useOrders'

const STATUS_LABEL = {
  nuovo: 'In coda',
  in_preparazione: 'In preparazione',
  fatto: 'Pronto! Vai al bancone',
}
const STATUS_STYLE = {
  nuovo: 'bg-zinc-800 text-zinc-300',
  in_preparazione: 'bg-amber-500/20 text-amber-300',
  fatto: 'bg-emerald-500/20 text-emerald-300',
}

// Gli id degli ordini inviati da QUESTO dispositivo, per mostrarne lo stato.
function useMyOrderIds() {
  const [ids, setIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('myOrderIds') || '[]')
    } catch {
      return []
    }
  })
  const add = (id) => {
    setIds((prev) => {
      const next = [...prev, id].slice(-10)
      try {
        localStorage.setItem('myOrderIds', JSON.stringify(next))
      } catch { /* private mode: pazienza */ }
      return next
    })
  }
  return [ids, add]
}

export default function Guest() {
  const [name, setName] = useState(() => {
    try {
      return localStorage.getItem('barName') || ''
    } catch {
      return ''
    }
  })
  const [cart, setCart] = useState({})
  const [note, setNote] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(null)
  const [myIds, addMyId] = useMyOrderIds()
  const { orders } = useOrders()

  useEffect(() => {
    try {
      localStorage.setItem('barName', name)
    } catch { /* private mode: pazienza */ }
  }, [name])

  useEffect(() => {
    if (!sent) return
    const t = setTimeout(() => setSent(false), 3000)
    return () => clearTimeout(t)
  }, [sent])

  const setQty = (id, delta) =>
    setCart((prev) => {
      const qty = (prev[id] || 0) + delta
      const next = { ...prev }
      if (qty <= 0) delete next[id]
      else next[id] = Math.min(qty, 20)
      return next
    })

  const totalItems = useMemo(
    () => Object.values(cart).reduce((a, b) => a + b, 0),
    [cart],
  )
  const canSend = name.trim().length > 0 && totalItems > 0 && !sending

  const myOrders = useMemo(
    () => orders.filter((o) => myIds.includes(o.id)).slice(-5).reverse(),
    [orders, myIds],
  )

  async function submit() {
    if (!canSend) return
    setSending(true)
    setError(null)
    const items = Object.entries(cart).map(([id, qty]) => ({
      id,
      name: MENU.find((d) => d.id === id)?.name ?? id,
      qty,
    }))
    try {
      const r = await push(ref(db, 'orders'), {
        name: name.trim(),
        items,
        note: note.trim(),
        status: 'nuovo',
        createdAt: serverTimestamp(),
      })
      addMyId(r.key)
      setCart({})
      setNote('')
      setSent(true)
    } catch (e) {
      setError("Ordine non inviato. Controlla la connessione e riprova.")
      console.error(e)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="px-5 pt-8 pb-4">
        <h1 className="text-3xl font-bold tracking-tight">Ordina da bere 🍹</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Scegli, scrivi il tuo nome, invia. Il barista pensa al resto.
        </p>
      </header>

      <div className="px-5">
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Il tuo nome
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Come ti chiami?"
          maxLength={40}
          className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 text-lg
                     outline-none focus:border-zinc-500 placeholder:text-zinc-600"
        />
      </div>

      {myOrders.length > 0 && (
        <section className="px-5 mt-6">
          <h2 className="text-sm font-medium text-zinc-400 mb-2">I tuoi ordini</h2>
          <ul className="space-y-2">
            {myOrders.map((o) => (
              <li
                key={o.id}
                className="flex items-center justify-between rounded-xl bg-zinc-900/60 px-4 py-3"
              >
                <span className="text-sm text-zinc-300">
                  {o.items?.map((i) => `${i.qty}× ${i.name}`).join(', ')}
                </span>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ml-3
                              ${STATUS_STYLE[o.status] || STATUS_STYLE.nuovo}`}
                >
                  {STATUS_LABEL[o.status] || o.status}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {CATEGORIES.map((cat) => (
        <section key={cat} className="mt-8">
          <h2 className="px-5 text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-3">
            {cat}
          </h2>
          <ul className="px-5 space-y-2">
            {MENU.filter((d) => d.category === cat).map((drink) => {
              const qty = cart[drink.id] || 0
              return (
                <li
                  key={drink.id}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors
                    ${qty > 0
                      ? 'bg-zinc-800/80 border-zinc-600'
                      : 'bg-zinc-900/60 border-zinc-800'}`}
                >
                  <span className="text-2xl" aria-hidden="true">{drink.emoji}</span>
                  <span className="flex-1 font-medium">{drink.name}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setQty(drink.id, -1)}
                      disabled={qty === 0}
                      aria-label={`Togli ${drink.name}`}
                      className="size-11 rounded-lg bg-zinc-800 text-xl leading-none
                                 disabled:opacity-30 active:bg-zinc-700"
                    >
                      −
                    </button>
                    <span className="w-8 text-center tabular-nums font-semibold">{qty}</span>
                    <button
                      onClick={() => setQty(drink.id, 1)}
                      aria-label={`Aggiungi ${drink.name}`}
                      className="size-11 rounded-lg bg-zinc-700 text-xl leading-none active:bg-zinc-600"
                    >
                      +
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      ))}

      <section className="px-5 mt-8 mb-4">
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Note per il barista <span className="text-zinc-600">(opzionale)</span>
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="senza ghiaccio, poco alcol…"
          rows={2}
          maxLength={200}
          className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3
                     outline-none focus:border-zinc-500 placeholder:text-zinc-600 resize-none"
        />
      </section>

      <div className="sticky bottom-0 mt-auto p-4 pt-8 bg-gradient-to-t from-zinc-950 via-zinc-950 to-transparent">
        {error && (
          <p className="text-center text-sm text-red-400 mb-2">{error}</p>
        )}
        <button
          onClick={submit}
          disabled={!canSend}
          className="w-full rounded-2xl bg-emerald-500 text-zinc-950 font-bold text-lg py-4
                     disabled:bg-zinc-800 disabled:text-zinc-600 active:bg-emerald-400 transition-colors"
        >
          {sent
            ? 'Ordine inviato! 🍹'
            : sending
              ? 'Invio…'
              : totalItems > 0
                ? `Ordina ${totalItems} ${totalItems === 1 ? 'bevanda' : 'bevande'}`
                : 'Scegli qualcosa'}
        </button>
        {!name.trim() && totalItems > 0 && (
          <p className="text-center text-xs text-amber-400 mt-2">
            Scrivi il tuo nome per inviare
          </p>
        )}
      </div>
    </div>
  )
}
