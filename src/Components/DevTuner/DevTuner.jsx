import { useCallback, useEffect, useRef, useState } from "react";

// Dev-only positioning helper.
//
// Renders a small panel of sliders that write CSS custom properties straight
// onto a target element, and prints the resulting declarations so the final
// values can be pasted back into the stylesheet. Nothing here is meant to
// ship: every call site must guard it with `import.meta.env.DEV`, which Vite
// replaces with `false` in a production build so this module is tree-shaken.
//
// The styles are a string rendered into a <style> tag rather than an imported
// .css file on purpose. Vite treats a CSS import as a side effect and merges
// it into the bundle even when the importing module is shaken out, so a
// sibling DevTuner.css would have shipped to production as dead weight.
//
// Starting values are read off the element's computed style rather than
// duplicated in a config, so the panel can't silently disagree with the CSS.

// Intentionally not in the site's palette or its 10px root — this should read
// as tooling sitting over the page, not as part of the design.
const PANEL_CSS = `
.devTuner {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 2147483000;
  width: 268px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11px;
  color: #f2f2f4;
  background: rgba(24, 22, 26, 0.94);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 10px;
  box-shadow: 0 18px 44px -12px rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  overflow: hidden;
  user-select: none;
}
.devTunerBar {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
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
.devTuner.is-collapsed .devTunerBar { border-bottom: none; }
.devTunerChevron { opacity: 0.6; }
.devTunerBody {
  padding: 11px;
  display: flex;
  flex-direction: column;
  gap: 11px;
}
.devTunerRow { display: flex; flex-direction: column; gap: 5px; }
.devTunerLabel {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  opacity: 0.78;
}
.devTunerLabel em {
  font-style: normal;
  font-weight: 600;
  color: #ffb083;
  font-variant-numeric: tabular-nums;
}
.devTunerRow input[type="range"] { width: 100%; accent-color: #fe6c25; cursor: pointer; }
.devTunerCss {
  margin: 0;
  padding: 8px 9px;
  background: rgba(0, 0, 0, 0.42);
  border-radius: 6px;
  line-height: 1.55;
  white-space: pre-wrap;
  word-break: break-word;
  color: #cfe9c8;
  user-select: text;
}
.devTunerActions { display: flex; gap: 7px; }
.devTunerActions button {
  flex: 1;
  padding: 7px 8px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.08);
  color: inherit;
  font: inherit;
  cursor: pointer;
}
.devTunerActions button:hover { background: rgba(255, 255, 255, 0.16); }
`;

export default function DevTuner({ title, targetRef, controls, storageKey }) {
  const [values, setValues] = useState(null);
  const [open, setOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const initialised = useRef(false);

  // Seed once, from localStorage if the panel has been used before, otherwise
  // from whatever the stylesheet currently says.
  useEffect(() => {
    if (initialised.current) return;
    const el = targetRef.current;
    if (!el) return;
    initialised.current = true;

    if (storageKey) {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        try {
          setValues(JSON.parse(stored));
          return;
        } catch {
          // fall through to reading the stylesheet
        }
      }
    }

    const computed = getComputedStyle(el);
    setValues(
      Object.fromEntries(
        controls.map((control) => {
          const parsed = parseFloat(
            computed.getPropertyValue(control.prop).trim()
          );
          return [control.prop, Number.isFinite(parsed) ? parsed : control.min];
        })
      )
    );
  }, [controls, storageKey, targetRef]);

  // Push to the element and remember.
  useEffect(() => {
    const el = targetRef.current;
    if (!el || !values) return;
    controls.forEach((control) => {
      el.style.setProperty(control.prop, `${values[control.prop]}${control.unit}`);
    });
    if (storageKey) {
      window.localStorage.setItem(storageKey, JSON.stringify(values));
    }
  }, [values, controls, targetRef, storageKey]);

  const reset = useCallback(() => {
    const el = targetRef.current;
    if (el) {
      controls.forEach((control) => el.style.removeProperty(control.prop));
    }
    if (storageKey) window.localStorage.removeItem(storageKey);
    initialised.current = false;
    setValues(null);
  }, [controls, storageKey, targetRef]);

  if (!values) return null;

  const css = controls
    .map((control) => `${control.prop}: ${values[control.prop]}${control.unit};`)
    .join("\n");

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
    <div className={`devTuner${open ? "" : " is-collapsed"}`}>
      <style>{PANEL_CSS}</style>
      <button
        type="button"
        className="devTunerBar"
        onClick={() => setOpen((v) => !v)}
      >
        <span>{title}</span>
        <span className="devTunerChevron">{open ? "▾" : "▸"}</span>
      </button>

      {open && (
        <div className="devTunerBody">
          {controls.map((control) => (
            <label key={control.prop} className="devTunerRow">
              <span className="devTunerLabel">
                {control.label}
                <em>
                  {values[control.prop]}
                  {control.unit}
                </em>
              </span>
              <input
                type="range"
                min={control.min}
                max={control.max}
                step={control.step ?? 1}
                value={values[control.prop]}
                onChange={(e) =>
                  setValues((v) => ({
                    ...v,
                    [control.prop]: Number(e.target.value),
                  }))
                }
              />
            </label>
          ))}

          <pre className="devTunerCss">{css}</pre>

          <div className="devTunerActions">
            <button type="button" onClick={copy}>
              {copied ? "Copied" : "Copy CSS"}
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
