import { useEffect, useRef, useState } from "react"

/**
 * Anima un número de 0 → target cuando `active` es true.
 * Usa ease-out quart para una curva natural.
 */
export function useAnimatedCounter(
  target: number,
  active: boolean,
  duration = 1600
): number {
  const [value, setValue] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!active) return
    const startTime = performance.now()

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      setValue(Math.round(eased * target))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [active, target, duration])

  return value
}
