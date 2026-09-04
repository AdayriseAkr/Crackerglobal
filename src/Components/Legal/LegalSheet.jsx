import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import "./LegalSheet.css";
import { lenisRef } from "../Lenis.jsx";
import { legalDocuments } from "./legalContent.js";

// Rises from the bottom edge rather than fading in the middle, matching the
// Main Feature dialog's "the panel comes out of the page" behaviour. Spring
// rather than a plain ease so the arrival has the same weight as the rest of
// the site's motion.
const SHEET_IN = { type: "spring", stiffness: 260, damping: 32, mass: 0.9 };
const SHEET_OUT = { duration: 0.28, ease: [0.4, 0, 1, 1] };

function Block({ block }) {
  if (block.type === "h") return <h3 className="legalSheet__subheading">{block.text}</h3>;

  if (block.type === "ul") {
    return (
      <ul className="legalSheet__list">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  if (block.type === "address") {
    return (
      <address className="legalSheet__address">
        {block.lines.map((line) => (
          <span key={line}>{line}</span>
        ))}
        <a href={`mailto:${block.email}`}>{block.email}</a>
      </address>
    );
  }

  return <p className="legalSheet__paragraph">{block.text}</p>;
}

export default function LegalSheet({ docId, onClose }) {
  const doc = legalDocuments[docId];
  const panelRef = useRef(null);

  // Page scroll is frozen while the sheet is up, exactly as FeatureDialog does
  // it: body overflow for the native scroller and lenisRef for the smooth one,
  // since stopping only one of them leaves the page drifting behind the sheet.
  // The scrollbar's width is handed back as padding so the layout underneath
  // does not jump sideways as it disappears.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    lenisRef.current?.stop();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      lenisRef.current?.start();
    };
  }, []);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Focus moves into the sheet on open, so the keyboard and screen readers are
  // inside the document rather than still on the footer behind it.
  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  // Ids are prefixed with the document so the Terms and the Privacy Policy
  // cannot collide if both have ever been mounted.
  const sectionId = (heading) =>
    `${doc.id}-${heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;

  const goToSection = (heading) => {
    document
      .getElementById(sectionId(heading))
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!doc) return null;

  return createPortal(
    <motion.div
      className="legalSheet__overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <motion.section
        ref={panelRef}
        className="legalSheet"
        role="dialog"
        aria-modal="true"
        aria-label={doc.title}
        tabIndex={-1}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ ...SHEET_IN, exit: SHEET_OUT }}
        // The overlay closes on click; without this every click inside the
        // sheet would bubble up to it and shut the document mid-read.
        onClick={(event) => event.stopPropagation()}
      >
        <header className="legalSheet__head">
          <span className="legalSheet__grip" aria-hidden="true" />
          <div className="legalSheet__titleRow">
            <div>
              <h2 className="legalSheet__title">{doc.title}</h2>
              <p className="legalSheet__updated">Last updated: {doc.lastUpdated}</p>
            </div>
            <button
              type="button"
              className="legalSheet__close"
              onClick={onClose}
              aria-label={`Close ${doc.title}`}
            >
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M1 1L13 13M13 1L1 13"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </header>

        {/* data-lenis-prevent is what makes this scroll at all. Lenis binds a
            wheel listener on the window with preventDefault, and stopping it
            does not release that grip — it just refuses to move the page, so
            the wheel did nothing anywhere, here included. This attribute tells
            Lenis to ignore events originating inside this element and let the
            browser scroll it natively. */}
        <div className="legalSheet__body" data-lenis-prevent>
          {/* Contents column. It exists to make the width useful: a 90% wide
              sheet with a single readable text column leaves half the panel
              empty, and widening the paragraphs to fill it would push the
              lines past the point anyone can read them. This puts something
              worth having in that space and makes a 17-section document
              navigable instead of one long scroll. Hidden below 900px, where
              there is no spare width to give it. */}
          {/* data-lenis-prevent again: this is a second nested scroller, and
              Lenis swallows wheel events on anything that does not carry it. */}
          <nav
            className="legalSheet__toc"
            aria-label={`${doc.title} sections`}
            data-lenis-prevent
          >
            <p className="legalSheet__tocTitle">Contents</p>
            {doc.sections.map((section) => (
              <button
                key={section.heading}
                type="button"
                className="legalSheet__tocLink"
                onClick={() => goToSection(section.heading)}
              >
                {section.heading}
              </button>
            ))}
          </nav>

          <div className="legalSheet__doc">
            {doc.sections.map((section) => (
              <section
                key={section.heading}
                id={sectionId(section.heading)}
                className="legalSheet__section"
              >
                <h3 className="legalSheet__heading">{section.heading}</h3>
                {section.blocks.map((block, index) => (
                  <Block key={index} block={block} />
                ))}
              </section>
            ))}
          </div>
        </div>
      </motion.section>
    </motion.div>,
    document.body
  );
}
