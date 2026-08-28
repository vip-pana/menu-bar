import { useEffect, useMemo, useState } from 'react'
import { push, ref, remove, serverTimestamp } from 'firebase/database'
import { db } from '../firebase'
import { useMenu } from '../useMenu'
import { useOverscroll } from '../useOverscroll'
import { randomPhrase } from '../phrases'
import { useEmojiBurst } from '../EmojiBurst'
import { useOrders } from '../useOrders'

const STATUS_LABEL = {
  nuovo: 'In coda',
  in_preparazione: 'In preparazione',
  fatto: 'Pronto! Vai al bancone',
}
const STATUS_STYLE = {
  nuovo: 'bg-volt/15 text-volt-soft',
  in_preparazione: 'bg-amber-400/15 text-amber-300',
  fatto: 'bg-emerald-400/15 text-emerald-300',
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
  const persist = (next) => {
    try {
      localStorage.setItem('myOrderIds', JSON.stringify(next))
    } catch { /* private mode: pazienza */ }
    return next
  }
  const add = (id) => setIds((prev) => persist([...prev, id].slice(-10)))
  const drop = (id) => setIds((prev) => persist(prev.filter((x) => x !== id)))
  return [ids, add, drop]
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
  const [confirmId, setConfirmId] = useState(null)
  const [myIds, addMyId, dropMyId] = useMyOrderIds()
  const { orders } = useOrders()
  const { menu, categories, loading: menuLoading } = useMenu()
  const { progress } = useOverscroll()
  const [phrase] = useState(randomPhrase)
  const { burst, confetti, layer } = useEmojiBurst()

  useEffect(() => {
    try {
      localStorage.setItem('barName', name)
    } catch { /* private mode: pazienza */ }
  }, [name])

  // Se una bevanda finisce (o viene eliminata) mentre l'ospite sta scegliendo,
  // toglierla dal carrello: altrimenti si ordina qualcosa che non c'e' piu'.
  useEffect(() => {
    if (menuLoading) return
    const ordinabili = new Set(menu.filter((d) => !d.soldout).map((d) => d.id))
    setCart((prev) => {
      const next = Object.fromEntries(
        Object.entries(prev).filter(([id]) => ordinabili.has(id)),
      )
      return Object.keys(next).length === Object.keys(prev).length ? prev : next
    })
  }, [menu, menuLoading])

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

  // La conferma inline si annulla da sola: evita di lasciare un bottone
  // "Confermi?" armato mentre l'ospite scorre il menu.
  useEffect(() => {
    if (!confirmId) return
    const t = setTimeout(() => setConfirmId(null), 4000)
    return () => clearTimeout(t)
  }, [confirmId])

  async function cancelOrder(id) {
    try {
      await remove(ref(db, `orders/${id}`))
      dropMyId(id)
      setConfirmId(null)
    } catch (e) {
      console.error('[orders] annullamento fallito', e)
      setError('Non sono riuscito ad annullare. Riprova.')
    }
  }

  async function submit() {
    if (!canSend) return
    setSending(true)
    setError(null)
    const items = Object.entries(cart).map(([id, qty]) => ({
      id,
      name: menu.find((d) => d.id === id)?.name ?? id,
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
      confetti()
    } catch (e) {
      setError("Ordine non inviato. Controlla la connessione e riprova.")
      console.error(e)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-dvh flex flex-col">
      {layer}

      <header className="px-5 pt-10 pb-5">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tighter leading-[1.05] text-balance">
          <span className="text-volt [text-shadow:0_0_24px_rgba(34,211,238,.55)]">
            {phrase}
          </span>
        </h1>
        <p className="mt-3 text-frost-dim font-medium uppercase tracking-[0.2em] text-xs">
          Ordina da bere
        </p>
        <p className="text-frost-mute text-sm mt-1.5">
          Scegli, scrivi il tuo nome, invia. Il barista pensa al resto.
        </p>
      </header>

      <div className="px-5">
        <label className="block text-sm font-medium text-frost-dim mb-2">
          Il tuo nome
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Come ti chiami?"
          maxLength={40}
          className="w-full rounded-xl bg-ink-raised border border-ink-edge px-4 py-3 text-lg
                     outline-none focus:border-volt/60 placeholder:text-frost-mute"
        />
      </div>

      {myOrders.length > 0 && (
        <section className="px-5 mt-6">
          <h2 className="text-sm font-medium text-frost-dim mb-2">I tuoi ordini</h2>
          <ul className="space-y-2">
            {myOrders.map((o) => (
              <li
                key={o.id}
                className="flex items-center gap-3 rounded-xl bg-ink-raised/70 border border-ink-edge px-4 py-3"
              >
                <span className="flex-1 min-w-0 text-sm text-frost-dim">
                  {o.items?.map((i) => `${i.qty}× ${i.name}`).join(', ')}
                </span>

                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap
                              ${STATUS_STYLE[o.status] || STATUS_STYLE.nuovo}`}
                >
                  {STATUS_LABEL[o.status] || o.status}
                </span>

                {/* Annullabile solo finche' il barista non l'ha preso in carico. */}
                {o.status === 'nuovo' &&
                  (confirmId === o.id ? (
                    <button
                      onClick={() => cancelOrder(o.id)}
                      className="rounded-lg bg-red-500/20 text-red-300 text-xs font-semibold
                                 px-3 py-2 whitespace-nowrap active:bg-red-500/30"
                    >
                      Confermi?
                    </button>
                  ) : (
                    <button
                      onClick={() => setConfirmId(o.id)}
                      aria-label="Annulla ordine"
                      className="rounded-lg bg-ink-edge text-frost-mute text-xs px-3 py-2
                                 whitespace-nowrap active:bg-ink-edge/70"
                    >
                      Annulla
                    </button>
                  ))}
              </li>
            ))}
          </ul>
        </section>
      )}

      {menuLoading && (
        <p className="px-5 mt-8 text-frost-mute">Carico il menu…</p>
      )}

      {!menuLoading && menu.length === 0 && (
        <p className="px-5 mt-8 text-frost-mute">
          Il menu è vuoto. Chiedi al barista di aggiungere qualcosa.
        </p>
      )}

      {categories.map((cat) => (
        <section key={cat} className="mt-8">
          <h2 className="px-5 text-xs font-bold uppercase tracking-[0.25em] text-volt/70 mb-3">
            {cat}
          </h2>
          <ul className="px-5 space-y-2">
            {menu.filter((d) => d.category === cat).map((drink) => {
              const qty = cart[drink.id] || 0
              const out = drink.soldout
              return (
                <li
                  key={drink.id}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors
                    ${out
                      ? 'bg-ink-raised/40 border-ink-edge/50'
                      : qty > 0
                        ? 'bg-volt/10 border-volt/50 shadow-glow-sm'
                        : 'bg-ink-raised/70 border-ink-edge'}`}
                >
                  <span
                    className={`text-2xl ${out ? 'grayscale opacity-40' : ''}`}
                    aria-hidden="true"
                  >
                    {drink.emoji}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className={`block font-medium ${out ? 'text-frost-mute line-through' : ''}`}>
                      {drink.name}
                    </span>
                    {drink.ingredients && (
                      <span className={`block text-xs mt-0.5 ${out ? 'text-frost-mute/60' : 'text-frost-mute'}`}>
                        {drink.ingredients}
                      </span>
                    )}
                  </span>

                  {out ? (
                    <span className="text-xs font-semibold uppercase tracking-wide text-frost-mute px-2.5 py-1 rounded-full bg-ink-edge/80">
                      Esaurito
                    </span>
                  ) : (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setQty(drink.id, -1)}
                        disabled={qty === 0}
                        aria-label={`Togli ${drink.name}`}
                        className="size-11 rounded-lg bg-ink-edge text-frost-dim text-xl leading-none
                                   disabled:opacity-25 active:bg-ink-edge/70"
                      >
                        −
                      </button>
                      <span className="w-8 text-center tabular-nums font-semibold">{qty}</span>
                      <button
                        onClick={(e) => {
                          setQty(drink.id, 1)
                          burst(e.currentTarget, drink.emoji)
                        }}
                        aria-label={`Aggiungi ${drink.name}`}
                        className="size-11 rounded-lg bg-volt text-ink-base font-bold text-xl leading-none
                                   active:bg-volt-deep active:scale-95 transition-transform"
                      >
                        +
                      </button>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      ))}

      <section className="px-5 mt-8 mb-4">
        <label className="block text-sm font-medium text-frost-dim mb-2">
          Note per il barista <span className="text-frost-mute">(opzionale)</span>
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="senza ghiaccio, poco alcol…"
          rows={2}
          maxLength={200}
          className="w-full rounded-xl bg-ink-raised border border-ink-edge px-4 py-3
                     outline-none focus:border-volt/60 placeholder:text-frost-mute resize-none"
        />
      </section>

      <div className="sticky bottom-0 mt-auto p-4 pt-8 bg-gradient-to-t from-ink-base via-ink-base to-transparent">
        {error && (
          <p className="text-center text-sm text-red-400 mb-2">{error}</p>
        )}
        <button
          onClick={submit}
          disabled={!canSend}
          className="w-full rounded-2xl bg-volt text-ink-base font-black text-lg py-4 shadow-glow
                     uppercase tracking-wide transition-all
                     disabled:bg-ink-raised disabled:text-frost-mute disabled:shadow-none
                     active:bg-volt-deep"
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

      {/* Easter egg: appare solo insistendo a scorrere oltre il fondo. */}
      <div
        aria-hidden={progress < 1}
        className="overflow-hidden transition-[height] duration-200 ease-out"
        style={{ height: `${progress * 92}px` }}
      >
        <div
          className="h-[92px] flex flex-col items-center justify-center gap-1"
          style={{ opacity: progress ** 2 }}
        >
          <p
            className="text-volt font-black tracking-[0.3em] text-sm uppercase text-center px-4"
            style={{ textShadow: `0 0 ${18 * progress}px rgba(34,211,238,.7)` }}
          >
            Wonderful tonight
          </p>
          <p className="text-frost-mute text-[11px] tracking-widest uppercase">
            ♪ STRADAUSS ♪
          </p>
        </div>
      </div>
    </div>
  )
}
