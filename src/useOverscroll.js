import { useEffect, useState } from 'react'

// Rileva quando si insiste a scorrere oltre il fondo della pagina.
// Non basta "essere in fondo": bisogna continuare a tirare, come per il
// pull-to-refresh ma al contrario. Cosi' l'easter egg resta nascosto a chi
// scorre normalmente il menu.
export function useOverscroll(threshold = 90) {
  const [pulled, setPulled] = useState(0)

  useEffect(() => {
    let acc = 0
    let resetTimer = null
    let startY = null

    // Il pannello che si apre allunga la pagina: senza scomputarlo, dopo pochi
    // pixel non si e' piu' "in fondo" e l'accumulo si blocca da solo.
    const atBottom = () =>
      window.innerHeight + window.scrollY >=
      document.body.scrollHeight - acc - 4

    const bump = (amount) => {
      if (!atBottom() || amount <= 0) return
      acc = Math.min(acc + amount, threshold)
      setPulled(acc)
      clearTimeout(resetTimer)
      // Se molla, l'elastico torna indietro.
      resetTimer = setTimeout(() => {
        acc = 0
        setPulled(0)
      }, 900)
    }

    const onWheel = (e) => bump(e.deltaY)

    const onTouchStart = (e) => { startY = e.touches[0].clientY }
    const onTouchMove = (e) => {
      if (startY === null) return
      const y = e.touches[0].clientY
      bump(startY - y) // dito che sale = si tira verso l'alto
      startY = y
    }
    const onTouchEnd = () => { startY = null }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      clearTimeout(resetTimer)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [threshold])

  return { pulled, progress: Math.min(pulled / threshold, 1) }
}
