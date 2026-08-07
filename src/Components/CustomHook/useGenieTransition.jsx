import { useEffect, useLayoutEffect, useRef } from "react";

// macOS Dock-style "genie" transition: the element doesn't scale uniformly,
// it tapers toward an anchor point — the edge nearest the anchor pinches in
// first, the far edge lags and stretches, with a brief overshoot wobble as
// the taper forms. Driven by a single 0..1 progress value on a rAF loop so
// it can be retargeted (open <-> close) mid-flight without restarting.

const GENIE_EASE = [0.4, 0, 0.2, 1];

function makeBezierEasing([p1x, p1y, p2x, p2y]) {
  const A = (a1, a2) => 1 - 3 * a2 + 3 * a1;
  const B = (a1, a2) => 3 * a2 - 6 * a1;
  const C = (a1) => 3 * a1;
  const sampleX = (t) => ((A(p1x, p2x) * t + B(p1x, p2x)) * t + C(p1x)) * t;
  const sampleY = (t) => ((A(p1y, p2y) * t + B(p1y, p2y)) * t + C(p1y)) * t;
  const sampleSlopeX = (t) => 3 * A(p1x, p2x) * t * t + 2 * B(p1x, p2x) * t + C(p1x);

  return (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const dx = sampleX(t) - x;
      const slope = sampleSlopeX(t);
      if (Math.abs(slope) < 1e-6) break;
      t = Math.min(1, Math.max(0, t - dx / slope));
    }
    return sampleY(t);
  };
}

const ease = makeBezierEasing(GENIE_EASE);

const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const smoothstep = (edge0, edge1, x) => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};

// How pinched the silhouette is at a given progress: 0 at both ends (a real
// rectangle when fully open, irrelevant when fully collapsed to a point),
// held near max through the middle of the flight, with a quick early wobble
// as the taper first forms — like fabric catching before it pulls through.
function warpEnvelope(p) {
  const rise = smoothstep(0, 0.26, p);
  const fall = 1 - smoothstep(0.6, 1, p);
  const body = Math.min(rise, fall);
  const wobble = 0.14 * Math.sin(smoothstep(0.05, 0.3, p) * Math.PI) * (1 - smoothstep(0.32, 0.46, p));
  return Math.max(0, body + wobble);
}

// Rectangle outline as 8 points (corners + edge midpoints) on a unit square
// centered at the origin, so the warp math stays independent of actual
// pixel size — x/y both in [-1, 1].
const RECT_POINTS = [
  [-1, -1], [0, -1], [1, -1],
  [1, 0],
  [1, 1], [0, 1], [-1, 1],
  [-1, 0],
];

function buildClipPath(progress, dir) {
  const warp = warpEnvelope(progress);
  if (warp <= 0.001) return "none";

  const perp = { x: -dir.y, y: dir.x };

  const points = RECT_POINTS.map(([ux, uy]) => {
    const along = ux * dir.x + uy * dir.y; // -1 (trailing/far edge) .. 1 (leading/anchor-facing edge)
    const across = ux * perp.x + uy * perp.y;
    const lead = (along + 1) / 2;

    // Leading edge pinches hard toward the travel axis; trailing edge only
    // pinches a little, so the silhouette narrows unevenly instead of
    // shrinking as a symmetric rectangle.
    const pinch = warp * lerp(0.1, 0.92, lead);
    const newAcross = across * (1 - pinch);

    // Leading points also get pulled forward toward the anchor; trailing
    // points lag slightly behind, stretching the shape into a teardrop.
    const stretch = warp * lerp(-0.16, 0.5, lead);
    const newAlong = clamp(along + stretch, -1.35, 1.35);

    const x = newAlong * dir.x + newAcross * perp.x;
    const y = newAlong * dir.y + newAcross * perp.y;
    return `${(((x + 1) / 2) * 100).toFixed(2)}% ${(((y + 1) / 2) * 100).toFixed(2)}%`;
  });

  return `polygon(${points.join(", ")})`;
}

/**
 * @param {Object} opts
 * @param {boolean} opts.isOpen - target state; true = fully open, false = collapsed at anchor
 * @param {{x:number,y:number}|null} opts.anchor - viewport coords to warp toward (tab bar / card position)
 * @param {number} [opts.duration] - ms for a full 0<->1 traversal
 * @param {() => void} [opts.onClosed] - fires once progress settles at 0 (safe to unmount)
 */
export default function useGenieTransition({ isOpen, anchor, duration = 450, onClosed }) {
  const ref = useRef(null);
  const geo = useRef({ dir: { x: 0, y: 1 }, offset: { x: 0, y: 0 }, endScale: 0.14, measured: false });
  const anim = useRef({ progress: 0, from: 0, to: 0, startTime: 0, activeDuration: duration, raf: null });
  const reducedMotionRef = useRef(false);
  const onClosedRef = useRef(onClosed);
  onClosedRef.current = onClosed;

  const applyFrame = (p) => {
    const el = ref.current;
    if (!el) return;
    const g = geo.current;
    const tx = g.offset.x * (1 - p);
    const ty = g.offset.y * (1 - p);
    const scale = lerp(g.endScale, 1, p);
    el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
    el.style.opacity = String(clamp(lerp(0, 1, p / 0.18), 0, 1));
    el.style.clipPath = reducedMotionRef.current ? "none" : buildClipPath(p, g.dir);
  };

  useLayoutEffect(() => {
    reducedMotionRef.current =
      typeof window !== "undefined" &&
      !!window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const el = ref.current;
    if (el && anchor && !geo.current.measured) {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const halfW = rect.width / 2 || 1;
      const halfH = rect.height / 2 || 1;
      const rawX = (anchor.x - centerX) / halfW;
      const rawY = (anchor.y - centerY) / halfH;
      const len = Math.hypot(rawX, rawY) || 1;
      geo.current.dir = { x: rawX / len, y: rawY / len };
      geo.current.offset = { x: anchor.x - centerX, y: anchor.y - centerY };
      geo.current.measured = true;
    }

    applyFrame(anim.current.progress);
    // Measured once at mount — anchor/panel geometry doesn't change afterward.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const a = anim.current;
    const target = isOpen ? 1 : 0;
    if (a.raf) cancelAnimationFrame(a.raf);

    const distance = Math.max(Math.abs(target - a.progress), 0.08);
    a.from = a.progress;
    a.to = target;
    a.startTime = performance.now();
    a.activeDuration = reducedMotionRef.current ? 140 : duration * distance;

    const step = (now) => {
      const t = a.activeDuration <= 0 ? 1 : clamp((now - a.startTime) / a.activeDuration, 0, 1);
      const eased = reducedMotionRef.current ? t : ease(t);
      a.progress = lerp(a.from, a.to, eased);
      applyFrame(a.progress);

      if (t < 1) {
        a.raf = requestAnimationFrame(step);
      } else {
        a.progress = a.to;
        applyFrame(a.progress);
        a.raf = null;
        if (a.to === 0) onClosedRef.current?.();
      }
    };

    a.raf = requestAnimationFrame(step);
    return () => {
      if (a.raf) cancelAnimationFrame(a.raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, duration]);

  return ref;
}
