import "./MainFeature.css";
import FeatureGradient from "../../assets/FeatureGradient.webp";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState, useMemo } from "react";
import useInView from "../CustomHook/useInView.jsx";
// Card face art, named for the feature rather than the file. All four are the
// real illustrations now; the topLeft/bottomLeft/topRight/bottomRight
// placeholders they replaced are gone.
//
// Each was cropped to its subject before export, not just resized. The renders
// arrived on a big soft vignette with a different amount of dead space around
// each one — sniperPayMost had 31% empty above and below, nogap 21% and 16% —
// so resizing alone would have shown the same robot at four noticeably
// different sizes across one row of cards. They are framed to a common 83%
// width fill instead, which is what makes the set read as one family.
//
// Where the crop then SITS inside each card is a separate question, and one
// that only answers itself on screen: see CardArtTuner.jsx.
import liquidityLockArt from "../../assets/liquidityLockCard.webp";
import zeroPriceArt from "../../assets/zeroPriceGapCard.webp";
import botsPayArt from "../../assets/snipersPayCard.webp";
import creatorFeesArt from "../../assets/earnEveryTradeCard.webp";
import useTextSplitAnim from "../CustomHook/useTextSplitAnim.jsx";
import FeatureDialog from "./FeatureDialog.jsx";
import featureDialogData from "./featureDialogData.js";
import useCardArtTuner from "./CardArtTuner.jsx";

