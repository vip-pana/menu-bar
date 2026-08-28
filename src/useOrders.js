import { useEffect, useState } from 'react'
import { onValue, ref } from 'firebase/database'
import { db } from './firebase'

// Sottoscrive /orders e restituisce un array ordinato per createdAt crescente
// (primo arrivato, primo servito).
export function useOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!db) return
    const unsub = onValue(
      ref(db, 'orders'),
      (snap) => {
        const val = snap.val() || {}
        const list = Object.entries(val).map(([id, o]) => ({ id, ...o }))
        list.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0))
        setOrders(list)
        setLoading(false)
      },
      (err) => {
        // Permessi negati o rete giu': non lasciare la UI su "Carico..." per sempre.
        console.error('[orders]', err)
        setError(err)
        setLoading(false)
      },
    )
    return unsub
  }, [])

  return { orders, loading, error }
}
