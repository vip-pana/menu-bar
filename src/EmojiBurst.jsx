import { useCallback, useRef, useState } from 'react'

// Cyan della festa piu' qualche colore caldo che stacca sul nero.
const CONFETTI_COLORS = ['#22D3EE', '#67E8F9', '#E8F4F8', '#FBBF24', '#F472B6', '#A78BFA']

// Emoji che schizzano via dal punto in cui si e' premuto.
// Posizione fixed calcolata dal rect del bottone: non serve un contenitore
// relativo attorno a ogni card, e non sposta il layout.
export function useEmojiBurst() {
  const [bursts, setBursts] = useState([])
  const [confettiRuns, setConfetti] = useState([])
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

  // Coriandoli che sparano dal basso e ricadono: per l'ordine inviato.
  const confetti = useCallback(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const id = ++seq.current
    const pieces = Array.from({ length: 60 }, (_, i) => ({
      i,
      left: Math.random() * 100,
      dx: (Math.random() - 0.5) * 220,
      rise: 260 + Math.random() * 320,
      rot: (Math.random() - 0.5) * 900,
      delay: Math.random() * 220,
      dur: 1500 + Math.random() * 900,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      w: 6 + Math.random() * 5,
      h: 9 + Math.random() * 7,
      round: Math.random() < 0.25,
    }))
    setConfetti((c) => [...c, { id, pieces }])
    setTimeout(() => setConfetti((c) => c.filter((z) => z.id !== id)), 3000)
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

      {confettiRuns.map((run) =>
        run.pieces.map((p) => (
          <span
            key={`${run.id}-${p.i}`}
            className={`absolute bottom-0 will-change-transform animate-confetti ${
              p.round ? 'rounded-full' : 'rounded-[1px]'
            }`}
            style={{
              left: `${p.left}%`,
              width: `${p.w}px`,
              height: `${p.h}px`,
              background: p.color,
              animationDelay: `${p.delay}ms`,
              animationDuration: `${p.dur}ms`,
              '--dx': `${p.dx}px`,
              '--rise': `${p.rise}px`,
              '--rot': `${p.rot}deg`,
            }}
          />
        )),
      )}
    </div>
  )

  return { burst, confetti, layer }
}
