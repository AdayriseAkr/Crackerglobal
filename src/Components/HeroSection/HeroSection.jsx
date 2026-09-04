import "./HeroSection.css";
import robotHero from "../../assets/rig_robot_LIG2_1.0004.min.mp4";
import test from "../../assets/test.webp";
import { useEffect, useRef, useState } from "react";
import CrackerLoading2 from "../CrackerLoading/CrackerLoading2";
import MainFeature from "../MainFeature/MainFeature";
import useTextSplitAnim from "../CustomHook/useTextSplitAnim.jsx";
import BriefSection from "../BriefSection/BriefSection.jsx";
import WhySection from "../WhySection/WhySection.jsx";
import Community from "../Community/Community.jsx";
import { motion } from "framer-motion";
import logo from "../../assets/MainLogo.webp";
import CardRotate from "../CardRotate/CardRotate.jsx";
import SpotlightBento from "../SpotlightBento/SpotlightBento.jsx";
import ProcessSection from "../ProcessSection/ProcessSection.jsx";
import { LAUNCHPAD_URL, DEX_URL } from "../../siteLinks.js";

const INTRO_PLAYED_KEY = "crackerIntroPlayed";

// The circular wallet button is hidden while the wallet is under construction.
// Nothing is deleted to do this: the button, its entry animation and its styles
// are all intact, so flipping this back to true is the whole job of restoring
// it when the wallet ships.
const SHOW_WALLET_BUTTON = false;

// Matches .heroBreifBox's own width/height transition duration, and
// .heroBreifBoxText's own opacity transition duration (--duration-medium /
// --duration-micro), in the CSS — kept as named constants so the JS
// timeline can't fire a step before the CSS animation it's waiting on has
// actually finished (220ms gives the 200ms fade a small safety margin
// rather than cutting it exactly at 200).
const BRIEF_BOX_RESIZE_MS = 500;
const BRIEF_TEXT_FADE_MS = 220;

