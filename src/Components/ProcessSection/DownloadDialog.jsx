import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./DownloadDialog.css";
import { lenisRef } from "../Lenis.jsx";

// Platform picker for a product's download options.
//
// Rendered through a portal into <body>, not in place. The process section is
// pinned by ScrollTrigger and carries `overflow: hidden`, and a pinned element
// is transformed — which makes it the containing block for `position: fixed`
// descendants. A dialog rendered inside it would be positioned against the
// section and then clipped by it.
//
// Each badge deliberately wears its own platform's design language rather than
// the site's: these are the marks people scan for, and restyling them into the
// Cracker palette would make them harder to recognise, not more consistent.

const EXIT_MS = 200;

function ChromeMark() {
  // Three 120-degree wedges under a white ring and a blue centre. The wedge
  // boundaries sit at 0, 120 and 240 degrees, which is what puts red across
  // the top, green at lower-left and yellow at lower-right.
  return (
    <svg className="dlBadge__mark" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path fill="#EA4335" d="M24 24 L14 6.68 A20 20 0 0 1 44 24 Z" />
      <path fill="#FBBC05" d="M24 24 L44 24 A20 20 0 0 1 14 41.32 Z" />
      <path fill="#34A853" d="M24 24 L14 41.32 A20 20 0 0 1 14 6.68 Z" />
      <circle cx="24" cy="24" r="10.5" fill="#ffffff" />
      <circle cx="24" cy="24" r="8.5" fill="#4285F4" />
    </svg>
  );
}

function PlayMark() {
  return (
    <svg className="dlBadge__mark" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill="#00A0FF" d="M1.34.92A1.5 1.5 0 0 0 1.23 1.5v21.02c0 .21.04.42.12.6l11.15-11.09L1.34.92z" />
      <path fill="#FF3A44" d="M13.54 10.99L16.8 7.75 3.45.2A1.47 1.47 0 0 0 2.5.02l11.04 10.97z" />
      <path fill="#FFCE00" d="M22.02 13.3l-3.92 2.22-3.52-3.49 3.55-3.53 3.89 2.2a1.49 1.49 0 0 1 0 2.6z" />
      <path fill="#00E676" d="M13.54 13.06L2.54 24c.3.04.61-.02.91-.18l13.32-7.54-3.23-3.22z" />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg className="dlBadge__mark" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
      />
    </svg>
  );
}

const BADGES = {
  chrome: { Mark: ChromeMark, small: "Available in the", large: "Chrome Web Store" },
  play: { Mark: PlayMark, small: "Get it on", large: "Google Play" },
  appstore: { Mark: AppleMark, small: "Download on the", large: "App Store" },
};

export default function DownloadDialog({ open, title, subtitle, downloads, onClose }) {
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef(null);
  const restoreFocusRef = useRef(null);

  // Stay mounted through the exit animation.
  useEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }
    const timer = setTimeout(() => setMounted(false), EXIT_MS);
    return () => clearTimeout(timer);
  }, [open]);

  const close = useCallback(() => onClose?.(), [onClose]);

  useEffect(() => {
    if (!open) return;

    // Lenis animates scrollTop itself, so hiding body overflow alone would not
    // stop it. Its provider exposes the instance for exactly this.
    const lenis = lenisRef.current;
    lenis?.stop();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    restoreFocusRef.current = document.activeElement;
    panelRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      lenis?.start();
      document.body.style.overflow = previousOverflow;
      restoreFocusRef.current?.focus?.();
    };
  }, [open, close]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={`dlOverlay${open ? "" : " is-closing"}`}
      // Only a click that both starts and ends on the backdrop closes, so a
      // drag that happens to finish out here doesn't dismiss the dialog.
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        className="dlPanel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dlTitle"
        tabIndex={-1}
        ref={panelRef}
      >
        <button type="button" className="dlClose" onClick={close} aria-label="Close">
          <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path
              d="M4 4l8 8M12 4l-8 8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <h2 id="dlTitle" className="dlTitle">
          {title}
        </h2>
        {subtitle && <p className="dlSubtitle">{subtitle}</p>}

        <div className="dlOptions">
          {downloads.map((item) => {
            const badge = BADGES[item.id];
            if (!badge) return null;
            const { Mark, small, large } = badge;
            return (
              <a
                key={item.id}
                className={`dlBadge dlBadge--${item.id}`}
                href={item.href}
              >
                <Mark />
                <span className="dlBadge__text">
                  <span className="dlBadge__small">{small}</span>
                  <span className="dlBadge__large">{large}</span>
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
}
