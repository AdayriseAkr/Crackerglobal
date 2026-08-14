import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import "./SpotlightBento.css";
import { bentoCards } from "./bentoData";
import useInView from "../CustomHook/useInView.jsx";
import useTextSplitAnim from "../CustomHook/useTextSplitAnim.jsx";

// Cursor-reactive bento grid: a spotlight pool follows the pointer across the
// section, each card lights its own border in proportion to how close the
// cursor is, and the card under the cursor tilts, drifts toward it and lifts.
//
// Deliberately dependency-free — no GSAP, no Framer Motion. One rAF loop owns
// every continuous value (pointer smoothing, per-card glow, tilt, magnetism)
// and writes them out as CSS custom properties / a single transform per card.
// Discrete effects (particle spawn, click ripple) are CSS keyframes.
//
// The loop is self-parking: it starts on pointer entry and stops itself once
// every value has settled back to rest, so an idle section costs nothing.

const SPOTLIGHT_RADIUS = 220; // px from a card's edge before its glow starts
const PARTICLE_COUNT = 10;
const TILT_MAX = 6; // degrees at the card edge
const MAGNET_STRENGTH = 0.04; // fraction of card size the card drifts cursor-ward
const LIFT = 6; // px the hovered card rises

// Per-frame easing factors. Pointer follows fastest so the spotlight feels
// attached; card motion lags slightly so it reads as weight, not lag.
const POINTER_EASE = 0.2;
const MOTION_EASE = 0.14;
const FADE_EASE = 0.12;

const PARTICLE_EXIT_MS = 340;

// Scroll-in entrance. Each card expands from zero along one axis (see `enter`
// in bentoData.js). Cards land per card, as each scrolls in, so the stagger
// only has to separate neighbours that arrive together — hence the wrap at 3
// rather than a straight index multiple, which would leave the last card
// waiting almost half a second after it was already on screen.
const ENTER_STAGGER_MS = 70;
const enterDelayFor = (index) => (index % 3) * ENTER_STAGGER_MS;

// Must match --enter-duration in SpotlightBento.css — it's what decides when a
// card's clip-path is dropped, and leaving that clip in place would keep
// cutting off the card's proximity shadow.
const ENTER_DURATION_MS = 600;

// How much of a card must be showing before it plays its entrance.
const ENTER_THRESHOLD = 0.3;

const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Gate every cursor effect on an actual fine pointer, rather than on a width
// breakpoint — a 1200px touch screen has no hover to respond to. Reduced-motion
// collapses to the same "off" path, which also stops particles from mounting.
function useInteractivePointer() {
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setInteractive(fine.matches && !reduced.matches);

    update();
    fine.addEventListener("change", update);
    reduced.addEventListener("change", update);

    return () => {
      fine.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  return interactive;
}

function BentoParticles({ active, count }) {
  const [mounted, setMounted] = useState(false);

  // Stay mounted through the exit animation, then unmount — otherwise the
  // particles would vanish instantly the moment the cursor leaves.
  useEffect(() => {
    if (active) {
      setMounted(true);
      return;
    }
    const timer = setTimeout(() => setMounted(false), PARTICLE_EXIT_MS);
    return () => clearTimeout(timer);
  }, [active]);

  // Fixed per card for the component's lifetime: re-randomising on every hover
  // makes the drift visibly restart mid-flight.
  const dots = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        left: `${(Math.random() * 100).toFixed(2)}%`,
        top: `${(Math.random() * 100).toFixed(2)}%`,
        spawn: `${(Math.random() * 0.45).toFixed(2)}s`,
        dx: `${((Math.random() - 0.5) * 64).toFixed(1)}px`,
        dy: `${((Math.random() - 0.5) * 64).toFixed(1)}px`,
        dur: `${(2.4 + Math.random() * 2.2).toFixed(2)}s`,
        delay: `${(Math.random() * 0.8).toFixed(2)}s`,
      })),
    [count]
  );

  if (!mounted) return null;

  return (
    <span
      className={`bentoParticles${active ? "" : " is-out"}`}
      aria-hidden="true"
    >
      {dots.map((dot, i) => (
        <span
          key={i}
          className="bentoParticle"
          style={{ left: dot.left, top: dot.top, "--spawn": dot.spawn }}
        >
          <span
            className="bentoParticleDot"
            style={{
              "--dx": dot.dx,
              "--dy": dot.dy,
              "--dur": dot.dur,
              "--delay": dot.delay,
            }}
          />
        </span>
      ))}
    </span>
  );
}

