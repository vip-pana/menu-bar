import { useEffect, useMemo, useRef, useState } from 'react'
import { ref, update } from 'firebase/database'
import { db } from '../firebase'
import { useOrders } from '../useOrders'

const COLUMNS = [
  { status: 'nuovo',           title: 'Nuovi',           accent: 'border-sky-500/60' },
  { status: 'in_preparazione', title: 'In preparazione', accent: 'border-amber-500/60' },
  { status: 'fatto',           title: 'Fatti',           accent: 'border-emerald-500/60' },
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
  const [showAllDone, setShowAllDone] = useState(false)
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
        <h1 className="text-2xl font-bold tracking-tight">Bancone 🍸</h1>
        <p className={`text-sm ${error ? 'text-red-400' : 'text-zinc-500'}`}>
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
          const list =
            col.status === 'fatto' && !showAllDone ? all.slice(0, 10) : all

          return (
            <section key={col.status} className="min-w-0">
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-2 px-1">
                {col.title}
                <span className="text-zinc-600 tabular-nums">{all.length}</span>
              </h2>

              <ul className="space-y-2">
                {list.map((o) => (
                  <li
                    key={o.id}
                    className={`rounded-xl bg-zinc-900 border-l-4 ${col.accent} p-4`}
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-xl font-bold truncate">{o.name}</span>
                      <span className="text-xs text-zinc-500 tabular-nums shrink-0">
                        {time(o.createdAt)}
                      </span>
                    </div>

                    <ul className="mt-2 space-y-0.5">
                      {o.items?.map((i, idx) => (
                        <li key={`${i.id}-${idx}`} className="text-zinc-200">
                          <span className="font-semibold tabular-nums">{i.qty}×</span>{' '}
                          {i.name}
                        </li>
                      ))}
                    </ul>

                    {o.note && (
                      <p className="mt-2 text-sm bg-amber-500/10 text-amber-200 rounded-lg px-3 py-2">
                        {o.note}
                      </p>
                    )}

                    <div className="mt-3 flex gap-2">
                      {PREV[o.status] && (
                        <button
                          onClick={() => move(o.id, PREV[o.status])}
                          aria-label="Torna indietro"
                          className="rounded-lg bg-zinc-800 px-3 py-2.5 text-zinc-400 active:bg-zinc-700"
                        >
                          ←
                        </button>
                      )}
                      {NEXT[o.status] && (
                        <button
                          onClick={() => move(o.id, NEXT[o.status])}
                          className="flex-1 rounded-lg bg-zinc-100 text-zinc-900 font-semibold py-2.5
                                     active:bg-white"
                        >
                          {NEXT_LABEL[o.status]}
                        </button>
                      )}
                    </div>
                  </li>
                ))}

                {all.length === 0 && (
                  <li className="text-sm text-zinc-600 px-1 py-4">Niente qui.</li>
                )}
              </ul>

              {col.status === 'fatto' && all.length > 10 && (
                <button
                  onClick={() => setShowAllDone((v) => !v)}
                  className="mt-2 w-full text-sm text-zinc-500 py-2 active:text-zinc-300"
                >
                  {showAllDone ? 'Mostra meno' : `Mostra tutti (${all.length})`}
                </button>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
