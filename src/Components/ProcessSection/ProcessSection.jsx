import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ProcessSection.css";
import { processSteps } from "./processData";

gsap.registerPlugin(ScrollTrigger);

// Pinned, scroll-linked process section.
//
// ScrollTrigger pins the section and reports its own 0..1 progress, which maps
// onto a step position 0..n-1. The tracker is a large ring whose centre sits
// off-screen to the left: each number is pegged to a fixed angle on that ring,
// and the ring itself counter-rotates by the current step position, so whoever
// is active swings round to 3 o'clock. Because each number is placed with
// `rotate(angle) translateX(radius)`, it carries the ring's rotation with it —
// which is what tilts the waiting numbers and leaves the active one upright.
//
// The ring angle is written straight to a CSS custom property each frame
// rather than through React: it changes every frame, and re-rendering the
// section that often for one number would be wasteful. Only the step index
// goes through state, and only when it actually changes.
//
// Every panel and image stays mounted, stacked, so the outgoing one can
// animate out while the incoming one animates in. Which one is visible at rest
// is decided by CSS off the .is-active class, so if GSAP never runs the
// section still shows a readable step rather than a blank or a stack of four.

const PIN_SCREENS_PER_STEP = 1; // viewport heights of scroll each step gets
// Angular gap between consecutive numbers. The visible gap between two circles
// is arc length — radius * this — minus their diameter, so it collapses on a
// short window where the radius bottoms out at its clamp floor. Raising it also
// makes the trail climb higher, since the numbers span
// radius * sin((n-1) * this) vertically, all of it upward from the active slot.
const RING_STEP_DEG = 18;
const DESKTOP_QUERY = "(min-width: 768px)";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function ProcessSection() {
  const sectionRef = useRef(null);
  const ringRef = useRef(null);
  const panelRefs = useRef([]);
  const imageRefs = useRef([]);

  const [active, setActive] = useState(0);
  const activeRef = useRef(0); // read inside the scroll callback without re-subscribing
  const previousRef = useRef(0);

  // Only true while the desktop pin is live. Below 768px every panel is on
  // screen at once, so hiding the inactive ones from assistive tech would be a
  // lie about what's actually rendered.
  const [pinned, setPinned] = useState(false);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Pinning is desktop-only. On a phone the section falls back to a plain
    // stacked list (see the media query in the stylesheet) — scroll-jacking a
    // touch device fights the platform's own scrolling and reads as broken.
    const mm = gsap.matchMedia();

    mm.add(DESKTOP_QUERY, () => {
      setPinned(true);

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () =>
          `+=${window.innerHeight * processSteps.length * PIN_SCREENS_PER_STEP}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Continuous step position, 0 .. n-1. The ring follows this rather
          // than the rounded index, so it turns smoothly with the wheel
          // instead of snapping between numbers.
          const position = self.progress * (processSteps.length - 1);

          ringRef.current?.style.setProperty(
            "--ring-angle",
            `${(position * RING_STEP_DEG).toFixed(3)}deg`
          );

          // Rounded, so a number goes solid as it settles at 3 o'clock.
          const index = Math.round(position);

          if (index !== activeRef.current) {
            activeRef.current = index;
            setActive(index);
          }
        },
      });

      return () => {
        trigger.kill();
        setPinned(false);
        activeRef.current = 0;
        setActive(0);
      };
    });

    return () => mm.revert();
  }, []);

  // Cross-transition on step change. The outgoing panel/image lifts and fades
  // out; the incoming pair rises in from below, slightly behind it so the two
  // read as a handoff rather than a dissolve.
  useEffect(() => {
    const from = previousRef.current;
    const to = active;
    previousRef.current = to;
    if (from === to) return;

    const outPanel = panelRefs.current[from];
    const inPanel = panelRefs.current[to];
    const outImage = imageRefs.current[from];
    const inImage = imageRefs.current[to];

    const outgoing = [outPanel, outImage].filter(Boolean);
    const incoming = [inPanel, inImage].filter(Boolean);
    if (!incoming.length) return;

    gsap.killTweensOf([...outgoing, ...incoming]);

    if (prefersReducedMotion()) {
      gsap.set(outgoing, { opacity: 0 });
      gsap.set(incoming, { opacity: 1, y: 0, scale: 1 });
      return;
    }

    gsap.to(outPanel, {
      opacity: 0,
      y: -36,
      duration: 0.38,
      ease: "power2.in",
    });
    gsap.to(outImage, {
      opacity: 0,
      y: -28,
      scale: 0.97,
      duration: 0.4,
      ease: "power2.in",
    });

    gsap.fromTo(
      inPanel,
      { opacity: 0, y: 48 },
      { opacity: 1, y: 0, duration: 0.62, ease: "power3.out", delay: 0.08 }
    );
    gsap.fromTo(
      inImage,
      { opacity: 0, y: 64, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.08,
      }
    );
  }, [active]);

  return (
    <section className="processSection" ref={sectionRef}>
      {/* Dissolve the ring into the page at the edges, so the arc has no hard
          cut-off and never collides with the heading. Painted above the ring
          but below the text and visual, which keeps those crisp. */}
      <span className="processFade processFade--bottom" aria-hidden="true" />
      <span className="processFade processFade--left" aria-hidden="true" />
      <span className="processFade processFade--top" aria-hidden="true" />

      <div className="processInner">
        <header className="processIntro">
          <span className="processEyebrow">The Process</span>
          <h1>Four products, one ecosystem</h1>
        </header>

        <div className="processBody">
          {/* Left: rotating ring tracker. Decorative — every number is stated
              again as "Phase 0X" in the active panel, so announcing the ring
              too would just read the same sequence twice. */}
          <div className="processRing" ref={ringRef} aria-hidden="true">
            <span className="processRingPath" />
            {processSteps.map((step, index) => (
              <span
                key={step.id}
                className={`processRingStep${
                  index === active ? " is-active" : ""
                }${index < active ? " is-done" : ""}`}
                style={{ "--angle": `${-index * RING_STEP_DEG}deg` }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            ))}
          </div>

          {/* Centre column: text */}
          <div className="processStage">
            {processSteps.map((step, index) => (
              <article
                key={step.id}
                ref={(el) => {
                  panelRefs.current[index] = el;
                }}
                className={`processPanel${index === active ? " is-active" : ""}`}
                aria-hidden={pinned && index !== active}
              >
                <p className="processPhase">
                  Phase {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="processTitle">{step.title}</h2>
                <p className="processText">{step.description}</p>
                <ul className="processTags">
                  {step.tags.map((tag) => (
                    <li key={tag} className="processTag">
                      {tag}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          {/* Right column: visual */}
          <div className="processVisual">
            {processSteps.map((step, index) => (
              <img
                key={step.id}
                ref={(el) => {
                  imageRefs.current[index] = el;
                }}
                className={`processImage${index === active ? " is-active" : ""}`}
                src={step.image}
                alt=""
                aria-hidden="true"
                draggable="false"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
