import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

// Module-level singleton so components outside this provider (e.g. modals
// rendered via a portal) can stop/start the smooth-scroll while open.
export const lenisRef = { current: null };

export default function SmoothScrollProvider({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.4,
      easing: (t) => 1 - Math.pow(1 - t, 3), // smooth
      smoothWheel: true,
      smoothTouch: false,
    });
    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenisRef.current = null;
      lenis.destroy();
    };
  }, []);

  return children;
}
