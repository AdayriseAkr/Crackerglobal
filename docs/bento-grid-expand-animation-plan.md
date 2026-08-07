# Stripe-style "Bento Grid → Expanding Detail Card" — Reverse-Engineering Notes & Build Plan

Source studied: `stripe.com/in` homepage, section **"Powering businesses of all sizes"** (internally named
`modular-solutions-bento` in Stripe's markup) — the grid with cards like *Accept and optimise payments*,
*Enable any billing model*, *Monetise through agentic commerce*, *Create a card issuing programme*,
*Access borderless money movement with stablecoins and crypto*, *Embed payments in your platform*.

Investigated live via DOM inspection (computed styles, class names, attributes) and by downloading Stripe's
production CSS bundles and reading the unminified rules for `.modular-solutions-bento-card`, `.hds-dialog`,
`.bento-dialog*`, and the usage-billing graphic. All values below are taken directly from that CSS — not guessed.

---

## 1. What's actually happening (mental model)

This is **not** a grid cell that grows in place (no FLIP/shared-layout morph, no grid-template animation).
It's simpler and more robust:

1. The grid card is a `<button>`. Clicking it opens a **modal dialog** (`role="dialog"`, `aria-modal="true"`)
   that is centered over a **dimmed/blurred backdrop**, while the grid stays exactly where it is underneath.
2. The dialog panel **slides up + fades in** using a `transform: translateY(...)` transition driven by a
   `data-status` attribute (`initial` → `open` → `close`), not by animating width/height/position.
3. Once mounted, the dialog's *inner content* (headline, bullet list, graphics) plays a **staggered
   fade-up reveal** — each block starts 30px lower and transparent, then eases into place with small
   per-item delays, which is what reads as "stuff smoothly animating in".
4. The "numbers increasing" impression the user described is the **bar chart's bars scaling up from a
   bottom origin** (`transform-origin: bottom`) during the reveal, plus a value label — not a live counting
   animation.
5. A close (✕) button collapses the same transform in reverse, faster, and the backdrop fades out.

So the recipe is: **grid of trigger buttons → overlay + sliding modal → staggered content reveal**. That's
achievable with plain CSS transitions/keyframes plus a small amount of state in React. No animation library
is required (Stripe doesn't use Framer Motion/GSAP for this — it's hand-rolled CSS transitions triggered by
a state attribute).

---

## 2. Grid layout (the collapsed "bento" cards)

Flex-wrap layout, **not CSS Grid** — each card has an explicit `flex-basis` + `aspect-ratio` per breakpoint
so the mosaic (one wide card, several thirds, one full-width strip) is achieved without grid-template-areas:

```css
.bento-layout { display: flex; flex-wrap: wrap; gap: 8px; width: 100%; }

/* mobile: everything stacks full width */
.bento-card { flex-basis: 100%; max-height: 576px; }

/* tablet: two-up */
@media (min-width: 640px) {
  .bento-card { flex-basis: calc(50% - 8px); max-height: none; }
}

/* desktop: mosaic sizes per card */
@media (min-width: 940px) {
  .bento-card--wide      { aspect-ratio: 816/676;  max-width: 816px;  flex-basis: calc(66.666% - 8px); }
  .bento-card--third     { aspect-ratio: 400/676;  max-width: 400px;  flex-basis: calc(33.333% - 8px); }
  .bento-card--full-strip{ aspect-ratio: 1232/450; max-width: 1232px; flex-basis: 100%; }
}
```

### Card element anatomy
Each card is a `<button>` (not a link) containing:
- `__background` — absolutely positioned base fill
- `__graphic` — the illustration/screenshot, own `inset` offsets per card
- `__inner` — white rounded mask layer (`inset: 0`, `border-radius: calc(var(--card-radius) - 1px)`)
- `__border` — 1px hairline border layer, separate from `__inner` so it can clip independently
- `__border-color` + `__border-color-gradient` — a soft **radial-gradient spotlight that follows the mouse**
  (see §3)
- `__text` (title) — absolutely positioned top-left
- `__dialog-entry` — a small 38×38 circular "expand" icon button, top-right

### Card hover micro-interactions (desktop, `pointer: fine` only)
```css
.bento-card {
  --card-ease: cubic-bezier(0.165, 0.84, 0.44, 1);
  --card-duration: 800ms;
  --card-radius: var(--radius-md);
  cursor: pointer;
  contain: layout style;
}

.bento-card__border-color-gradient {
  position: absolute; inset: 0; opacity: 0.5;
  background: radial-gradient(circle, var(--brand-400), var(--magenta-350) 33%, var(--neutral-50) 66%);
  transform: translate3d(var(--card-mouse-x), var(--card-mouse-y), 0);
  transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1); /* spotlight eases toward cursor, doesn't snap */
  will-change: transform;
}
.bento-card:hover .bento-card__border-color { opacity: 1; } /* spotlight only visible on hover */

/* title + expand icon nudge slightly toward the cursor on hover, in opposite directions */
.bento-card:hover .bento-card__title {
  transform: translate(var(--card-shift-x), var(--card-shift-y));
}
.bento-card:hover .bento-card__dialog-entry {
  transform: translate(calc(var(--card-shift-x) * -1), var(--card-shift-y));
}

/* expand icon: fills solid on hover, arrow glyph paths splay diagonally */
.bento-card__dialog-entry:before { opacity: 0; background: var(--action-bg-solid); transition: opacity .6s cubic-bezier(.16,1,.3,1); }
.bento-card:hover .bento-card__dialog-entry:before { opacity: 1; }
.bento-card:hover .bento-card__dialog-entry svg path:first-child  { transform: translate(2px, -2px); }
.bento-card:hover .bento-card__dialog-entry svg path:nth-child(2) { transform: translate(-2px, 2px); }
```
`--card-mouse-x/y` and `--card-shift-x/y` are plain custom properties written from a `pointermove` listener
on the card (percentage or px offset from card center, clamped). This is the only JS-per-frame work needed
on the grid itself — everything else is CSS `transition`.

---

## 3. The expanding dialog (click → detail view)

### 3.1 Structure
```
<div class="dialog-overlay" data-status="open|initial|close">   ← fixed, full-viewport, dimmed backdrop
  <div class="dialog-snap-container">                            ← position:absolute, positions the panel
    <div class="dialog-panel" role="dialog" aria-modal="true"
         data-status="open|initial|close">                       ← the actual white card, animates
      <button class="dialog-close">✕</button>
      <div class="dialog-intro">…title / copy / CTAs…</div>
      <ul class="dialog-checklist">…bullet points…</ul>
      <div class="dialog-graphics">…illustration(s)…</div>
    </div>
  </div>
</div>
```

### 3.2 Backdrop
```css
.dialog-overlay {
  position: fixed; inset: 0; overflow: auto; max-height: 100vh;
  display: flex; justify-content: center;
  background-color: rgb(229 237 245 / 0.9);   /* mobile/desktop alpha */
  transition-property: opacity, background-color;
}
@media (min-width: 640px) {
  .dialog-overlay { background-color: rgb(229 237 245 / 0.7); }
}
.dialog-overlay[data-status="initial"] { opacity: 0; }
.dialog-overlay[data-status="open"]    { opacity: 1; transition-duration: .25s; }
.dialog-overlay[data-status="close"]   { opacity: 0; transition-duration: .3s; }

/* prevent background scroll while open */
html:has(.dialog-overlay) { overflow: hidden; }
```

### 3.3 The panel — this is the "smoothly extends from bottom to up" effect
This is the exact mechanism the user noticed. It's a **3-state transform, not a size animation**:

```css
.dialog-panel {
  background-color: var(--surface-bg-quiet);
  border-radius: 16px;
  margin: 5vh 0;
  max-width: 75vw;
  overflow-y: auto;
  transform-origin: top;
  transition-property: transform;
}

.dialog-panel[data-status="initial"] { transform: translateY(200px); }         /* starts below/offscreen */
.dialog-panel[data-status="open"] {
  transform: translateY(0);
  transition-duration: 0.8s;
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);                  /* "ease-out-expo" — the key feel */
}
.dialog-panel[data-status="close"] {
  transform: translateY(100px);
  transition-duration: 0.3s;                                                  /* closes ~2.5x faster than it opens */
}
```

**`cubic-bezier(0.22, 1, 0.36, 1)`** is the single most important value to copy — it's a fast-start,
long-soft-settle curve (sometimes called "ease-out-expo/quint") that gives that expensive, weighty-but-quick
feel. Reuse it for anything else that should feel like this component.

State machine (plain React, no library needed):
```
mount request → render with data-status="initial" (1 frame)
              → next frame (rAF or CSS transition already primed) → set data-status="open"
close request → set data-status="close" → after 300ms timeout, unmount
```
The one-frame `"initial"` step matters: it's what lets the browser paint the pre-animation position before
the transition to `"open"` kicks in — otherwise the transform jump wouldn't animate.

### 3.4 Mobile (< 640px) becomes a bottom sheet
```css
@media (max-width: 639px) {
  .dialog-panel {
    align-self: end; width: 100%; max-width: none;
    border-bottom-left-radius: 0; border-bottom-right-radius: 0;
    padding: 0;
  }
  .dialog-overlay { position: fixed; inset: 0; overflow: hidden; touch-action: none; }
  .dialog-snap-container {
    position: relative; height: 100dvh; overflow-y: scroll;
    scroll-snap-type: y mandatory; overscroll-behavior: none;
    scrollbar-width: none;
  }
  .dialog-snap-spacer  { height: 100dvh; scroll-snap-align: start; }  /* empty spacer = swipe-down-to-dismiss target */
  .dialog-snap-content { scroll-snap-align: end; }
  .dialog-drag-handle   { /* small pill indicator at top, purely visual affordance to drag down */ }
}
```
This is a nice detail worth keeping if you build the mobile version: instead of custom swipe-gesture JS,
Stripe uses **CSS scroll-snap** — the sheet's container is a scrollable area with a full-height spacer above
the content; scrolling that container down snaps back to the spacer, which the app treats as "closed" via a
scroll listener. Low-JS, very smooth, works with native momentum scrolling.

### 3.5 Close button
```css
.dialog-close {
  position: absolute; top: 24px; right: 24px;   /* desktop */
  width: 40px; height: 40px; border-radius: 8px;
  display: inline-flex; align-items: center; justify-content: center;
  cursor: pointer; border: none; background: transparent;
  transition: background-color .3s cubic-bezier(.25,1,.5,1);
}
.dialog-close:hover { background-color: var(--button-ui-bg-hover); }
```

---

## 4. Content reveal inside the dialog (the "smooth… animation inside it" part)

Every content block that should animate in gets one shared utility class:

```css
@keyframes reveal-fade-in-up {
  0%  { opacity: 0; transform: translate3d(0, 30px, 0); }
  100%{ opacity: 1; transform: translateZ(0); }
}

.reveal {
  --reveal-delay: 0ms;
  opacity: 0;
  transform: translate3d(0, 30px, 0);
  animation: reveal-fade-in-up 0.75s cubic-bezier(0.2, 0, 0, 1) var(--reveal-delay) forwards;
}
.reveal--delay { --reveal-delay: 100ms; }

/* auto-stagger when multiple graphic panels sit side by side */
@media (min-width: 940px) {
  .dialog-graphics :nth-child(2) .reveal { animation-delay: calc(var(--reveal-delay) + 0.1s); }
  .dialog-graphics :nth-child(3) .reveal { animation-delay: calc(var(--reveal-delay) + 0.2s); }
}
```
Apply `.reveal` to: the intro copy block, the bullet checklist, and each graphic card. Because it's a plain
CSS `animation` (not JS-triggered), it just needs the element to exist in the DOM at panel-open time — no
IntersectionObserver required inside the dialog (the dialog itself only exists once opened).

### The bar chart "increasing numbers" detail
```css
.chart-bars { display: flex; align-items: flex-end; justify-content: center; gap: 3px; }
.chart-bar  { width: 4px; height: 134px; background: #9966ff; border-radius: 1px; transform-origin: bottom; }
```
Bars are rendered at full target height but with `transform-origin: bottom`; wrap each bar (or the whole
`.chart-bars` container) in the same `.reveal`/scale treatment — e.g. animate `transform: scaleY(0) → scaleY(1)`
per bar with a tiny staggered delay (`calc(var(--i) * 20ms)`), which reads exactly like the "numbers climbing"
effect without any actual number-counting JS. Pair with a static value label using tabular (monospace-width)
numerals so nothing jitters:
```css
.chart-value { font-variant-numeric: tabular-nums; }
```

### The connecting line + arrow (invoice → meter card)
Stripe animates a small dot/arrow **along an SVG path** using native CSS motion:
```css
.line-arrow {
  offset-path: path("M96.09 91.345V8.5a8 8 0 0 0-8-8H0");
  offset-distance: 5px;              /* animate this 0% → 100% to travel the path */
  transform: rotate(-29deg);
}
.line-cap-pulse {
  width: 32px; height: 32px; border-radius: 50%;
  background: rgba(153, 102, 255, 0.15);   /* soft radiating dot at the anchor point */
}
```
`offset-path` + animating `offset-distance` is the modern, cheap way to move something along a curved
connector line — no SVG `<animateMotion>` or JS rAF loop needed.

---

## 5. Minimal implementation checklist for a React port

1. **Data model**: one array of card configs — `{ id, size: 'wide'|'third'|'full', title, graphic, dialogContent }`.
2. **Grid**: flex-wrap container + `<button>` per card, size class picks `flex-basis`/`aspect-ratio` per §2.
3. **Hover spotlight**: one `pointermove` handler per card writing `--card-mouse-x/y` (and optionally
   `--card-shift-x/y`) inline via `style.setProperty` — cheap, no re-render.
4. **Dialog state**: `const [openCard, setOpenCard] = useState(null)` + a `status` state
   (`'initial' | 'open' | 'closing'`) driven by the two-step mount pattern in §3.3. Render dialog in a
   portal to `document.body`.
5. **Dialog panel CSS**: copy the `data-status` transform rules verbatim from §3.3 — this is the highest-value
   piece to get pixel/timing-exact.
6. **Content reveal**: apply `.reveal` (§4) to each direct content block inside the panel; no extra JS.
7. **Close**: set status to `'close'`, `setTimeout(() => setOpenCard(null), 300)` to match the CSS duration.
8. **Escape key / backdrop click** should also trigger the same close path.
9. **Reduced motion**: wrap all `animation`/`transition` declarations that aren't purely functional (opacity
   for backdrop dimming can stay) in `@media (prefers-reduced-motion: no-preference)`, matching Stripe's own
   approach of disabling the fancy reveal choreography (but keeping instant end-states) for users who opt out.

---

## 6. Key numbers to reuse (cheat sheet)

| Purpose | Value |
|---|---|
| Panel open easing | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Panel open duration | `0.8s` |
| Panel close duration | `0.3s` (translateY 100px) |
| Panel initial offset | `translateY(200px)` |
| Backdrop fade in/out | `.25s` / `.3s` |
| Backdrop color (desktop / mobile) | `rgb(229 237 245 / 0.7)` / `rgb(229 237 245 / 0.9)` |
| Content reveal easing | `cubic-bezier(0.2, 0, 0, 1)` |
| Content reveal duration | `0.75s`, rise from `translate3d(0,30px,0)` |
| Content reveal stagger step | `100ms` per subsequent block |
| Card border spotlight easing | `cubic-bezier(0.16, 1, 0.3, 1)`, `1s` |
| Card hover/clip easing | `cubic-bezier(0.165, 0.84, 0.44, 1)`, `800ms` |
| Panel border radius | `16px` (1rem) |
| Panel max-width (desktop) | `75vw` |

---

*Next step: tell me which section of your site (hero, features grid, etc.) should get this treatment and I'll
adapt these values/structure to your existing components.*