function ExpandButton({ onClick, label }) {
  return (
    <button
      className="cardExpandBtn"
      // The card itself is now also a click target for the same action —
      // without stopPropagation this click would bubble up and fire the
      // card's own onClick right after this one, calling openCard twice.
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      aria-label={label}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M5.5 1H1V5.5M8.5 13H13V8.5M13 1L8 6M1 13L6 8"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export default function MainFeature() {
  const sectionRef = useRef(null);
  const animRef = useRef(null);
  const pRef = useRef(null);
  const isVisible = useInView(sectionRef, 0.3);
  const [playedOnce, setPlayedOnce] = useState(false);
  const [activeCardKey, setActiveCardKey] = useState(null);
  const [dialogOrigin, setDialogOrigin] = useState(null);

  // Captures the clicked card's on-screen rect so the dialog can grow out of
  // that exact spot (Dock/genie-style expand) instead of just fading in.
  // Takes the card element directly (not an event) since it now opens from
  // two different triggers — clicking the card itself (where
  // e.currentTarget already *is* the card) and clicking the small expand
  // button nested inside it (where it's e.currentTarget.parentElement) —
  // and both need to resolve to the same card rect.
  const openCard = (key, cardEl) => {
    const rect = cardEl.getBoundingClientRect();
    setDialogOrigin({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      width: rect.width,
      height: rect.height,
    });
    setActiveCardKey(key);
  };

  useEffect(() => {
    if (isVisible && !playedOnce) {
      setPlayedOnce(true);
    }
  }, [isVisible, playedOnce]);

  const gradientStyle = useMemo(() =>
    playedOnce
      ? {
          opacity: 1,
          transform: "translateX(-50%) rotateZ(0deg)",
          transition: "all 1.5s ease-in-out 1.5s",
        }
      : undefined,
    [playedOnce]
  );

  const gridAnimateStyle = useMemo(
    () =>
      playedOnce
        ? { animation: "gridAnimate var(--mf-grid-dur) cubic-bezier(0.34, 1.56, 0.64, 1) var(--mf-grid-delay) forwards" }
        : undefined,
    [playedOnce]
  );

  // Durations and delays come from CSS variables (MainFeature.css) rather
  // than literals: an inline style is unreachable from a media query, and the
  // phone needs this sequence to run in about half the time.
  // Framing controls for the four card images. Renders nothing and writes no
  // inline styles unless it is switched on (dev, or ?tune in the URL).
  const { styleFor, panel } = useCardArtTuner();

  // The fade-in lands on var(--art-opacity) rather than a literal 1, so a card
  // tuned below full opacity keeps that value instead of the entrance animation
  // overriding it on arrival. Untuned it resolves to 1, exactly as before.
  const ART_IN = "var(--art-opacity, 1)";
  const topLeftImgStyle = useMemo(() => (playedOnce ? { opacity: ART_IN, transition: "all var(--mf-img-dur) ease-in-out var(--mf-img-d1)" } : undefined), [playedOnce]);
  const bottomLeftImgStyle = useMemo(() => (playedOnce ? { opacity: ART_IN, transition: "all var(--mf-img-dur) ease-in-out var(--mf-img-d3)" } : undefined), [playedOnce]);
  const topRightImgStyle = useMemo(() => (playedOnce ? { opacity: ART_IN, transition: "all var(--mf-img-dur) ease-in-out var(--mf-img-d2)" } : undefined), [playedOnce]);
  const bottomRightImgStyle = useMemo(() => (playedOnce ? { opacity: ART_IN, transition: "all var(--mf-img-dur) ease-in-out var(--mf-img-d4)" } : undefined), [playedOnce]);

  /* useEffect(() => {
  if (!animRef.current) return;

  const val = animRef.current.innerText;
  const chars = val.split("");

  const wrap = chars
    .map(ch =>
      ch === " "
        ? `<span class="char space">&nbsp;</span>`
        : `<span class="char"><span class="innerChar">${ch}</span></span>`
    )
    .join("");

  animRef.current.innerHTML = wrap;
}, []);


useEffect(()=>{
 if(!animRef.current) return;
 if(!playedOnce) return;
 const animValue = animRef.current.querySelectorAll(".innerChar")

 animValue.forEach((char,index) =>{
setTimeout(() =>{
char.style.transform = "translateY(0%) rotateZ(0deg)"
char.style.filter="blur(0px)"
},index * 40)
 })

},[playedOnce])
 */

  useTextSplitAnim(animRef, { stagger: 40, startDelay: 100 });
  useTextSplitAnim(pRef, { stagger: 20, startDelay: 20 });

  return (
    <div id="main-feature" ref={sectionRef} className="mainFeatureParent">
    
      <motion.img
        style={gradientStyle}
        src={FeatureGradient}
        className="fGradient"
        alt=""
      />
      <div className="featureHeading">
        <h1 ref={animRef}>
          Our Main <span style={{ color: "#FE6C25" }}>Feature</span>
        </h1>
        <p ref={pRef}>
          Empowering the next generation of users through transparent, secure,
          and decentralized technology
        </p>
      </div>

      <div className="featureBlock">
        <div className="leftCards">
          <div
            style={gridAnimateStyle}
            className="topLeftCard"
            onClick={(e) => openCard("lockedLiquidity", e.currentTarget)}
          >
            <img
              style={{ ...topLeftImgStyle, ...styleFor("topLeftCard") }}
              src={liquidityLockArt}
              alt=""
              srcset=""
            />
            <ExpandButton
              label="Expand Liquidity Locked Forever"
              onClick={(e) => openCard("lockedLiquidity", e.currentTarget.parentElement)}
            />
            <div className="blTag">
              <p>Liquidity Locked Forever</p>
            </div>
            {/* .bl */}
          </div>
          {/* Slot 2. Anti-bot moved here from the top-right; fair execution
              went the other way. Only the CONTENT swapped — the position
              classes stay put, because they carry the layout (which cards are
              full height) and the entrance stagger, and neither of those
              should move with the artwork. */}
          <div
            className="bottomLeftCard"
            onClick={(e) => openCard("botsPay", e.currentTarget)}
          >
            <img
              style={{ ...bottomLeftImgStyle, ...styleFor("bottomLeftCard") }}
              src={botsPayArt}
              alt=""
              srcset=""
            />
            <ExpandButton
              label="Expand Snipers Pay the Most"
              onClick={(e) => openCard("botsPay", e.currentTarget.parentElement)}
            />
            <div className="blTag">
              <p>Snipers Pay the Most</p>
            </div>
          </div>
        </div>
        <div className="rightCards">
          {/* Slot 3. */}
          <div
            className="topRightCard"
            onClick={(e) => openCard("zeroPriceGap", e.currentTarget)}
          >
            <ExpandButton
              label="Expand Zero Price Gap"
              onClick={(e) => openCard("zeroPriceGap", e.currentTarget.parentElement)}
            />
            <div className="blTag">
              <p>Zero Price Gap</p>
            </div>
            <img
              style={{ ...topRightImgStyle, ...styleFor("topRightCard") }}
              src={zeroPriceArt}
              alt=""
              srcset=""
            />
          </div>
          <div
            style={gridAnimateStyle}
            className="bottomRightCard"
            onClick={(e) => openCard("creatorFees", e.currentTarget)}
          >
            <ExpandButton
              label="Expand Earn Every Trade, Forever"
              onClick={(e) => openCard("creatorFees", e.currentTarget.parentElement)}
            />
            <div className="blTag">
              <p>Earn Every Trade, Forever</p>
            </div>
            <img
              style={{ ...bottomRightImgStyle, ...styleFor("bottomRightCard") }}
              src={creatorFeesArt}
              alt=""
              srcset=""
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeCardKey && (
          <FeatureDialog
            key={activeCardKey}
            card={featureDialogData[activeCardKey]}
            origin={dialogOrigin}
            onClose={() => setActiveCardKey(null)}
          />
        )}
      </AnimatePresence>

      {/* null unless the tuner is switched on. */}
      {panel}
    </div>
  );
}