export default function HeroSection({ loadProp }) {
  const [loaded, setLoaded] = useState(false);
  const [expend, setExpend] = useState(false);
  // Deliberately two separate pieces of state, not one combined "phase"
  // string — that's what caused the jump the user flagged. A single phase
  // (e.g. "expanded" -> "hidden") changes the paragraph's LAYOUT (font-size,
  // line-clamp) and its OPACITY in the exact same React update. Opacity has
  // a CSS transition and animates smoothly; layout properties don't and
  // snap instantly — so the text visibly resized/repositioned while still
  // partly visible, mid-fade, every time. Keeping them independent lets the
  // sequence be: fade out (layout untouched) -> swap layout + resize the
  // box while fully invisible (opacity:0, so the snap can't be seen) ->
  // fade back in (layout already correct, box already the right size).
  // Same shape both directions, which is what makes open and close feel
  // equally soft instead of only one of them being fixed.
  const [textVisible, setTextVisible] = useState(true);
  const [textLayout, setTextLayout] = useState("collapsed"); // "collapsed" | "expanded"
  const briefTimerRef = useRef(null);

  const toggleBrief = () => {
    if (briefTimerRef.current) clearTimeout(briefTimerRef.current);

    const opening = !expend;

    // Step 1: fade the text out first, in whatever layout it's currently
    // in — nothing about its size or line count changes yet.
    setTextVisible(false);

    briefTimerRef.current = setTimeout(() => {
      // Step 2: text is now fully invisible, so swapping its layout and
      // resizing the box are both free to happen without being seen.
      setTextLayout(opening ? "expanded" : "collapsed");
      setExpend(opening);

      briefTimerRef.current = setTimeout(() => {
        // Step 3: box has finished resizing and the text is already in its
        // correct layout — safe to reveal.
        setTextVisible(true);
      }, BRIEF_BOX_RESIZE_MS);
    }, BRIEF_TEXT_FADE_MS);
  };

  useEffect(() => {
    return () => {
      if (briefTimerRef.current) clearTimeout(briefTimerRef.current);
    };
  }, []);

  const [showLoader, setShowLoader] = useState(true);
  const tagRef = useRef(null);
  const tagRef2 = useRef(null);
  const pRef = useRef(null);

  const tagAnim = useTextSplitAnim(tagRef, { stagger: 20, startDelay: 10, autoPlay: false });
  const tag2Anim = useTextSplitAnim(tagRef2, { stagger: 20, startDelay: 220, autoPlay: false });
  // Moved up from 400ms into the slot the removed third line used to occupy —
  // holding the old delay would leave a visible dead beat before the sub line.
  const pAnim = useTextSplitAnim(pRef, { stagger: 20, startDelay: 340, autoPlay: false });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const introAlreadyPlayed = sessionStorage.getItem(INTRO_PLAYED_KEY) === "true";
    const timer = setTimeout(() => {
      setLoaded(true);
      sessionStorage.setItem(INTRO_PLAYED_KEY, "true");
    }, introAlreadyPlayed ? 0 : 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showLoader) {
      loadProp();
      window.scrollTo(0, 0);
      tagAnim.play();
      tag2Anim.play();
      pAnim.play();
    }

    if (showLoader) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // OPTIONAL cleanup
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showLoader]);

  return (
    <>
      {showLoader && (
        <CrackerLoading2 loadingComplete={loaded} unmount={setShowLoader} />
      )}

      <div className="HeroSectionParent">
        <div
          style={
            !showLoader
              ? { animation: "softWipe 0.5s forwards" }
              : { animation: "none" }
          }
          className="transitionBlock"
        ></div>
        <div className="heroTagLine">
          <p ref={tagRef}>CRACK THE EGG</p>
          {/* Two display lines, not three: together they are one sentence —
              crack the egg, for global ideas — where three equally heavy blocks
              read as three competing statements. What Cracker actually IS moved
              down to the supporting line, next to the product detail it belongs
              with, so nothing is said twice. Both lines stay at 16 characters or
              fewer so neither wraps at the mobile display size. */}
          <p className="tag2nd" ref={tagRef2} style={{ color: "#ef5508d8" }}>
            FOR GLOBAL IDEAS
          </p>
          <p ref={pRef}>
            An American-built meme ecosystem. Launchpad, DEX and wallet in one place.
          </p>
        </div>
        <div className="heroCtaRow">
          {/* An anchor, not a button. This goes to another site, so it should
              be openable in a new tab, copyable, and announced as a link —
              none of which a button with a click handler gives you. */}
          <motion.a
            href={LAUNCHPAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, transform: "translateY(120%)" }}
            // Tied to showLoader instead of a fixed mount-relative delay —
            // the loader's own clear time isn't constant (~8.5s on a first
            // visit, ~5.5s on a repeat visit within the same session, since
            // only the initial 3s wait is skipped, not the dismiss
            // animation), so a hardcoded 10.15s left this trailing the
            // loader by anywhere from under a second to several seconds.
            // This fires the instant showLoader flips false, same trigger
            // the tagline reveal already uses.
            animate={showLoader ? { opacity: 0, transform: "translateY(120%)" } : { opacity: 1, transform: "translateY(0%)" }}
            transition={{
              duration: 1,
              ease: [0.34, 1.56, 0.64, 1], // same cubic-bezier
              delay: 0.15,
            }}
            className="ctaBtn"
          >
            <span className="ctaBtn__label">Launch on Cracker</span>
            <svg className="ctaBtn__arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M5 12H19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
              <path d="M13 6L19 12L13 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.a>
          {SHOW_WALLET_BUTTON && (
          <motion.button
            initial={{ opacity: 0, transform: "translateY(120%)" }}
            animate={showLoader ? { opacity: 0, transform: "translateY(120%)" } : { opacity: 1, transform: "translateY(0%)" }}
            transition={{
              duration: 1,
              ease: [0.34, 1.56, 0.64, 1],
              delay: 0.25,
            }}
            className="walletBtn"
            aria-label="Wallet"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="6" width="18" height="13" rx="2.5" stroke="#ef5508" strokeWidth="1.7" />
              <path d="M3 10h18" stroke="#ef5508" strokeWidth="1.7" />
              <circle cx="16.5" cy="14" r="1.4" fill="#ef5508" />
            </svg>
          </motion.button>
          )}
        </div>
        <motion.div
          initial={{ opacity: 0, transform: "translateX(120%)" }}
          animate={showLoader ? { opacity: 0, transform: "translateX(120%)" } : { opacity: 1, transform: "translateX(0%)" }}
          transition={{
            duration: 1,
            ease: [0.34, 1.56, 0.64, 1], // same cubic-bezier
            delay: 0.15,
          }}
          className={`heroBreifBox${expend ? " is-expanded" : ""}`}
        >
          <img src={logo} alt="" srcset="" />
          <p className={`heroBreifBoxText${textLayout === "expanded" ? " is-expanded" : ""}${!textVisible ? " is-hidden" : ""}`}>
            Cracker is where an idea becomes a market. Anyone, anywhere, can{" "}
            <a
              href={LAUNCHPAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="heroBreifBoxLink"
              onClick={(e) => e.stopPropagation()}
            >
              launch a token
            </a>{" "}
            in seconds and{" "}
            <a
              href={DEX_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="heroBreifBoxLink"
              onClick={(e) => e.stopPropagation()}
            >
              trade it
            </a>{" "}
            the moment it goes live, across HOOD, Base, Ink, and Monad. No
            gatekeepers, no borders, no permission.
          </p>
          <p onClick={toggleBrief}>{expend ? "Close" : "Read more"}</p>
        </motion.div>
        {/* Decorative background only. No `controls` attribute, but that alone
            is not enough: browsers add their own start-playback button when
            autoplay is blocked or the file is not loaded yet, which is where
            the play button was coming from. `preload="auto"` removes the
            second cause, .bgVideo in index.css hides the control itself, and
            pointer-events:none there makes the whole element unclickable.
            disablePictureInPicture and controlsList close the right-click and
            long-press routes to a player. */}
        <video
          className="bgVideo"
          src={robotHero}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          controlsList="nodownload noplaybackrate noremoteplayback"
          tabIndex={-1}
          aria-hidden="true"
        ></video>
      </div>

      {/*  //component under hero section */}
      <div className="gradientMixer"></div>

      <MainFeature />
      <ProcessSection />
      <BriefSection />
      <SpotlightBento />
      <CardRotate />
      <Community />
    </>
  );
}
