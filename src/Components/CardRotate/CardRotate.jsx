import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import Draggable from "gsap/Draggable";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./CardRotate.css";
import { CustomEase } from "gsap/CustomEase";
import { DEX_URL } from "../../siteLinks.js";
import circleR from "../../assets/circularR.svg"
import circImg1 from "../../assets/Photo by Bailey Burton.webp"
import circImg2 from "../../assets/Photo by ConvertKit.webp"
import circImg3 from "../../assets/Photo by Marivi Pazos.webp"
import circImg4 from "../../assets/Photo by Michael Dagonakis.webp"
import circImg5 from "../../assets/Photo by Mika.webp"
import circImg6 from "../../assets/Photo by Ono Kosuki.webp"
import circImg7 from "../../assets/Photo by Tom Morbey.webp"
import roboFair1 from "../../assets/FairRobo.webp"
import roboFair2 from "../../assets/FairRobo2.webp"
import backGradient from "../../assets/FeatureGradient.webp"
import useTextSplitAnim from "../CustomHook/useTextSplitAnim.jsx";
import appleLogo from "../../assets/apple.webp";
import teslaLogo from "../../assets/tesla.webp";
import nvidiaLogo from "../../assets/nvidia.webp";
import amazonLogo from "../../assets/amazon.webp";
import metaLogo from "../../assets/meta.webp";

import BridgeDiagram from "./BridgeDiagram.jsx";
import JoinDialog from "../Join/JoinDialog.jsx";


gsap.registerPlugin(Draggable, CustomEase, ScrollTrigger);
CustomEase.create(
  "osmoEase",
  "0.25, 1, 0.5, 1"
);

// Real-world names on the "Real Stocks" card: real logo assets (not traced
// substitutes) floating over the card and echoed as a small ticker/change
// strip underneath. `seedChange` is just the starting point for the jitter
// below, not a real quote — see JITTER_* for where the live-looking number
// actually comes from.
const STOCK_LOGOS = [
  { symbol: "AAPL", name: "Apple", logo: appleLogo, seedChange: 1.28 },
  { symbol: "TSLA", name: "Tesla", logo: teslaLogo, seedChange: -0.84 },
  { symbol: "NVDA", name: "Nvidia", logo: nvidiaLogo, seedChange: 2.41 },
  { symbol: "AMZN", name: "Amazon", logo: amazonLogo, seedChange: 1.17 },
  { symbol: "META", name: "Meta", logo: metaLogo, seedChange: 0.62 },

];

// Not real market data — nothing here calls out to an API. Every tick,
// each symbol's percentage takes a small random step from wherever it
// currently is (not a fresh random value — a fresh value would visibly
// jump around instead of drifting) and gets clamped to a range a real
// day's move would plausibly stay inside. That's what makes the strip
// read as "live" rather than a number stamped on the page once.
const JITTER_INTERVAL_MS = 2800;
const JITTER_STEP = 0.6; // max +/- change applied on any one tick
const JITTER_MIN = -6;
const JITTER_MAX = 6;

