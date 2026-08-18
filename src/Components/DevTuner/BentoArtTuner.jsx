import { useEffect, useMemo, useRef, useState } from "react";

// Dev-only sizing panel for the bento artwork.
//
// Every call site must guard this with `import.meta.env.DEV`, which Vite
// replaces with `false` in a production build so the module is tree-shaken out.
// The styles are a string in a <style> tag rather than an imported .css file:
// Vite treats a CSS import as a side effect and merges it into the bundle even
// when the importing module is shaken away, so a sibling stylesheet would ship
// to production as dead weight.
//
// It writes to each card's wrapper as inline custom properties, which outrank
// the .bentoCardArt--<id> rules in the stylesheet. Nothing in React sets those
// properties, so a re-render can't fight the panel.

const STORAGE_KEY = "cracker:bentoArtTuner";

const CONTROLS = [
  { prop: "--img-size", label: "Size", min: 20, max: 240, step: 1, unit: "%", fallback: 100 },
  { prop: "--img-x", label: "Nudge X", min: -80, max: 80, step: 1, unit: "%", fallback: 0 },
  { prop: "--img-y", label: "Nudge Y", min: -80, max: 80, step: 1, unit: "%", fallback: 0 },
];

const PANEL_CSS = `
.batPanel {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 2147483000;
  width: 292px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11px;
  color: #f2f2f4;
  background: rgba(24, 22, 26, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 10px;
  box-shadow: 0 18px 44px -12px rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(8px);
  overflow: hidden;
  user-select: none;
}
.batBar {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 11px;
  background: rgba(255, 255, 255, 0.06);
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: inherit;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
}
.batBody { padding: 11px; display: flex; flex-direction: column; gap: 11px; }
.batTabs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; }
.batTab {
  padding: 6px 4px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.72);
  font: inherit;
  font-size: 10px;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.batTab.is-on {
  background: #fe6c25;
  border-color: #fe6c25;
  color: #fff;
  font-weight: 700;
}
.batRow { display: flex; flex-direction: column; gap: 5px; }
.batLabel {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  opacity: 0.78;
}
.batLabel em {
  font-style: normal;
  font-weight: 600;
  color: #ffb083;
  font-variant-numeric: tabular-nums;
}
.batRow input[type="range"] { width: 100%; accent-color: #fe6c25; cursor: pointer; }
.batCss {
  margin: 0;
  padding: 8px 9px;
  max-height: 132px;
  overflow: auto;
  background: rgba(0, 0, 0, 0.42);
  border-radius: 6px;
  line-height: 1.5;
  white-space: pre;
  color: #cfe9c8;
  user-select: text;
  font-size: 10px;
}
.batActions { display: flex; gap: 7px; }
.batActions button {
  flex: 1;
  padding: 7px 8px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.08);
  color: inherit;
  font: inherit;
  cursor: pointer;
}
.batActions button:hover { background: rgba(255, 255, 255, 0.16); }
`;

const nodeFor = (id) => document.querySelector(`.bentoCardArt--${id}`);

export default function BentoArtTuner({ cards }) {
  const [values, setValues] = useState(null);
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const seeded = useRef(false);

  // Seed from localStorage if the panel has been used before, otherwise read
  // whatever the stylesheet currently says — so the sliders can never start out
  // disagreeing with the CSS.
  useEffect(() => {
    if (seeded.current || !cards.length) return;
    if (!nodeFor(cards[0].id)) return;
    seeded.current = true;

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setValues(JSON.parse(stored));
        return;
      } catch {
        // fall through to reading the stylesheet
      }
    }

    const seed = {};
    cards.forEach((card) => {
      const el = nodeFor(card.id);
      const computed = el ? getComputedStyle(el) : null;
      seed[card.id] = Object.fromEntries(
        CONTROLS.map((control) => {
          const parsed = parseFloat(
            computed ? computed.getPropertyValue(control.prop).trim() : ""
          );
          return [control.prop, Number.isFinite(parsed) ? parsed : control.fallback];
        })
      );
    });
    setValues(seed);
  }, [cards]);

  // Push to the DOM and remember.
  useEffect(() => {
    if (!values) return;
    cards.forEach((card) => {
      const el = nodeFor(card.id);
      if (!el) return;
      CONTROLS.forEach((control) => {
        el.style.setProperty(
          control.prop,
          `${values[card.id][control.prop]}${control.unit}`
        );
      });
    });
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
  }, [values, cards]);

  const css = useMemo(() => {
    if (!values) return "";
    return cards
      .map((card) => {
        const body = CONTROLS.map(
          (control) =>
            `  ${control.prop}: ${values[card.id][control.prop]}${control.unit};`
        ).join("\n");
        return `.bentoCardArt--${card.id} {\n${body}\n}`;
      })
      .join("\n");
  }, [values, cards]);

  if (!values) return null;

  const card = cards[selected];

  const reset = () => {
    cards.forEach((c) => {
      const el = nodeFor(c.id);
      if (el) CONTROLS.forEach((ctl) => el.style.removeProperty(ctl.prop));
    });
    window.localStorage.removeItem(STORAGE_KEY);
    seeded.current = false;
    setValues(null);
  };

  const copy = () => {
    navigator.clipboard?.writeText(css).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      },
      () => setCopied(false)
    );
  };

  return (
    <div className="batPanel">
      <style>{PANEL_CSS}</style>

      <button type="button" className="batBar" onClick={() => setOpen((v) => !v)}>
        <span>Bento artwork</span>
        <span style={{ opacity: 0.6 }}>{open ? "▾" : "▸"}</span>
      </button>

      {open && (
        <div className="batBody">
          <div className="batTabs">
            {cards.map((c, i) => (
              <button
                key={c.id}
                type="button"
                className={`batTab${i === selected ? " is-on" : ""}`}
                onClick={() => setSelected(i)}
              >
                {String(i + 1).padStart(2, "0")} {c.label}
              </button>
            ))}
          </div>

          {CONTROLS.map((control) => (
            <label key={control.prop} className="batRow">
              <span className="batLabel">
                {control.label}
                <em>
                  {values[card.id][control.prop]}
                  {control.unit}
                </em>
              </span>
              <input
                type="range"
                min={control.min}
                max={control.max}
                step={control.step}
                value={values[card.id][control.prop]}
                onChange={(e) =>
                  setValues((v) => ({
                    ...v,
                    [card.id]: {
                      ...v[card.id],
                      [control.prop]: Number(e.target.value),
                    },
                  }))
                }
              />
            </label>
          ))}

          <pre className="batCss">{css}</pre>

          <div className="batActions">
            <button type="button" onClick={copy}>
              {copied ? "Copied" : "Copy all CSS"}
            </button>
            <button type="button" onClick={reset}>
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
