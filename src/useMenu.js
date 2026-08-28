import { useCallback, useEffect, useMemo, useState } from 'react'
import { onValue, push, ref, remove, runTransaction, update } from 'firebase/database'
import { db } from './firebase'
import { DEFAULT_EMOJI, SEED_MENU } from './menu'

// Scrive il menu di partenza solo se /menu e' ancora vuoto.
// Usa una transaction: se due tablet aprono l'app insieme su un DB vuoto,
// solo il primo scrive e il secondo trova il nodo gia' popolato.
// Un solo tentativo di seed per caricamento di pagina, non per montaggio del
// componente: in StrictMode l'effect viene montato due volte, e il bancone usa
// useMenu insieme alla pagina ospite.
let seedAttempted = false

async function seedIfEmpty() {
  if (seedAttempted) return
  seedAttempted = true
  try {
    await runTransaction(ref(db, 'menu'), (current) => {
      if (current) return current // gia' popolato: non toccare
      const seed = {}
      SEED_MENU.forEach((d, i) => {
        seed[`seed_${i}`] = { ...d, soldout: false, deleted: false, order: i }
      })
      return seed
    })
  } catch (e) {
    seedAttempted = false // permetti un nuovo tentativo se e' fallito davvero
    console.error('[menu] seed fallito', e)
  }
}

export function useMenu() {
  const [raw, setRaw] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!db) return
    const unsub = onValue(
      ref(db, 'menu'),
      (snap) => {
        setRaw(snap.val() || {})
        setLoading(false)
        // Dopo aver aggiornato lo stato: la transaction ri-triggera questa
        // stessa callback con i dati seedati.
        if (!snap.exists()) seedIfEmpty()
      },
      (err) => {
        console.error('[menu]', err)
        setError(err)
        setLoading(false)
      },
    )
    return unsub
  }, [])

  // Tutte le voci, eliminate incluse: serve al barista per il ripristino.
  const allDrinks = useMemo(() => {
    return Object.entries(raw)
      .map(([id, d]) => ({ id, ...d }))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }, [raw])

  // Solo quelle vive: e' cio' che vede l'ospite.
  const menu = useMemo(() => allDrinks.filter((d) => !d.deleted), [allDrinks])

  const categories = useMemo(
    () => [...new Set(menu.map((d) => d.category))],
    [menu],
  )

  const addDrink = useCallback(
    ({ name, emoji, category, soldout = false }) => {
      const maxOrder = Object.values(raw).reduce(
        (m, d) => Math.max(m, d.order ?? 0),
        -1,
      )
      return push(ref(db, 'menu'), {
        name: name.trim().slice(0, 40),
        emoji: (emoji || DEFAULT_EMOJI).slice(0, 8),
        category: category.trim().slice(0, 30),
        soldout: Boolean(soldout),
        deleted: false,
        order: maxOrder + 1,
      })
    },
    [raw],
  )

  const toggleSoldout = useCallback(
    (id, soldout) => update(ref(db, `menu/${id}`), { soldout: Boolean(soldout) }),
    [],
  )

  // Soft delete: la voce resta nel DB, sparisce solo dal menu ospite.
  const softDelete = useCallback(
    (id) => update(ref(db, `menu/${id}`), { deleted: true }),
    [],
  )

  const restore = useCallback(
    (id) => update(ref(db, `menu/${id}`), { deleted: false }),
    [],
  )

  // Rimozione definitiva, per svuotare il cestino.
  const hardDelete = useCallback((id) => remove(ref(db, `menu/${id}`)), [])

  return {
    menu,
    allDrinks,
    categories,
    loading,
    error,
    addDrink,
    toggleSoldout,
    softDelete,
    restore,
    hardDelete,
  }
}
