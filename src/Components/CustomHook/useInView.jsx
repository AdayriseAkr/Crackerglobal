// useInView.jsx
import { useState, useEffect } from "react";

export default function useInView(ref, threshold = 0.5) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setInView(entry.intersectionRatio >= threshold);
      },
      {
        threshold, // 0 to 1 → 0.5 means 50% visible
      }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [ref, threshold]);

  return inView;
}