const CardRotator = () => {
  const animRef2 = useRef(null);
  const pRef2 = useRef(null);
  const containerRef = useRef(null);
  const dragMoverRef = useRef(null);
  const [onHover, setOnHover] = React.useState(false);
  const [joinOpen, setJoinOpen] = React.useState(false);

  const [liveChanges, setLiveChanges] = React.useState(() =>
    Object.fromEntries(STOCK_LOGOS.map((s) => [s.symbol, s.seedChange]))
  );

  useEffect(() => {
    const id = setInterval(() => {
      setLiveChanges((prev) => {
        const next = { ...prev };
        for (const stock of STOCK_LOGOS) {
          const delta = (Math.random() - 0.5) * 2 * JITTER_STEP;
          const walked = prev[stock.symbol] + delta;
          next[stock.symbol] = +Math.max(JITTER_MIN, Math.min(JITTER_MAX, walked)).toFixed(2);
        }
        return next;
      });
    }, JITTER_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  /* ================= CONFIG ================= */

  let WHEEL_RADIUS = "120vw"; // arc 120 depth (bigger = flatter)
  let GAP_ANGLE = 28;         // spacing between cards
  let DRAG_RATIO = 15;        // drag sensitivity

  /* ================= MAIN LOGIC ================= */

  useEffect(() =>{
    let xWidth = window.innerWidth;
    x=console.log(xWidth);
    if(xWidth < 800){
      // Everything here is in vw and the card is sized in vw too (the
      // max-width:800px block in the CSS), so the geometry holds its shape at
      // any phone width. Writing V for the viewport width: w = 0.78V,
      // h = 1.30V.
      //
      // These cards are spokes on a wheel whose centre sits below them, so the
      // spacing between two of them is not one number — it is 2*d*sin(gap/2)
      // at every distance d from that centre. The BOTTOM edge is the smallest
      // d, which is why the bottoms met first while the tops looked fine. The
      // origin is `50% WHEEL_RADIUS` measured from the card's top, so the
      // bottom edge sits at d = radius - h and the centre at radius - h/2.
      //
      // At the old 280vw/20deg: 2*(2.8-1.3)*sin(10deg) = 0.521V of room for a
      // 0.78V card — the bottoms overlapped by about 100px. My previous
      // spacing check used the card centres and a bounding box, which said the
      // cards cleared each other when their nearest corners did not.
      //
      // Shortening the card is what buys back the tilt. The bottom clearance
      // is 2*(radius - h)*sin(gap/2), so h works directly against it: at
      // h = 1.30V the arc had to be nearly flat (4.4deg) to keep the bottom
      // corners apart. At h = 1.12V there is room for 8deg, which is enough
      // tilt to show the corner of each neighbour rather than a flat sliver.
      //
      //   bottom  2*(7.3-1.12)*sin(4deg) = 0.862V  vs 0.82V card -> ~16px gap
      //   centres (7.3-0.56)*sin(8deg)   = 0.938V  -> ~18px of each
      //                                               neighbour still shows
      WHEEL_RADIUS = "730vw";
      GAP_ANGLE = 8;
      // 8 * 30 = 240px of drag per card, against the 366px the cards actually
      // travel, so they move about 1.5x the finger. This started at 46, which
      // tracked the finger exactly and meant a full swipe barely advanced one
      // card. 1.5x is the far end of what still feels controlled: past roughly
      // 1.6x the snap-back after release becomes visible, because the wheel
      // has carried further than the thumb aimed and has to come back.
      DRAG_RATIO = 30;
    } else if (xWidth < 1024) {
      // Tablet. The desktop constants assume a radius roughly three times the
      // card height; between 800 and 1024 the radius is 120vw of a much
      // narrower screen while the card barely shrinks, so that ratio collapses
      // and the bottom corners run into each other (see the clearance formula
      // in the effect below). A flatter arc restores the ratio, and the gap
      // comes down to match: at 180vw the cards do not need 28 degrees of
      // spread to clear, and holding them at 28 would fling the neighbours off
      // screen instead.
      WHEEL_RADIUS = "180vw";
      GAP_ANGLE = 21;
      DRAG_RATIO = 20;
    }
  },[])

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const cards = container.querySelectorAll(".rCard");
    const proxy = document.createElement("div");

    /* ---- bottom-clearance floor ----
       The three GAP_ANGLE values above are each correct at the width they were
       judged at and wrong somewhere else in their own range, because the card
       is sized in CSS with max()/min() while the gap is a constant here. The
       two drift apart and nothing catches it.

       These cards are spokes on a wheel whose pivot sits below them
       (transformOrigin: 50% WHEEL_RADIUS), so the distance between two
       neighbours is 2*d*sin(gap/2), where d is the distance from the pivot.
       The BOTTOM edge has the smallest d, which is why bottoms touch while the
       tops still look fine. Solving that for the angle:

         gap = 2 * asin((cardWidth + clearance) / (2 * (radius - cardHeight)))

       gives the smallest gap that keeps a set space at the bottom corners.
       Taking the larger of that and the designed angle means the design wins
       wherever it is already generous, and this only intervenes where the card
       has outgrown it — at 1024px exactly, where the desktop 28 degrees leaves
       the cards overlapping by about 13px.

       offsetWidth/offsetHeight, not getBoundingClientRect: the cards are
       already rotated by the time this runs, and a bounding rect of a rotated
       box is not the box. */
    const MIN_BOTTOM_GAP = 10;
    const radiusPx = (parseFloat(WHEEL_RADIUS) / 100) * window.innerWidth;
    const cardW = cards[0]?.offsetWidth ?? 0;
    const cardH = cards[0]?.offsetHeight ?? 0;
    const bottomDist = radiusPx - cardH;
    if (cardW > 0 && bottomDist > 0) {
      const ratio = (cardW + MIN_BOTTOM_GAP) / (2 * bottomDist);
      // ratio >= 1 means no angle can separate them: the card is more than half
      // the arc's bottom circumference. Nothing to do but leave the designed
      // value rather than feed asin a number outside its domain.
      if (ratio < 1) {
        GAP_ANGLE = Math.max(GAP_ANGLE, 2 * Math.asin(ratio) * (180 / Math.PI));
      }
    }

    const TOTAL_ARC = cards.length * GAP_ANGLE;
    const wrap = gsap.utils.wrap(-TOTAL_ARC / 2, TOTAL_ARC / 2);
    const snapStep = GAP_ANGLE * DRAG_RATIO ;

    const updateLayout = () => {
      const x = gsap.getProperty(proxy, "x");
      const rotation = x / DRAG_RATIO;

      cards.forEach((card, i) => {
        const angle = wrap(i * GAP_ANGLE + rotation);
        const dist = Math.abs(angle);

        // No opacity or scale here. Both were pinned to 1, so they did nothing
        // back when this only ran during a drag — but it runs every frame now
        // that the wheel auto-advances, and writing opacity:1 each frame
        // overwrote the entrance tween that fades the cards in. They would have
        // appeared at full opacity instead of rising into place.
        gsap.set(card, {
          rotation: angle,
          transformOrigin: `50% ${WHEEL_RADIUS}`,
          zIndex: 100 - Math.round(dist),
        });

        // Optional performance culling. Expressed in cards rather than a flat
        // 70deg: at the desktop 28deg gap that is the same 70 it always was,
        // but the phone's 20deg gap would otherwise keep three and a half
        // cards alive on each side, all of them far off screen.
        if (dist > GAP_ANGLE * 2.5) {
          card.style.visibility = "hidden";
          card.style.pointerEvents = "none";
        } else {
          card.style.visibility = "visible";
          card.style.pointerEvents = "auto";
        }
      });
    };

    const draggable = Draggable.create(proxy, {
      trigger: container,
      type: "x",
      inertia: true,
      onDrag: updateLayout,
      onThrowUpdate: updateLayout,

      snap: {
        x: (v) => Math.round(v / snapStep) * snapStep,
      },
      onDragEnd() {
        const targetX = Math.round(this.x / snapStep) * snapStep;
        gsap.to(proxy, {
          x: targetX,
          duration: 1,
          ease: "osmoEase",
          onUpdate: () => {
            this.update();
            updateLayout();
          },
        });
      },
    })[0];

    updateLayout();

    // Entrance: cards fade in and rise into place, staggered, the one time
    // the section first scrolls into view. Only opacity + y are animated
    // (both GPU-composited, no layout/paint cost), and it's a single
    // ScrollTrigger for the whole group rather than one per card.
    gsap.set(cards, { opacity: 0, y: 140 });
    const revealTween = gsap.to(cards, {
      opacity: 1,
      y: 0,
      duration: 1.6,
      ease: "power2.out",
      stagger: 0.25,
      scrollTrigger: {
        trigger: container,
        start: "top 75%",
        once: true,
      },
    });

    // Bottom fade grows taller (scaled up from the bottom edge) as the user
    // scrolls the section's tail end toward Community, so the cards
    // progressively dissolve into white rather than being cut by a fixed
    // band. scaleY (not height) so it's a GPU transform, not a reflow.
    const blurryBottomEl = container.querySelector(".blurryBottom");
    let bottomFadeTween;
    if (blurryBottomEl) {
      gsap.set(blurryBottomEl, { scaleY: 0.3 });
      bottomFadeTween = gsap.to(blurryBottomEl, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "bottom 100%",
          end: "bottom 20%",
          scrub: true,
        },
      });
    }

    container.rotateTo = (dir) => {
      const currentX = gsap.getProperty(proxy, "x");
      const targetX =
        dir === "next" ? currentX - snapStep : currentX + snapStep;

      gsap.to(proxy, {
        x: targetX,
        duration: 0.8,
        ease: "back.out(1.2)",
        onUpdate: () => {
          draggable.update();
          updateLayout();
        },
      });
    };

    return () => {
      draggable.kill();
      revealTween.scrollTrigger?.kill();
      revealTween.kill();
      bottomFadeTween?.scrollTrigger?.kill();
      bottomFadeTween?.kill();
    };
  }, []);


  let scale = 1;
