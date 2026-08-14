import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

    // Lenis animates scrollTop itself, so the browser's native scroll event
    // doesn't fire on every frame of a smooth-scroll. Without this, anything
    // driven by ScrollTrigger (the pinned process section) updates a frame or
    // more behind the page and visibly drags.
    const syncScrollTrigger = () => ScrollTrigger.update();
    lenis.on("scroll", syncScrollTrigger);

    let rafId = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    });

    return () => {
      // The loop used to keep running after unmount, calling raf() on a
      // destroyed instance.
      cancelAnimationFrame(rafId);
      lenis.off("scroll", syncScrollTrigger);
      lenisRef.current = null;
      lenis.destroy();
    };
  }, []);

  return children;
}
