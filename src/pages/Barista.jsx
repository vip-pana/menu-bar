import { useEffect, useMemo, useRef, useState } from 'react'
import { ref, update } from 'firebase/database'
import { db } from '../firebase'
import { useOrders } from '../useOrders'
import { useMenu } from '../useMenu'
import MenuManager from './MenuManager'

const COLUMNS = [
  { status: 'nuovo',           title: 'Nuovi',           accent: 'border-volt' },
  { status: 'in_preparazione', title: 'In preparazione', accent: 'border-amber-400/70' },
  { status: 'fatto',           title: 'Fatti',           accent: 'border-emerald-400/60' },
]

const NEXT = { nuovo: 'in_preparazione', in_preparazione: 'fatto' }
const NEXT_LABEL = { nuovo: 'Prendi in carico', in_preparazione: 'Fatto ✓' }
const PREV = { in_preparazione: 'nuovo', fatto: 'in_preparazione' }

function time(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleTimeString('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function Barista() {
  const { orders, loading, error } = useOrders()
  const menuApi = useMenu()
  const [doneOpen, setDoneOpen] = useState(false)
  const [showAllDone, setShowAllDone] = useState(false)

  const DONE_PREVIEW = 5
  const prevNewCount = useRef(null)

  const byStatus = useMemo(() => {
    const g = { nuovo: [], in_preparazione: [], fatto: [] }
    for (const o of orders) (g[o.status] || g.nuovo).push(o)
    g.fatto.reverse() // i più recenti in cima fra i fatti
    return g
  }, [orders])

  // Vibra quando arriva un ordine nuovo (non al primo caricamento).
  useEffect(() => {
    const n = byStatus.nuovo.length
    if (prevNewCount.current !== null && n > prevNewCount.current) {
      navigator.vibrate?.([120, 60, 120])
    }
    prevNewCount.current = n
  }, [byStatus.nuovo.length])

  const move = (id, status) => {
    update(ref(db, `orders/${id}`), { status }).catch(console.error)
  }

  return (
    <div className="min-h-dvh p-4">
      <header className="flex items-baseline justify-between mb-4 px-1">
        <h1 className="text-2xl font-black tracking-tight">Bancone 🍸</h1>
        <p className={`text-sm ${error ? 'text-red-400' : 'text-frost-mute'}`}>
          {error
            ? 'Connessione persa'
            : loading
              ? 'Carico…'
              : `${byStatus.nuovo.length + byStatus.in_preparazione.length} da fare`}
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {COLUMNS.map((col) => {
          const all = byStatus[col.status]
          const done = col.status === 'fatto'
          // I fatti servono solo come storico: chiusi di default, e comunque
          // in versione compatta per non rubare spazio a chi deve lavorare.
          const list = done
            ? doneOpen
              ? showAllDone
                ? all
                : all.slice(0, DONE_PREVIEW)
              : []
            : all

          return (
            <section key={col.status} className="min-w-0">
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-frost-dim mb-2 px-1">
                {done ? (
                  <button
                    onClick={() => setDoneOpen((v) => !v)}
                    className="flex items-center gap-2 uppercase tracking-wider"
                  >
                    <span className="text-frost-mute text-xs leading-none">
                      {doneOpen ? '▾' : '▸'}
                    </span>
                    {col.title}
                    <span className="text-frost-mute tabular-nums">{all.length}</span>
                  </button>
                ) : (
                  <>
                    {col.title}
                    <span className="text-frost-mute tabular-nums">{all.length}</span>
                  </>
                )}
              </h2>

              <ul className="space-y-2">
                {list.map((o) =>
                  done ? (
                    <li
                      key={o.id}
                      className="flex items-baseline gap-2 rounded-lg bg-ink-raised/50 px-3 py-2 text-sm"
                    >
                      <span className="font-semibold text-frost-dim truncate">{o.name}</span>
                      <span className="flex-1 min-w-0 truncate text-frost-mute">
                        {o.items?.map((i) => `${i.qty}× ${i.name}`).join(', ')}
                      </span>
                      <button
                        onClick={() => move(o.id, PREV[o.status])}
                        aria-label="Torna indietro"
                        className="text-frost-mute px-1.5 shrink-0 active:text-frost"
                      >
                        ←
                      </button>
                    </li>
                  ) : (
                  <li
                    key={o.id}
                    className={`rounded-xl bg-ink-raised border border-ink-edge border-l-4 ${col.accent} p-4`}
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-xl font-bold truncate">{o.name}</span>
                      <span className="text-xs text-frost-mute tabular-nums shrink-0">
                        {time(o.createdAt)}
                      </span>
                    </div>

                    <ul className="mt-2 space-y-0.5">
                      {o.items?.map((i, idx) => (
                        <li key={`${i.id}-${idx}`} className="text-frost">
                          <span className="font-semibold tabular-nums">{i.qty}×</span>{' '}
                          {i.name}
                        </li>
                      ))}
                    </ul>

                    {o.note && (
                      <p className="mt-2 text-sm bg-amber-400/10 text-amber-200 rounded-lg px-3 py-2">
                        {o.note}
                      </p>
                    )}

                    <div className="mt-3 flex gap-2">
                      {PREV[o.status] && (
                        <button
                          onClick={() => move(o.id, PREV[o.status])}
                          aria-label="Torna indietro"
                          className="rounded-lg bg-ink-edge px-3 py-2.5 text-frost-dim active:bg-ink-edge/70"
                        >
                          ←
                        </button>
                      )}
                      {NEXT[o.status] && (
                        <button
                          onClick={() => move(o.id, NEXT[o.status])}
                          className="flex-1 rounded-lg bg-volt text-ink-base font-bold py-2.5
                                     active:bg-volt-deep"
                        >
                          {NEXT_LABEL[o.status]}
                        </button>
                      )}
                    </div>
                  </li>
                  ),
                )}

                {all.length === 0 && !done && (
                  <li className="text-sm text-frost-mute px-1 py-4">Niente qui.</li>
                )}
              </ul>

              {done && doneOpen && all.length > DONE_PREVIEW && (
                <button
                  onClick={() => setShowAllDone((v) => !v)}
                  className="mt-2 w-full text-sm text-frost-mute py-2 active:text-frost"
                >
                  {showAllDone ? 'Mostra meno' : `Mostra tutti (${all.length})`}
                </button>
              )}
            </section>
          )
        })}
      </div>

      <MenuManager
        allDrinks={menuApi.allDrinks}
        categories={menuApi.categories}
        addDrink={menuApi.addDrink}
        toggleSoldout={menuApi.toggleSoldout}
        softDelete={menuApi.softDelete}
        restore={menuApi.restore}
        hardDelete={menuApi.hardDelete}
      />
    </div>
  )
}