let x = 0;
let y = 0;

useEffect(() => {
  const mover = dragMoverRef.current;

  window.addEventListener("mousemove", (e) => {
    gsap.to(mover, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.15,
      ease: "power3.out",
    });
  });

  window.addEventListener("mousedown", () => {
    gsap.to(mover, { scale: 0.8, duration: 0.2 });
  });

  window.addEventListener("mouseup", () => {
    gsap.to(mover, { scale: 1, duration: 0.2 });
  });
}, []);


useTextSplitAnim(animRef2, { stagger: 40, startDelay: 300 });
  useTextSplitAnim(pRef2, { stagger: 20, startDelay: 100 });
  /* ================= JSX ================= */

  return (
    <div id="what-you-get" onMouseEnter={() => {setOnHover(true)}} onMouseLeave={() => {setOnHover(false)}} className="cardRotateParent" ref={containerRef}>
      <img id="backGrad" src={backGradient} alt="" srcset="" />
         <div style={onHover ? {opacity:1}:{opacity:0}} ref={dragMoverRef} className="dragMover">
        <div  className="dragCircle">
          <p>Drag</p>
        </div>
      </div>
      
      <img src={circleR} alt="" srcset="" />
      <div className="WhyWe">
        <h1  ref={animRef2}>What You <span style={{color:"rgb(254, 108, 37)"}}>Get</span></h1>
        <p ref={pRef2}>We don’t just build features, we build clarity, trust, and long-term value. Every decision is driven by correctness, performance, and real-world usability.</p>
      </div>

      {/* INDIVIDUAL CARDS (NO MAP) */}

      <div id="rCard1" className="rCard stocks">
         <div className="commonCardContent">
          <div className="tagLines">
          <div className="tagDiv tagDiv--violet">TOKENIZED</div>
          <div className="tagDiv tagDiv--brand">ON-CHAIN</div>
          </div>

          <div className="stockIconBadge">
            <svg width="28" height="28" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 47L23.5 32L33.5 42L55 19" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M40 19H55V34" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div className="mainTagAndDesc">
            {/* Was "Real Stocks" over a line that said "tokenized": the
                headline claimed the share, the body claimed exposure to its
                price, and those are not the same product. */}
            <h1>Tokenized Stocks</h1>
            <p>Apple, Tesla, Nvidia and more, on-chain. Exposure, not shares.</p>
          </div>
        </div>

        <div className="stockOrbit" aria-hidden="true">
          <span className="stockOrbit__ring" />
          <div className="stockOrbit__track">
            {STOCK_LOGOS.map((stock, i) => (
              <span
                className="stockOrbit__slot"
                style={{ "--slot-angle": `${i * (360 / STOCK_LOGOS.length)}deg` }}
                key={stock.symbol}
              >
                <span className="stockOrbit__counterSpin">
                  <span className="stockOrbit__counterSquash">
                    <span className={`stockOrbit__logo stockOrbit__logo--${stock.symbol}`}>
                      <img src={stock.logo} alt={stock.name} />
                    </span>
                  </span>
                </span>
              </span>
            ))}
          </div>
        </div>

        <div className="stockStatsRow">
          <div className="stockStatsTrack">
            {[...STOCK_LOGOS, ...STOCK_LOGOS].map((stock, i) => {
              const change = liveChanges[stock.symbol];
              const up = change >= 0;
              // The list is duplicated back-to-back so the marquee can loop
              // seamlessly (see the CSS) — the second copy is a visual
              // repeat, not new content, so it's hidden from assistive tech
              // rather than announcing every symbol twice.
              const isDuplicate = i >= STOCK_LOGOS.length;
              return (
                <a
                  href={DEX_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="stockStat"
                  key={`${stock.symbol}-${i}`}
                  aria-hidden={isDuplicate || undefined}
                  tabIndex={isDuplicate ? -1 : undefined}
                >
                  <span className={`stockStat__trend ${up ? "is-up" : "is-down"}`} aria-hidden="true">
                    {up ? "▲" : "▼"}
                  </span>
                  <span className="stockStat__body">
                    <span className="stockStat__symbol">{stock.symbol}</span>
                    <span className={`stockStat__change ${up ? "is-up" : "is-down"}`}>
                      {up ? "+" : ""}{change.toFixed(2)}%
                    </span>
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div id="rCard2" className="rCard">
        {/* <h2>Design 1</h2>
        <p>This is the first card.</p> */}
        <div className="commonCardContent">
          {/* Was "ZERO SLIPPAGE" and "ZERO BOT". Neither was true, and the
              second one contradicted our own anti-bot card outright: that card
              explains that bots cannot be told apart on-chain, which is exactly
              why the defence is a fee rather than a filter. Claiming zero bots
              here and "snipers pay the most" there cannot both be right.

              Slippage is the same kind of overclaim. An AMM prices each trade
              against the pool, so size always moves the price. What Cracker
              actually removes is the PRICE GAP at graduation — the curve hands
              off to the pool at the same price — and that is a specific,
              checkable claim rather than a blanket one. */}
          <div className="tagLines">
          <div style={{backgroundColor:"#DB6E00"}} className="tagDiv">NO PRICE GAP</div>
          <div style={{backgroundColor:"#DB6E00"}} className="tagDiv">BOTS PAY MORE</div>
          </div>
          <svg className="cardIcon" width="84" height="84" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M44.6723 26.855H20.0762C18.1356 26.855 16.5625 28.4281 16.5625 30.3687V40.9099C16.5625 42.8505 18.1356 44.4236 20.0762 44.4236H44.6723C46.6129 44.4236 48.186 42.8505 48.186 40.9099V30.3687C48.186 28.4281 46.6129 26.855 44.6723 26.855Z" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M32.377 19.8273C34.3176 19.8273 35.8907 18.2541 35.8907 16.3135C35.8907 14.373 34.3176 12.7998 32.377 12.7998C30.4364 12.7998 28.8633 14.373 28.8633 16.3135C28.8633 18.2541 30.4364 19.8273 32.377 19.8273Z" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M32.375 19.8271V26.8546" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="25.3467" cy="35.6392" r="1.75686" fill="white"/>
<circle cx="39.4014" cy="35.6392" r="1.75686" fill="white"/>
<circle cx="32" cy="32" r="30" stroke="white" stroke-width="4"/>
<line x1="11.033" y1="52.4441" x2="53.1977" y2="10.2794" stroke="white" stroke-width="5"/>
</svg>

<div className="mainTagAndDesc">
  <h1>Fair Execution</h1>
  {/* "Fixed pricing and bot-free execution" promised two things the
      protocol does not do. This says what it does instead: the handoff
      is gapless, and the opening fee makes racing expensive rather than
      impossible. */}
  <p>Same price from curve to pool, and an opening fee that makes sniping expensive.</p>
</div>
        </div>

<div className="imgSlideShow">
  <img id="roboFair1" src={roboFair1} alt="" srcset="" />
  <img id="roboFair2" src={roboFair2} alt="" srcset="" />
</div>

      </div>

      <div id="rCard3" className="rCard">
        <div className="commonCardContent">
          <div className="tagLines">
          <div style={{backgroundColor:"rgba(255, 255, 255, 0.23)"}} className="tagDiv">YOUR KEYS</div>
          <div style={{backgroundColor:"rgba(255, 255, 255, 0.23)"}} className="tagDiv">YOUR COINS</div>
          </div>
          <svg className="cardIcon nonCustodialIcon" width="84" height="84" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="24" cy="40" r="10" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M31 33L50 14" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M43 21L50 28" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M37 27L44 34" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

<div className="mainTagAndDesc">
  <h1>Non-Custodial</h1>
  <p>We never hold your funds and we never can. Your wallet signs every trade. Our servers can't move a single token.</p>
</div>


        </div>
        <div className="blackCardGraphics">
  <div id="bcard1" className="blackCardRect1">
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="15" cy="25" r="7" stroke="white" strokeWidth="2.6"/>
      <path d="M20 20L33 7" stroke="white" strokeWidth="2.6" strokeLinecap="round"/>
      <path d="M27 13L33 19" stroke="white" strokeWidth="2.6" strokeLinecap="round"/>
    </svg>
  </div>
  <div id="bcard2" className="blackCardRect1">
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="11" width="30" height="21" rx="3" stroke="white" strokeWidth="2.6"/>
      <path d="M5 17H35" stroke="white" strokeWidth="2.6"/>
      <circle cx="27" cy="24.5" r="2.3" fill="white"/>
    </svg>
  </div>
  <div id="bcard3" className="blackCardRect1">
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="9" y="18" width="22" height="16" rx="3" stroke="white" strokeWidth="2.6"/>
      <path d="M13 18V13C13 8.58172 16.5817 5 21 5C24.5 5 27.5 7.3 28.6 10.5" stroke="white" strokeWidth="2.6" strokeLinecap="round"/>
    </svg>
  </div>
  <div id="bcard4" className="blackCardRect1">
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 5L33 10V19C33 27 27.7 33.4 20 36C12.3 33.4 7 27 7 19V10L20 5Z" stroke="white" strokeWidth="2.6" strokeLinejoin="round"/>
      <path d="M14 19L18 23L26 14" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
  <div id="bcard5" className="blackCardRect1">
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6C13 6 7 12 7 19C7 27 13 32 20 34C27 32 33 27 33 19C33 12 27 6 20 6Z" stroke="white" strokeWidth="2.4"/>
      <path d="M20 12C16 12 13 15 13 19C13 19 16 21 20 21C24 21 27 19 27 19C27 15 24 12 20 12Z" stroke="white" strokeWidth="2.2"/>
      <path d="M20 21V29" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  </div>

</div>
      </div>

      <div id="rCard4" className="rCard bridge">
        <div className="commonCardContent">
          <div className="tagLines">
            <div className="tagDiv tagDiv--violet">CROSS-CHAIN</div>
            <div className="tagDiv tagDiv--brand">SECURE</div>
          </div>

          <div className="bridgeIconBadge">
            <svg width="28" height="28" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 24L20 13L20 21L46 21L46 27L20 27L20 35L9 24Z" fill="currentColor"/>
              <path d="M55 40L44 51L44 43L18 43L18 37L44 37L44 29L55 40Z" fill="currentColor"/>
            </svg>
          </div>

          <div className="mainTagAndDesc">
            <h1>Cross-Chain Bridge</h1>
            <p>Move assets across chains, instantly and securely.</p>
          </div>
        </div>

        <div className="bridgeDiagram" aria-hidden="true">
          <BridgeDiagram />
        </div>
      </div>

      <div id="rCard6" className="rCard teal">
        <div className="commonCardContent">
          <div className="tagLines">
          <div className="tagDiv">JOIN OUR</div>
          <div className="tagDiv">COMMUNITY</div>
          </div>
          <svg className="cardIcon car6Svg" width="86" height="76" viewBox="0 0 76 76" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M61.4411 5.64941C60.8381 5.64941 60.2201 5.75968 59.6107 5.9967L39.4656 13.8307C37.5298 14.5835 36.2547 16.4476 36.2547 18.5246V25.4878L16.4975 16.597C15.8145 16.2897 15.113 16.1476 14.4295 16.1476C11.7775 16.1473 9.39453 18.2839 9.39453 21.1897L9.39453 70.4785H42.9697L42.9697 63.7634H66.4723V10.6904C66.4723 7.80195 64.1051 5.64941 61.4411 5.64941ZM39.6122 63.7634V67.121H12.7521L12.7521 21.1897C12.7521 20.9381 12.8072 20.7121 12.896 20.5103C12.9003 20.5005 12.9028 20.4883 12.9072 20.4788C12.9974 20.2845 13.1246 20.118 13.2731 19.9781C13.3722 19.8851 13.4921 19.8252 13.6081 19.7584C13.6789 19.7178 13.7406 19.6594 13.8156 19.6293C14.0088 19.5515 14.2138 19.5084 14.4195 19.5071C14.4227 19.5071 14.4262 19.5052 14.4294 19.5052C14.6148 19.5052 14.7989 19.5626 14.9817 19.6281C15.0274 19.6445 15.0744 19.6385 15.1197 19.6589L27.5002 25.2301L34.8769 28.5497L36.6659 29.3547L38.6223 30.2351C38.917 30.3681 39.1672 30.5832 39.3428 30.8547C39.5183 31.1263 39.6119 31.4427 39.6122 31.766V63.7634H39.6122ZM63.1148 60.4059H42.9698V31.7659C42.9698 29.7841 41.8076 27.9865 40.0002 27.1732L39.6122 26.9986V18.5247C39.6122 17.827 40.0323 17.2129 40.6826 16.9601L60.8277 9.1258C61.0306 9.04692 61.2371 9.00695 61.4412 9.00695C62.2462 9.00695 63.1149 9.65059 63.1149 10.6904L63.1148 60.4059Z" fill="white"/>
<path d="M23.7384 29.6673H30.1456V36.0745H23.7384V29.6673ZM23.7384 41.6808H30.1456V48.088H23.7384V41.6808ZM22.9375 52.8933H30.9465V65.7077H22.9375V52.8933ZM55.7743 20.8574H62.1816V27.2646H55.7743V20.8574ZM55.7743 32.8708H62.1816V39.2781H55.7743V32.8708ZM42.96 46.4862H50.9689V59.3005H42.96V46.4862Z" fill="white"/>
</svg>
<div className="mainTagAndDesc">
  <h1>Community</h1>
  {/* This card was carrying the Fair Execution card's description verbatim —
      a paste that had nothing to do with community, and repeated the same
      overclaim a second time. */}
  <p>Traders, creators and builders shaping what launches next.</p>
</div>
        </div>
       <div className="commCardCircle">
        {
          [circImg1,circImg2,circImg3,circImg4,circImg5,circImg6,circImg7,circImg5,circImg6,circImg7,,circImg2,circImg3].map((imgSrc, index) => {
            return <img src={imgSrc} id={`ci${index}`} srcset="" />
          })
        }
       </div>
       {/* stopPropagation: the card sits on a Draggable wheel, and without it
           the press that opens this also starts a drag underneath. */}
       <button
         className="commJoin"
         type="button"
         aria-haspopup="dialog"
         onClick={(e) => {
           e.stopPropagation();
           setJoinOpen(true);
         }}
       >
         Join
       </button>
      </div>

      <div className="blurryBottom"></div>

      <JoinDialog open={joinOpen} onClose={() => setJoinOpen(false)} />

     {/*  <div className="controls">
        <button onClick={() => containerRef.current.rotateTo("prev")}>
          &lt;
        </button>
        <button onClick={() => containerRef.current.rotateTo("next")}>
          &gt;
        </button>
      </div> */}
    </div>
  );
};

export default CardRotator;
