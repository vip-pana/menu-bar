import { useCallback, useRef, useState } from 'react'

// Emoji che schizzano via dal punto in cui si e' premuto.
// Posizione fixed calcolata dal rect del bottone: non serve un contenitore
// relativo attorno a ogni card, e non sposta il layout.
export function useEmojiBurst() {
  const [bursts, setBursts] = useState([])
  const seq = useRef(0)

  const burst = useCallback((el, emoji) => {
    if (!el) return
    // Rispetta chi ha chiesto meno animazioni a sistema.
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    const r = el.getBoundingClientRect()
    const id = ++seq.current
    const x = r.left + r.width / 2
    const y = r.top + r.height / 2

    const pieces = Array.from({ length: 5 }, (_, i) => ({
      i,
      dx: (Math.random() - 0.5) * 110,
      dy: -60 - Math.random() * 70,
      rot: (Math.random() - 0.5) * 90,
      delay: i * 28,
    }))

    setBursts((b) => [...b, { id, x, y, emoji, pieces }])
    setTimeout(() => setBursts((b) => b.filter((z) => z.id !== id)), 900)
  }, [])

  const layer = (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {bursts.map((b) =>
        b.pieces.map((p) => (
          <span
            key={`${b.id}-${p.i}`}
            className="absolute text-2xl will-change-transform animate-emoji-pop"
            style={{
              left: b.x,
              top: b.y,
              animationDelay: `${p.delay}ms`,
              '--dx': `${p.dx}px`,
              '--dy': `${p.dy}px`,
              '--rot': `${p.rot}deg`,
            }}
          >
            {b.emoji}
          </span>
        )),
      )}
    </div>
  )

  return { burst, layer }
}
