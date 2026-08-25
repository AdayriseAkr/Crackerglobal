# Cracker Landing — Design System

Reverse-documented from the actual CSS in `src/`, not from a spec. Every value below is
lifted from a real rule, with a file reference so you can find it. Where the codebase is
inconsistent, this doc says so rather than inventing a "correct" value.

**Read this first:** there is no central token file. Colours, radii and easings are
hardcoded per component stylesheet. The single exception is
[FeatureDialog.css](../src/Components/MainFeature/FeatureDialog.css#L2-L14), which declares
CSS custom properties scoped to `.fd-overlay`. That block is effectively the closest thing
this project has to a token definition, and it's the best starting point if you ever
centralise them.

---

## 1. The 10px root — read before touching any font size

[index.css:10-13](../src/index.css#L10-L13) sets `html { font-size: 10px; }`.

Everything in the codebase is authored against that. **`1rem = 10px`, not 16px.**

| Written | Actual |
|---|---|
| `1rem` | 10px |
| `1.2rem` | 12px |
| `1.5rem` | 15px |
| `2.5rem` | 25px |
| `5rem` | 50px |

So `font-size: 1.5rem` — which appears everywhere as body/secondary text — is **15px**, not
24px. If you paste in CSS from a normal 16px-root project, every size will render ~1.6×
too large. Divide by 1.6, or convert to px.

Consequence for accessibility: a hard 10px root overrides the user's browser font-size
preference. Anything below ~1.2rem (12px) is already at the edge of legibility, and
`FeatureDialog` goes to 10px and 8px for eyebrows on mobile
([FeatureDialog.css:99, 440](../src/Components/MainFeature/FeatureDialog.css#L98-L105)).

---

## 2. Typography

### Families

Loaded in one Google Fonts import at [index.css:2](../src/index.css#L2):

| Family | Role | Where |
|---|---|---|
| **Inter** (variable, 100–900, incl. italic) | Everything by default | `body` at [index.css:18](../src/index.css#L18); re-declared explicitly on `.fd-panel` and `.fd-showcase__launch-cta` |
| **Bagel Fat One** | One display moment only — the giant footer wordmark | [Footer.css:130](../src/Components/Footer/Footer.css#L127-L133) |
| **Baumans** | Accent display — the mailto link and the dialog showcase headline | [Footer.css:191](../src/Components/Footer/Footer.css#L188-L194), [FeatureDialog.css:283](../src/Components/MainFeature/FeatureDialog.css#L282-L290) |

Two live inconsistencies worth knowing:

- The **hero headline explicitly opts out of Inter** —
  [HeroSection.css:47](../src/Components/HeroSection/HeroSection.css#L44-L50) sets
  `font-family: Arial, Helvetica, sans-serif`. So the largest type on the page is not in
  the brand typeface. Whether that's intentional (Arial Black-ish weight at `bolder`) or
  leftover scaffolding is not recorded anywhere.
- `.cardRotateParent` sets `font-family: sans-serif`
  ([CardRotate.css:10](../src/Components/CardRotate/CardRotate.css#L10)), dropping Inter
  for that whole section's subtree.

### The fluid-size idiom

The project's one consistent sizing pattern is `max(<rem floor>, <vw preferred>)`:

```css
font-size: max(3.5rem, 2.5vw);   /* hero H1 — never below 35px, grows with viewport */
font-size: max(2.5rem, 1.8vw);   /* section H1 */
font-size: max(4rem, 2.5vw);     /* big statement copy */
font-size: max(1.2rem, 0.8vw);   /* small print */
```

`max()` here means the rem value is a **floor**, and `vw` takes over on wide screens. There
is no upper clamp, so type keeps growing indefinitely on ultrawide displays. `clamp()` is
used in only two places — [CardRotate.css:53, 224](../src/Components/CardRotate/CardRotate.css#L53)
and throughout `FeatureDialog.css` — which is the more modern of the two idioms in the repo.

`FeatureDialog.css` breaks the pattern again by using **raw px** for type (`42px` title,
`12px` description, `36px` stat value). It's the newest file and the least aligned with the
rest.

### Scale in practice

| Role | Size | Weight | Example |
|---|---|---|---|
| Hero headline | `max(3.5rem, 2.5vw)` | `bold`/`bolder` | [HeroSection.css:44](../src/Components/HeroSection/HeroSection.css#L44-L50) |
| Footer wordmark | `max(7rem, 4.5vw)` | `bolder`, Bagel Fat One | [Footer.css:128](../src/Components/Footer/Footer.css#L127-L133) |
| Big statement / community headline | `max(4rem, 2.5vw)` | 500–700 | [BriefSection.css:16](../src/Components/BriefSection/BriefSection.css#L15-L22), [Community.css:71](../src/Components/Community/Community.css#L69-L75) |
| Section heading (H1) | `max(2.5rem, 1.8vw)` | default | [MainFeature.css:40](../src/Components/MainFeature/MainFeature.css#L38-L41) |
| Card heading | `max(2.5rem, 1.8vw)` | 600 | [WhySection.css:127](../src/Components/WhySection/WhySection.css#L125-L132) |
| Body / nav / sub-copy | `1.5rem` (15px) | 300 (body default) | ubiquitous |
| Small print, tags, legal | `1.2rem` (12px) | 400–500 | [Footer.css:83](../src/Components/Footer/Footer.css#L82-L85) |

Line-height is set as **percentages**, not unitless: `95%`, `105%`, `107%`, `110%`, `132%`.
Percentages resolve against the element's own font-size, so they behave like unitless
values here, but they are **not inherited the same way** — a child with a different
font-size inherits the computed px, not the ratio. Keep that in mind when nesting.

Body default weight is `300` ([index.css:19](../src/index.css#L19)) — light. Headings
override to 500/600/700/`bolder` individually; there's no shared heading rule.

---

## 3. Colour

### Brand orange — five near-identical variants

This is the biggest source of drift in the codebase. The brand orange exists in at least
five slightly different values, used semi-interchangeably:

| Hex | Used for | Where |
|---|---|---|
| `#FE6C25` | The canonical brand orange — loader background, active nav pill, card accent, `--fd-brand` | [CrackerLoading.css:6](../src/Components/CrackerLoading/CrackerLoading.css#L6), [LiquidNav.css:133](../src/Components/LiquidNav/LiquidNav.css#L132-L137), [WhySection.css:186](../src/Components/WhySection/WhySection.css#L184-L188) |
| `#ef5508` | Hero CTA button + hero line 2 (`#ef5508d8`) + wallet icon strokes | [HeroSection.css:76](../src/Components/HeroSection/HeroSection.css#L73-L87), [HeroSection.jsx:93](../src/Components/HeroSection/HeroSection.jsx#L93) |
| `#F06F31` | "Read more" link in hero brief box | [HeroSection.css:143](../src/Components/HeroSection/HeroSection.css#L142-L145) |
| `#FF722D` | Footer send-button gradient end | [Footer.css:162](../src/Components/Footer/Footer.css#L159-L167) |
| `#fd722d92` / `#fe6d25dc` | Section tag text, mailto link | [BriefSection.css:121](../src/Components/BriefSection/BriefSection.css#L111-L124), [Footer.css:192](../src/Components/Footer/Footer.css#L188-L194) |

**If you are adding anything new, use `#FE6C25`.** The others are historical.

Supporting oranges (these are deliberate, not drift):

| Hex | Role |
|---|---|
| `#e85c17` | Primary CTA hover (darker) — [FeatureDialog.css:152](../src/Components/MainFeature/FeatureDialog.css#L150-L153) |
| `#FCA47A` | `--fd-brand-soft` — soft orange, chart gradient tail, `.blTag` text |
| `#FFC8B8` | `--fd-brand-softer` — Why-section bottom-right card fill |
| `#FFDDD3` | `--fd-brand-softest` — Why-section bottom-left card fill |
| `#FFEEE5` | Palest tint — footer send-button gradient start |
| `#d9541a`, `#f06f31` | Per-card accent variants in the feature dialog (`--auction`, `--reserve`) |

### Neutrals & surfaces

| Hex | Role | Notes |
|---|---|---|
| `#F8F8FB` | **Page canvas.** Cool off-white. | Set on `body` and re-declared on nearly every section root — hero, feature, brief, why, community, footer. Also the fade target of `.gradientMixer` and `.blurryBottom`. |
| `#F6F0F2` | Warm neutral card surface | Feature bento cards, brief product cards, `--fd-surface` |
| `#f5e9e3` | Warmer tinted surface | Why-section card, `--fd-surface-tint`, dialog close button |
| `#E8E6F4` | Lavender — footer plate + the big `.footerCurve` arc | [Footer.css:14, 32](../src/Components/Footer/Footer.css#L10-L38) |
| `#ffffff` | Wallet button, control buttons, glass tint, transition wipe | |
| `#E1E1E1` / `#D8D8D8` | Rotating card #1 fill / its oversized ghost numeral | [CardRotate.css:219-230](../src/Components/CardRotate/CardRotate.css#L219-L230) |

### Text colours

The palette is **warm brown, not black**, for body content — but the codebase mixes that
with plain `rgba(0,0,0,α)`:

| Value | Role |
|---|---|
| `#4A3232` | Strong text (`--fd-text-strong`) — card headings in Why section and dialog |
| `#684A4A` | Soft text (`--fd-text-soft`) — the big centred statement, dialog body |
| `rgba(74, 50, 50, 0.55)` | Muted (`--fd-text-muted`) |
| `rgb(0,0,0)` | Hero headline, section H1, footer wordmark |
| `rgba(0,0,0,0.466)` | Hero sub-copy |
| `rgba(0,0,0,0.351)` | Section sub-copy (feature, card-rotate) |
| `rgba(0,0,0,0.467)` | Community sub-copy |
| `rgba(0,0,0,0.495)` | Footer legal links |

Those four black alphas (`.351 / .466 / .467 / .495`) are all "muted secondary text" and
are all *slightly* different. They should be two values, not four. `--fd-text-muted`
(warm brown at 55%) is the more considered choice.

### Accent colours outside the brand family

The `CardRotate` section deliberately breaks the palette — each rotating card is its own
solid block colour ([CardRotate.css:219-240](../src/Components/CardRotate/CardRotate.css#L219-L240)):

`#E1E1E1` (grey) · `#e7790b` (orange) · `#090909` (near-black) · `#6840FF` (violet) ·
`#7A57FF` (violet tag chips) · `#2563eb` (the `.rCard` base blue — always overridden by an
`#rCardN` rule, so it should never actually be visible)

### Gradients

Only three real gradients in the project:

```css
/* Footer plate — orange bleeding into lavender from below */
background: linear-gradient(357deg, rgba(254,108,37,0.53) -121.71%, #E8E6F4 55.08%);

/* Email send button */
background: linear-gradient(130deg, #FFEEE5 -25.88%, #FF722D 109.54%);

/* Section-to-section fade (the "gradientMixer" and "blurryBottom" devices) */
background: linear-gradient(180deg, transparent 0%, #F8F8FB 65%);
```

The out-of-range percentage stops (`-121.71%`, `109.54%`) are Figma exports — they place
the colour stop outside the box so only a slice of the ramp is visible.

---

## 4. Shape — radii, borders, shadows

### Radius

There is no radius scale; each component picks its own. Grouped by intent:

| Radius | Used on |
|---|---|
| `5px` | Tag chips in CardRotate, join button |
| `10px–12px` | Small icon buttons (`.cardExpandBtn`, `.fd-close`), black cards |
| `15px–20px` | Standard card/tag radius — most bento cards, `.blTag`, hero brief box |
| `25px–32px` | Large cards (`.briefProductCard` 25px, `.rCard` 30px, `.fd-panel` 32px) |
| `40px–50px` | Section-scale containers (`.whyCenterCard` 40px, `.contentParent` 50px) |
| `30px` / `40px` / `50px` / `999px` / `22rem` | Pills — **five different ways to write "fully round"** |

Pills are inconsistent: `.ctaBtn` uses `30px`, `.communityTag` uses `40px`,
`.navSideOption` uses `50px`, the dock uses `22rem`, and `FeatureDialog` uses the correct
`999px`. They all *look* identical at their current heights, but only `999px` stays
correct if the element gets taller. Prefer `999px`.

### Borders

Borders are nearly absent — separation is done with **fill contrast and shadow**, not
strokes. The exceptions:

- `1px solid rgba(255,255,255,0.15)` on `.rCard` and `.commCardCircle` — barely-there
  edge lighting on dark cards
- `border-bottom: 2px solid #f7580e2e` on the email input — the only "form field" styling
- `--fd-border: rgba(74,50,50,0.1)` — hairline dividers in the dialog
- `.footerBottomOption::before` — a `0.2rem` pseudo-element bar acting as a divider
  instead of a border

### Shadows — two distinct systems

**1. Inset glow** (the signature). Used to make surfaces look lit from inside rather than
floating above:

```css
box-shadow: inset 0 0 20px rgba(255,255,255,0.768);     /* .ctaBtn */
box-shadow: inset 0px 0px 29px white;                    /* .heroBreifBox */
box-shadow: 0 0 8px 2px rgba(255,255,255,0.656) inset;   /* nav pills */
```

**2. Drop shadow**, only where something genuinely floats:

```css
box-shadow: 0 4px 20px rgba(0,0,0,0.15);                              /* .walletBtn */
box-shadow: 0 10px 25px rgba(0,0,0,0.1);                              /* .control-btn */
box-shadow: 0 60px 120px -30px rgba(74,50,50,0.4),
            0 20px 40px -16px rgba(74,50,50,0.25);                     /* .fd-panel */
```

Note the dialog's shadow is **tinted warm brown**, matching the text palette, rather than
neutral black. That's the more refined approach and worth copying.

### The liquid-glass recipe

[LiquidNav.css:20-50](../src/Components/LiquidNav/LiquidNav.css#L20-L50) builds frosted
glass as **four stacked absolutely-positioned layers** inside one wrapper, rather than a
single element with `backdrop-filter`:

| Layer | z | What it does |
|---|---|---|
| `.liquidGlass-effect` | 0 | `backdrop-filter: blur(3px)` + `filter: url(#glass-distortion)` — an inline SVG displacement map that warps what's behind it |
| `.liquidGlass-tint` | 1 | `rgba(255,255,255,0.5)` flat wash |
| `.liquidGlass-shine` | 2 | Two inset white highlights faking a bevelled top-left edge |
| `.liquidGlass-text` | 3 | Content |

All four layers must share the same `border-radius`, which is why
[LiquidNav.css:94-107](../src/Components/LiquidNav/LiquidNav.css#L94-L107) sets it on
`.dock > div` collectively and re-sets it on hover.

Lighter glass elsewhere is just `backdrop-filter: blur(3–6px)` over a translucent white
(`.heroBreifBox`, `.cardExpandBtn`, `.fd-overlay`, `.fd-showcase__badge`).

---

## 5. Motion

Motion is the most deliberate part of this design system. Four easing curves, each with a
consistent job.

| Curve | Name | Job |
|---|---|---|
| `cubic-bezier(0.34, 1.56, 0.64, 1)` | **The signature spring** | Overshoots past its target and settles. Used for anything that should feel physical: card expansion, hero entrances, icon hovers, loader bar, brief-box growth. Appears in ~15 places. |
| `cubic-bezier(0.22, 1, 0.36, 1)` | Expo-out | Fast start, long soft landing. Loader transition, drag cursor follow. |
| `cubic-bezier(0.25, 1, 0.5, 1)` | Quart-out | Restrained version of the above — dialog buttons, expand button hovers. |
| `cubic-bezier(0.175, 0.885, 0.32, 2.2)` | Extreme spring | Only the nav dock. The `2.2` y2 makes it noticeably bouncier than the signature curve. |
| `ease-in-out` @ `0.2s` | — | Micro-interactions: colour/opacity hovers on links and nav options. |

**Rule of thumb the codebase follows:** if the thing moves or resizes, use the signature
spring. If only colour or opacity changes, use `0.2s ease-in-out`.

### Durations

`0.2s` micro-hover · `0.35–0.5s` component state change · `0.6s` dock/dropdown ·
`1s–1.6s` entrance · `2s–3s` loader/page transitions.

### The three custom animation systems

**a. Character-split text reveal** —
[useTextSplitAnim.jsx](../src/Components/CustomHook/useTextSplitAnim.jsx)

Walks the DOM, wraps every character in `.char > .innerChar`, and animates each inner span
from `translateY(100%) rotateZ(30deg)` + `blur(4px)` + `opacity: 0` to rest, with a
`stagger` delay per index (default 40ms; the hero uses **20ms**). Transition is `400ms ease`
on transform/filter, `300ms` on opacity. Words are wrapped in `.word { white-space: nowrap }`
so text never breaks mid-word. Auto-plays on scroll-into-view via `useInView`, unless
`autoPlay: false` — the hero passes `false` and calls `.play()` manually once the loader
finishes.

Note the base `.innerChar` rule in [index.css:34-41](../src/index.css#L34-L41) declares a
*different*, slower transition (`1s` spring + `1.3s` blur) than the inline styles the hook
writes. The inline styles win, so the CSS values are effectively dead.

**b. Genie transition** —
[useGenieTransition.jsx](../src/Components/CustomHook/useGenieTransition.jsx)

A macOS-Dock-style open/close for the feature dialog. Instead of scaling uniformly, it
computes an 8-point `clip-path: polygon()` per frame where the edge nearest the anchor
pinches hard and the far edge lags and stretches — producing a teardrop taper. Runs on a
rAF loop over a single `0..1` progress value, so open↔close can be **retargeted mid-flight**
without restarting. Duration `450ms`, ease `cubic-bezier(0.4, 0, 0.2, 1)`, with duration
scaled by remaining distance. Honours `prefers-reduced-motion` by dropping the clip-path
and shortening to 140ms.

**c. Loader → hero handoff** —
[CrackerLoading.css](../src/Components/CrackerLoading/CrackerLoading.css) +
[HeroSection.jsx:45-74](../src/Components/HeroSection/HeroSection.jsx#L45-L74)

Full-screen `#FE6C25` panel with a blinking logo and a progress bar (`.innerMover`, an
asymmetric `border-radius: 0 24px 97px 0`). Body scroll is locked while it's up. It plays
for **3000ms on first visit only** — `sessionStorage["crackerIntroPlayed"]` skips it to 0ms
on repeat views. `.transitionBlock` then runs a `softWipe` opacity fade to reveal the hero.

**Caveat:** the hero's Framer Motion entrances use hardcoded `delay: 10.15` and `10.25`
**seconds** ([HeroSection.jsx:110, 122](../src/Components/HeroSection/HeroSection.jsx#L104-L132)).
That's an absolute delay from mount, not chained off the loader, so it does not adapt to
the skipped-loader path. Worth knowing before you change loader timing.

### Ambient loops

- `loaderBlink` — 2s infinite opacity pulse on the loading logo
- `coinFloat` — 20s infinite float/tumble on the decorative coins
- `rotateAnim` — 60s linear infinite rotation on `.commCardCircle`
- `crossFade1/2` — 8s infinite two-image crossfade in the rotating cards
- `fd-live-pulse` — 1.8s expanding box-shadow ring on the "live" dot

---

## 6. Layout

### Page gutter

`padding-inline: 15px` on `.HeroSectionParent`, `.topNavParent`, `.footerBottomOption`.
The hero CTA and brief box position against `left: 15px` / `right: 15px` to match. This is
a **fixed** gutter, not fluid — it does not grow on large screens.

### Section rhythm

Sections are viewport-height-based rather than content-based:

| Section | Height |
|---|---|
| Hero | `100vh` |
| MainFeature | `min-height: 110vh` (inner `.featureBlock` `min-height: 150vh`) |
| BriefSection | `130vh` (→ `auto` on mobile) |
| CardRotate | `150vh` (scroll-driven) |
| WhySection | `100vh` |
| Community | `100vh` |
| Footer | `100vh`, `position: sticky` |

The sticky footer means the last section slides over/under as you reach the bottom.

Almost every section root carries `overflow: hidden !important` — decorative elements are
deliberately positioned outside their bounds (coins at `left: 2%`, the `-35%` Secure icon,
the 150%-wide footer curve) and clipped.

### Section blending

Two devices join sections without a hard seam:

- `.gradientMixer` ([index.css:46-54](../src/index.css#L46-L54)) — a 10rem `#f8f8fb` band
  at `top: 99%` with `blur(10px)`, bridging hero → feature
- `.blurryBottom` ([CardRotate.css:80-95](../src/Components/CardRotate/CardRotate.css#L80-L95))
  — a `transparent → #F8F8FB` gradient, deliberately set `left: -10%; width: 120%` so the
  blur's own soft edges fall outside the clipped area (the comment in the file explains
  the bug this avoids)

### The bento grid

[MainFeature.css](../src/Components/MainFeature/MainFeature.css) builds an offset two-column
layout with plain flexbox, not CSS Grid: `.featureBlock` at 80% width, two `49.3%` columns,
left column `align-items: end`, right column `align-items: start` and pushed down with
`margin-top: 5%`. That 5% offset is what creates the staggered look.

### Z-index

There is **no z-index scale** — values escalate ad hoc and reach seven digits. Documented
here purely so you can slot new work in without breaking things:

| z-index | What |
|---|---|
| `0–3` | In-section layering, glass layers, footer plate |
| `9` | Footer main content, scroll-down arrow |
| `50` | CardRotate header + controls |
| `99` | `.gradientMixer`, `.heroBreifBox`, `.featureBlock`, `.blurryBottom` |
| `999` | `.heroCtaRow`, `.transitionBlock`, `.crackReveal`, `.emailCollector` |
| `9999` | `.heroTagLine`, `.blTag`, LiquidNav wrapper, AI bot chat |
| `10000` | `.cardExpandBtn` |
| `99999` | `.topNavParent` |
| `100000` | `.fd-overlay` (feature dialog) |
| `999999` | Loading screen |

If you add something new, pick from an existing tier rather than inventing a higher one.

---

## 7. Responsive

**One breakpoint: `@media (max-width: 500px)`.** Nothing between 500px and desktop —
tablets and small laptops get the desktop layout unchanged. `FeatureDialog.css` is the only
file with a proper two-step ladder (`860px` and `640px`).

Mobile strategy per section:

- **Hero** — headline drops to a flat `3.5rem` with `105%` line-height, brief box is
  `display: none`, CTA row moves from `bottom: 3%` to `top: 27%`, video scales to `120%`
  height to keep the robot framed
- **MainFeature / Community / Brief** — columns become `flex-direction: column`, cards go
  full width, fixed heights become `auto`
- **WhySection** — cards drop from absolutely-positioned side columns to `position: relative`
  at 90% width
- **FeatureDialog** — becomes a bottom sheet: `align-items: flex-end`, radius
  `28px 28px 0 0`, `max-height: 94vh` with internal scroll

`body` carries `overflow-x: hidden !important` ([index.css:22](../src/index.css#L22)) as a
blanket guard against the overflowing decorative elements.

---

## 8. Component patterns worth reusing

**Primary CTA** — `#ef5508` fill, `30px` radius, inset white glow, `rgba(255,255,255,0.847)`
label, `bold`. ([HeroSection.css:73-87](../src/Components/HeroSection/HeroSection.css#L73-L87))

**Icon button** — `5rem` circle, white fill, `0 4px 20px rgba(0,0,0,0.15)`, brand-orange
`1.7`-weight SVG strokes. ([HeroSection.css:89-107](../src/Components/HeroSection/HeroSection.css#L89-L107))

**Tag / eyebrow chip** — translucent white or black pill, `1.2–1.3rem`, weight 500, pill
radius. Three variants exist: `.blTag` (white/orange), `.tagHeading` (white/orange, larger
padding), `.communityTag` (black/white). ([MainFeature.css:148-157](../src/Components/MainFeature/MainFeature.css#L148-L157), [BriefSection.css:111-124](../src/Components/BriefSection/BriefSection.css#L111-L124), [Community.css:49-67](../src/Components/Community/Community.css#L49-L67))

**Hover-expand card** — the Why-section pattern: card grows `height: 49% → 420%` on hover
over `0.5s` signature spring, while the first paragraph fades out, a second fades in, and
the decorative images each translate to new positions with independent scale. ([WhySection.css:145-179](../src/Components/WhySection/WhySection.css#L145-L179))

**Active nav pill** — `#FE6C25` fill, white text, inset white glow. Sits inside the glass
dock. ([LiquidNav.css:132-137](../src/Components/LiquidNav/LiquidNav.css#L132-L137))

---

## 9. Known gaps

Things a future pass should address, listed because they're real, not to be pedantic:

1. **No token layer.** Every colour is a literal. The five orange variants and four
   black-alpha muted-text values are a direct result.
2. **10px root** blocks user font-size preferences.
3. **No focus styles.** `outline: none` appears on `.ctaBtn`, `.walletBtn`, `.commJoin`,
   `.emailCollector > input`, `.navSideOption` with no `:focus-visible` replacement —
   keyboard navigation is currently invisible.
4. **Clickable `<p>` elements.** The "Read more" toggle
   ([HeroSection.jsx:151-157](../src/Components/HeroSection/HeroSection.jsx#L151-L157))
   and the legal links in the footer are paragraphs with `onClick`/`cursor: pointer` —
   not reachable by keyboard, not announced as interactive.
5. **`prefers-reduced-motion` is honoured in exactly two places** — `FeatureDialog.css` and
   `useGenieTransition`. The text-split reveal, coin float, 60s rotation and loader all
   ignore it.
6. **Missing 501px–1024px breakpoint.** Tablet gets an unadjusted desktop layout.
7. **Contrast.** `rgba(0,0,0,0.351)` sub-copy on `#F8F8FB` is roughly 3.3:1 — below the
   4.5:1 WCAG AA threshold for body text at these sizes.
8. **`WhySection` is imported but never rendered**
   ([HeroSection.jsx:10](../src/Components/HeroSection/HeroSection.jsx#L10)) — its styles
   are documented above, but it is not currently on the page.
9. **Dead CSS.** `.innerChar` transitions in `index.css` are overridden by inline styles;
   `.rCard`'s `#2563eb` base is always overridden; several `animation: none /* ... */`
   rules hold disabled keyframes (`gridAnimate`, `leftMoveSlide`, `rightMoveSlide`).

---

## Quick reference

```
Root font size   10px  (1rem = 10px)
Body font        Inter 300
Display fonts    Bagel Fat One (footer wordmark), Baumans (accents)
Brand orange     #FE6C25
Canvas           #F8F8FB
Card surface     #F6F0F2 / #f5e9e3
Text strong      #4A3232
Text soft        #684A4A
Signature ease   cubic-bezier(0.34, 1.56, 0.64, 1)
Micro-hover      0.2s ease-in-out
Page gutter      15px
Breakpoint       max-width: 500px
```
