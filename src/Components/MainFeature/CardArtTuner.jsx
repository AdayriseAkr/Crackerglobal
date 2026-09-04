import { useCallback, useEffect, useMemo, useState } from "react";
import "./CardArtTuner.css";

/* A tuning panel for the four Main Feature card images: zoom, opacity, and
   where the crop sits on each axis.

   It exists because framing a cover-cropped image is not something you can
   work out from the file. The card box is one aspect ratio on a laptop and
   another on a tablet, the artwork is a third, and object-fit decides what
   survives — so the only way to know whether the robot's tracks are cut off is
   to look at it in the card, at that width, and move it.

   WHAT IT WRITES: four CSS custom properties per card, read by .featureBlock
   img in MainFeature.css. Nothing here changes the images themselves. The
   values are a starting point you tune by eye and then paste back into the
   stylesheet with Copy CSS — this panel is not how the site ships, it is how
   you find the numbers that do. */

const CARDS = [
  { cls: "topLeftCard", label: "01 Liquidity Locked" },
  { cls: "bottomLeftCard", label: "02 Zero Price Gap" },
  { cls: "topRightCard", label: "03 Snipers Pay Most" },
  { cls: "bottomRightCard", label: "04 Earn Every Trade" },
];

const DEFAULTS = { scale: 1, opacity: 1, x: 50, y: 50 };

const FIELDS = [
  { key: "scale", label: "Size", min: 0.5, max: 2.5, step: 0.01, unit: "x" },
  { key: "opacity", label: "Opacity", min: 0, max: 1, step: 0.01, unit: "" },
  { key: "x", label: "Position X", min: 0, max: 100, step: 0.5, unit: "%" },
  { key: "y", label: "Position Y", min: 0, max: 100, step: 0.5, unit: "%" },
];

const STORE_KEY = "crackerCardArtTuner";

/* Dev by default, and on any build via ?tune in the URL.

   The second half is deliberate. These cards are reviewed on a phone against a
   deployed preview, and a control that only exists on localhost cannot be used
   where the framing problem is actually visible. It is opt-in per URL, so an
   ordinary visitor never sees it, and it renders nothing at all unless asked
   for — the JSX below sits behind this flag so a production build with the
   flag statically false drops it. */
function tunerEnabled() {
  if (typeof window === "undefined") return false;
  if (import.meta.env.DEV) return true;
  return new URLSearchParams(window.location.search).has("tune");
}

function loadSaved() {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    // Private mode, blocked storage, malformed JSON from an older shape.
    return {};
  }
}

export default function useCardArtTuner() {
  const [enabled] = useState(tunerEnabled);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(CARDS[0].cls);
  const [values, setValues] = useState(() => (tunerEnabled() ? loadSaved() : {}));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(values));
    } catch {
      // Not worth interrupting a tuning session over.
    }
  }, [values, enabled]);

  const valueFor = useCallback(
    (cls) => ({ ...DEFAULTS, ...(values[cls] || {}) }),
    [values]
  );

  /* The style each <img> gets. Custom properties rather than direct
     object-position/transform declarations, so the CSS keeps ownership of how
     they are used and this only supplies numbers. Undefined when the tuner is
     off, so React writes no inline style at all and the stylesheet's own
     defaults apply untouched. */
  const styleFor = useCallback(
    (cls) => {
      if (!enabled || !values[cls]) return undefined;
      const v = valueFor(cls);
      return {
        "--art-scale": v.scale,
        "--art-opacity": v.opacity,
        "--art-x": `${v.x}%`,
        "--art-y": `${v.y}%`,
      };
    },
    [enabled, values, valueFor]
  );

  const set = (cls, key, n) =>
    setValues((prev) => ({
      ...prev,
      [cls]: { ...DEFAULTS, ...(prev[cls] || {}), [key]: n },
    }));

  const resetActive = () =>
    setValues((prev) => {
      const next = { ...prev };
      delete next[active];
      return next;
    });

  // Only cards actually moved off the defaults, so the output is a patch to
  // paste rather than four blocks of mostly-default noise.
  const css = useMemo(() => {
    const lines = CARDS.flatMap(({ cls, label }) => {
      const v = valueFor(cls);
      const parts = [];
      if (v.scale !== 1) parts.push(`--art-scale: ${v.scale};`);
      if (v.opacity !== 1) parts.push(`--art-opacity: ${v.opacity};`);
      if (v.x !== 50) parts.push(`--art-x: ${v.x}%;`);
      if (v.y !== 50) parts.push(`--art-y: ${v.y}%;`);
      if (!parts.length) return [];
      return [`/* ${label} */`, `.${cls} img{`, ...parts.map((p) => `  ${p}`), `}`];
    });
    return lines.length ? lines.join("\n") : "/* nothing changed yet */";
  }, [valueFor]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(css);
    } catch {
      // Clipboard needs a secure context; on plain http the textarea below is
      // still selectable by hand, so this is not a dead end.
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const panel = !enabled ? null : (
    <div className={`cardArtTuner${open ? " is-open" : ""}`}>
      <button
        type="button"
        className="cardArtTunerToggle"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "Close" : "Tune art"}
      </button>

      {open && (
        <div className="cardArtTunerBody">
          <div className="cardArtTunerTabs">
            {CARDS.map((c) => (
              <button
                type="button"
                key={c.cls}
                className={active === c.cls ? "is-active" : ""}
                onClick={() => setActive(c.cls)}
              >
                {c.label.slice(0, 2)}
              </button>
            ))}
          </div>

          <p className="cardArtTunerName">
            {CARDS.find((c) => c.cls === active)?.label}
          </p>

          {FIELDS.map((f) => {
            const v = valueFor(active)[f.key];
            return (
              <label key={f.key} className="cardArtTunerRow">
                <span>{f.label}</span>
                <input
                  type="range"
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  value={v}
                  onChange={(e) => set(active, f.key, Number(e.target.value))}
                />
                <output>
                  {f.key === "scale" || f.key === "opacity" ? v.toFixed(2) : v}
                  {f.unit}
                </output>
              </label>
            );
          })}

          <div className="cardArtTunerActions">
            <button type="button" onClick={resetActive}>
              Reset this card
            </button>
            <button type="button" onClick={copy}>
              {copied ? "Copied" : "Copy CSS"}
            </button>
          </div>

          <textarea className="cardArtTunerOut" readOnly value={css} rows={6} />
        </div>
      )}
    </div>
  );

  return { styleFor, panel };
}
