import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, usePresence } from "framer-motion";
import "./FeatureDialog.css";
import useCountUp from "../CustomHook/useCountUp.jsx";
import useInView from "../CustomHook/useInView.jsx";
import useGenieTransition from "../CustomHook/useGenieTransition.jsx";
import { lenisRef } from "../Lenis.jsx";

const GENIE_DURATION = 450;

// The two detail CTAs ("Explore the Mechanics", "Read the Audit", and their
// per-card equivalents) are hidden until the pages they point at exist —
// shipping buttons that go nowhere is worse than not showing them at all.
// Nothing has been deleted to do this: the markup below, the styles in
// FeatureDialog.css and the ctaPrimary/ctaSecondary copy in featureDialogData.js
// are all intact, so flipping this to true is the whole job of bringing them
// back once the detail pages and audit link are ready.
const SHOW_DETAIL_CTAS = false;

const REVEAL_EASE = [0.2, 0, 0, 1];

function formatValue(value, { prefix = "", suffix = "", decimals = 0 } = {}) {
  const formatted = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString();
  return `${prefix}${formatted}${suffix}`;
}

function Stat({ stat, active }) {
  const animated = useCountUp(stat.value, {
    start: active,
    decimals: stat.decimals || 0,
    duration: 1200,
  });

  return (
    <div className="fd-stat">
      <p className="fd-stat__value">{formatValue(animated, stat)}</p>
      <p className="fd-stat__label">{stat.label}</p>
    </div>
  );
}

// Big showcase number that counts up once, and then — only for a card that asks
// for it — keeps ticking gently upward, mirroring the "always-live" figures seen
// on the reference site.
//
// The drift is opt-in (chart.live) rather than the default because most of these
// figures are fixed protocol constants: a curve target, a fee percentage, a
// creator share. Drifting those upward would not read as liveness, it would read
// as the number being wrong — "0% gap" creeping to 0.05% claims the opposite of
// what the card says. Only a genuinely cumulative figure should set the flag.
function useLiveValue(target, { active, drift = false, decimals = 0, duration = 1600 }) {
  const counted = useCountUp(target, { start: active, decimals, duration });
  const [live, setLive] = useState(counted);

  useEffect(() => setLive(counted), [counted]);

  useEffect(() => {
    if (!active || !drift) return;
    const interval = setInterval(() => {
      setLive((current) => {
        const bump = current * (0.0006 + Math.random() * 0.0012);
        const next = current + Math.max(bump, decimals > 0 ? 0.01 : 1);
        return Number(next.toFixed(decimals));
      });
    }, 2600);
    return () => clearInterval(interval);
  }, [active, drift, decimals]);

  return live;
}

