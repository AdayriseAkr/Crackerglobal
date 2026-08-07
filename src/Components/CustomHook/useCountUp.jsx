import { useEffect, useRef, useState } from "react";

// Animates a number from 0 (or `from`) up to `target` once `start` becomes true.
// Mirrors the "numbers climbing up" feel from the reference reveal animation.
export default function useCountUp(target, { start = false, duration = 1400, from = 0, decimals = 0 } = {}) {
  const [value, setValue] = useState(from);
  const rafRef = useRef(null);
  const playedRef = useRef(false);

  useEffect(() => {
    if (!start || playedRef.current) return;
    playedRef.current = true;

    const startTime = performance.now();
    const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);
      const next = from + (target - from) * eased;
      setValue(Number(next.toFixed(decimals)));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [start, target, duration, from, decimals]);

  return value;
}