// One card. Owns its own entrance trigger so it animates when IT reaches the
// viewport — watching the whole grid instead meant every card fired as soon as
// a sliver of the grid crossed the fold, and the animation was over before the
// lower rows were ever on screen.
function BentoCard({ card, index, cardRefs, active, interactive, onEnter, onLeave, onClick }) {
  const nodeRef = useRef(null);
  const inView = useInView(nodeRef, ENTER_THRESHOLD);
  const [entered, setEntered] = useState(false);
  const [settled, setSettled] = useState(false);

  // useInView flips back to false on scroll-out; latch it so the entrance is a
  // one-shot rather than a replay on every pass.
  useEffect(() => {
    if (inView) setEntered(true);
  }, [inView]);

  // Drop the clip once this card has landed, so it stops cutting off the
  // card's own proximity shadow.
  useEffect(() => {
    if (!entered) return;
    const timer = setTimeout(
      () => setSettled(true),
      enterDelayFor(index) + ENTER_DURATION_MS + 80
    );
    return () => clearTimeout(timer);
  }, [entered, index]);

  const className = ["bentoCard", `bentoCard--${card.enter}`]
    .concat((card.modifiers || []).map((m) => `bentoCard--${m}`))
    .concat(entered ? ["is-in"] : [])
    .concat(settled ? ["is-done"] : [])
    .join(" ");

  return (
    <article
      ref={(el) => {
        nodeRef.current = el;
        cardRefs.current[index] = el;
      }}
      className={className}
      style={{ "--enter-delay": `${enterDelayFor(index)}ms` }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      <div className="bentoCardHeader">
        <span className="bentoCardLabel">{card.label}</span>
        <span className="bentoCardIndex">{String(index + 1).padStart(2, "0")}</span>
      </div>

      <div className="bentoCardBody">
        <h2 className="bentoCardTitle">{card.title}</h2>
        <p className="bentoCardText">{card.description}</p>
      </div>

      {interactive && <BentoParticles active={active} count={PARTICLE_COUNT} />}
    </article>
  );
}

export default function SpotlightBento() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const headingRef = useRef(null);
  const titleRef = useRef(null);
  const leadRef = useRef(null);
  const cardRefs = useRef([]);
  const [hovered, setHovered] = useState(-1);
  const interactive = useInteractivePointer();

  // Split-text reveal on the heading, same hook the hero and other sections
  // use. It auto-plays itself once the element scrolls into view.
  useTextSplitAnim(titleRef, { stagger: 18, threshold: 0.35 });
  useTextSplitAnim(leadRef, { stagger: 6, startDelay: 260, threshold: 0.35 });

  const headingInView = useInView(headingRef, 0.35);
  const [headingRevealed, setHeadingRevealed] = useState(false);

  useEffect(() => {
    if (headingInView) setHeadingRevealed(true);
  }, [headingInView]);

  // The cards are visible by default in CSS; this "arms" the entrance by
  // hiding them, and only runs if the entrance can actually play. That
  // direction matters: hiding by default would mean any break anywhere in the
  // reveal chain leaves the grid permanently blank, whereas this way the worst
  // case is a card that simply appears without animating.
  //
  // useLayoutEffect, not useEffect, so the hidden state is in place before the
  // browser paints and there's no flash of finished cards.
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    gridRef.current?.classList.add("is-armed");
  }, []);

  useEffect(() => {
    if (!interactive) return;
    const section = sectionRef.current;
    if (!section) return;

    const pointer = { x: 0, y: 0, tx: 0, ty: 0, inside: false, fade: 0 };
    const motion = bentoCards.map(() => ({ rx: 0, ry: 0, mx: 0, my: 0, lift: 0 }));

    // Inside `proximity` the card is fully lit; between there and
    // `fadeDistance` it ramps down to nothing.
    const proximity = SPOTLIGHT_RADIUS * 0.5;
    const fadeDistance = SPOTLIGHT_RADIUS * 0.75;

    let raf = null;

    const reset = () => {
      section.style.setProperty("--s-opacity", "0");
      cardRefs.current.forEach((el) => {
        if (!el) return;
        el.style.setProperty("--glow-intensity", "0");
        el.style.transform = "";
      });
    };

    const frame = () => {
      pointer.x = lerp(pointer.x, pointer.tx, POINTER_EASE);
      pointer.y = lerp(pointer.y, pointer.ty, POINTER_EASE);
      pointer.fade = lerp(pointer.fade, pointer.inside ? 1 : 0, FADE_EASE);

      const sectionRect = section.getBoundingClientRect();
      section.style.setProperty("--sx", `${(pointer.x - sectionRect.left).toFixed(1)}px`);
      section.style.setProperty("--sy", `${(pointer.y - sectionRect.top).toFixed(1)}px`);
      section.style.setProperty("--s-opacity", pointer.fade.toFixed(3));

      let settled = !pointer.inside && pointer.fade < 0.01;

      cardRefs.current.forEach((el, i) => {
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Distance from the card's edge, not its centre, so big and small
        // cards start glowing at the same visual gap.
        const edgeDistance = Math.max(
          0,
          Math.hypot(pointer.x - centerX, pointer.y - centerY) -
            Math.max(rect.width, rect.height) / 2
        );

        let glow = 0;
        if (edgeDistance <= proximity) glow = 1;
        else if (edgeDistance <= fadeDistance)
          glow = (fadeDistance - edgeDistance) / (fadeDistance - proximity);
        glow *= pointer.fade;

        el.style.setProperty(
          "--glow-x",
          `${(((pointer.x - rect.left) / rect.width) * 100).toFixed(2)}%`
        );
        el.style.setProperty(
          "--glow-y",
          `${(((pointer.y - rect.top) / rect.height) * 100).toFixed(2)}%`
        );
        el.style.setProperty("--glow-intensity", glow.toFixed(3));

        const over =
          pointer.inside &&
          pointer.x >= rect.left &&
          pointer.x <= rect.right &&
          pointer.y >= rect.top &&
          pointer.y <= rect.bottom;

        // -0.5 .. 0.5 from the card's centre
        const nx = over ? clamp((pointer.x - rect.left) / rect.width - 0.5, -0.5, 0.5) : 0;
        const ny = over ? clamp((pointer.y - rect.top) / rect.height - 0.5, -0.5, 0.5) : 0;

        const m = motion[i];
        m.ry = lerp(m.ry, nx * TILT_MAX * 2, MOTION_EASE);
        m.rx = lerp(m.rx, -ny * TILT_MAX * 2, MOTION_EASE);
        m.mx = lerp(m.mx, nx * rect.width * MAGNET_STRENGTH, MOTION_EASE);
        m.my = lerp(m.my, ny * rect.height * MAGNET_STRENGTH, MOTION_EASE);
        m.lift = lerp(m.lift, over ? -LIFT : 0, MOTION_EASE);

        el.style.transform =
          `perspective(1000px) rotateX(${m.rx.toFixed(3)}deg) rotateY(${m.ry.toFixed(3)}deg) ` +
          `translate3d(${m.mx.toFixed(2)}px, ${(m.my + m.lift).toFixed(2)}px, 0)`;

        if (
          glow > 0.01 ||
          Math.abs(m.rx) > 0.01 ||
          Math.abs(m.ry) > 0.01 ||
          Math.abs(m.mx) > 0.05 ||
          Math.abs(m.my) > 0.05 ||
          Math.abs(m.lift) > 0.05
        ) {
          settled = false;
        }
      });

      if (settled) {
        reset();
        raf = null;
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (raf === null) raf = requestAnimationFrame(frame);
    };

    const handleMove = (e) => {
      // Snap on first entry so the spotlight doesn't sweep in from wherever
      // the pointer happened to leave last time.
      if (!pointer.inside) {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
      }
      pointer.inside = true;
      pointer.tx = e.clientX;
      pointer.ty = e.clientY;
      start();
    };

    const handleLeave = () => {
      pointer.inside = false;
      start();
    };

    section.addEventListener("mousemove", handleMove);
    section.addEventListener("mouseleave", handleLeave);
    window.addEventListener("blur", handleLeave);

    return () => {
      section.removeEventListener("mousemove", handleMove);
      section.removeEventListener("mouseleave", handleLeave);
      window.removeEventListener("blur", handleLeave);
      if (raf !== null) cancelAnimationFrame(raf);
      reset();
    };
  }, [interactive]);

  const handleRipple = (event, index) => {
    if (!interactive) return;
    const el = cardRefs.current[index];
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Reach the furthest corner, so the ripple always covers the whole card.
    const radius = Math.max(
      Math.hypot(x, y),
      Math.hypot(x - rect.width, y),
      Math.hypot(x, y - rect.height),
      Math.hypot(x - rect.width, y - rect.height)
    );

    const ripple = document.createElement("span");
    ripple.className = "bentoRipple";
    ripple.style.width = `${radius * 2}px`;
    ripple.style.height = `${radius * 2}px`;
    ripple.style.left = `${x - radius}px`;
    ripple.style.top = `${y - radius}px`;
    ripple.addEventListener("animationend", () => ripple.remove());
    el.appendChild(ripple);
  };

  return (
    <section className="bentoSectionParent" ref={sectionRef}>
      <div className="bentoSpotlight" aria-hidden="true" />

      <div
        className={`bentoHeading${headingRevealed ? " is-in" : ""}`}
        ref={headingRef}
      >
        <span className="bentoEyebrow">The Stack</span>
        <h1 ref={titleRef}>Everything the ecosystem runs on</h1>
        <p ref={leadRef}>
          Six pieces, one chain of custody — from the launch that mints your token
          to the swap that finally settles it.
        </p>
      </div>

      <div className="bentoGrid" ref={gridRef}>
        {bentoCards.map((card, index) => (
          <BentoCard
            key={card.title}
            card={card}
            index={index}
            cardRefs={cardRefs}
            interactive={interactive}
            active={hovered === index}
            onEnter={() => setHovered(index)}
            onLeave={() =>
              setHovered((current) => (current === index ? -1 : current))
            }
            onClick={(event) => handleRipple(event, index)}
          />
        ))}
      </div>
    </section>
  );
}