function ShowcasePanel({ card, active }) {
  const liveValue = useLiveValue(card.chart.value, {
    active,
    drift: Boolean(card.chart.live),
    decimals: card.chart.decimals || 0,
    duration: 1600,
  });
  const max = Math.max(...card.chart.bars);

  // Re-plays the bar-chart grow-in every time it scrolls back into view,
  // instead of only once when the dialog first opens.
  const showcaseRef = useRef(null);
  const inView = useInView(showcaseRef, 0.4);
  const wasInView = useRef(false);
  const [playKey, setPlayKey] = useState(0);

  useEffect(() => {
    if (inView && !wasInView.current) setPlayKey((key) => key + 1);
    wasInView.current = inView;
  }, [inView]);

  return (
    <div className="fd-showcase" ref={showcaseRef}>
      <div className="fd-showcase__image-area">
        <img src={card.image} alt="" className="fd-showcase__image" />
        <span className="fd-showcase__badge">{card.badge}</span>

        <div className="fd-showcase__launch">
          <h3 className="fd-showcase__headline">{card.launchHeadline}</h3>
          <button className="fd-showcase__launch-cta" type="button">
            {card.launchCta}
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
              <path d="M1 5H13M13 5L9 1M13 5L9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div className="fd-showcase__data-area">
        <div className="fd-showcase__card-header">
          <span>{card.chart.label}</span>
          <span className="fd-live-dot" aria-hidden="true" />
        </div>
        <p className="fd-showcase__value">{formatValue(liveValue, card.chart)}</p>
        <div className="fd-chart__bars" key={playKey}>
          {card.chart.bars.map((bar, index) => (
            <span
              key={index}
              className="fd-chart__bar"
              style={{
                "--bar-height": `${(bar / max) * 100}%`,
                "--bar-delay": `${0.1 + index * 0.07}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const revealVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: REVEAL_EASE, delay },
  }),
};

export default function FeatureDialog({ card, origin, onClose }) {
  // AnimatePresence (in MainFeature.jsx) unmounts this component as soon as
  // `activeCardKey` clears. usePresence lets us hold that removal open long
  // enough to play the genie-close by hand instead of framer-motion's own
  // exit animator, which only does uniform scale/opacity — not a taper.
  const [isPresent, safeToRemove] = usePresence();
  const panelRef = useGenieTransition({
    isOpen: isPresent,
    anchor: origin ? { x: origin.x, y: origin.y } : null,
    duration: GENIE_DURATION,
    onClosed: safeToRemove,
  });

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  // Locking scroll via `overflow: hidden` removes the native scrollbar,
  // which widens the document and snaps every centered/full-width element
  // sideways. Compensate by measuring exactly how much width the scrollbar
  // was taking up and adding it back as padding, so the page's content
  // width never actually changes — the standard technique used by Radix,
  // MUI, and Bootstrap's own modal scroll-lock. useLayoutEffect so this is
  // applied before the browser paints the locked frame (no flash).
  useLayoutEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const currentPaddingRight = parseFloat(getComputedStyle(document.body).paddingRight) || 0;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${currentPaddingRight + scrollbarWidth}px`;
    }
    lenisRef.current?.stop();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      lenisRef.current?.start();
    };
  }, []);

  if (!card) return null;

  return createPortal(
    <motion.div
      className="fd-overlay"
      data-lenis-prevent
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.25 } }}
      exit={{ opacity: 0, transition: { duration: GENIE_DURATION / 1000 } }}
    >
      <div
        ref={panelRef}
        className={`fd-panel fd-panel--${card.accent}`}
        role="dialog"
        aria-modal="true"
        aria-label={card.title}
        style={{ opacity: 0 }}
      >
        <button className="fd-close" onClick={onClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>

        <div className="fd-header">
          <motion.div className="fd-intro" custom={0} variants={revealVariants} initial="hidden" animate="visible">
            <p className="fd-eyebrow">{card.eyebrow}</p>
            <h2 className="fd-title">{card.title}</h2>
            <p className="fd-description">{card.description}</p>
            {SHOW_DETAIL_CTAS && (
              <div className="fd-cta-row">
                <button className="fd-cta fd-cta--primary">
                  {card.ctaPrimary}
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                    <path d="M1 5H13M13 5L9 1M13 5L9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button className="fd-cta fd-cta--ghost">{card.ctaSecondary}</button>
              </div>
            )}
          </motion.div>

          <motion.ul className="fd-bullets" custom={0.12} variants={revealVariants} initial="hidden" animate="visible">
            {card.bullets.map((bullet) => (
              <li key={bullet}>
                <span className="fd-bullets__icon">
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                    <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span>{bullet}</span>
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div className="fd-stats" custom={0.2} variants={revealVariants} initial="hidden" animate="visible">
          {card.stats.map((stat) => (
            <Stat key={stat.label} stat={stat} active />
          ))}
        </motion.div>

        <motion.div custom={0.3} variants={revealVariants} initial="hidden" animate="visible">
          <ShowcasePanel card={card} active />
        </motion.div>
      </div>
    </motion.div>,
    document.body
  );
}
