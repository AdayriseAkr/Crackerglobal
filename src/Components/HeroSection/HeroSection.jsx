import "./HeroSection.css";
import robotHero from "../../assets/rig_robot_LIG2_1.0004.mp4";
import test from "../../assets/test.jpg";
import { useEffect, useRef, useState } from "react";
import CrackerLoading2 from "../CrackerLoading/CrackerLoading2";
import MainFeature from "../MainFeature/MainFeature";
import useTextSplitAnim from "../CustomHook/useTextSplitAnim.jsx";
import BriefSection from "../BriefSection/BriefSection.jsx";
import scrollDown from "../../assets/ScrollDown.png";
import WhySection from "../WhySection/WhySection.jsx";
import useInView from "../CustomHook/useInView.jsx";
import Community from "../Community/Community.jsx";
import { motion } from "framer-motion";
import logo from "../../assets/MainLogo.png";
import CardRotate from "../CardRotate/CardRotate.jsx";

const INTRO_PLAYED_KEY = "crackerIntroPlayed";

export default function HeroSection({ loadProp }) {
  const [loaded, setLoaded] = useState(false);
  const [expend, setExpend] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const tagRef = useRef(null);
  const tagRef2 = useRef(null);
  const tagRef3 = useRef(null);
  const pRef = useRef(null);
  const imgRef = useRef(null);
  const [playedOnce, setPlayedOnce] = useState(false);
  const isVisible = useInView(imgRef, 0.1);
  useEffect(() => {
    if (isVisible && !playedOnce) {
      setPlayedOnce(true);
    }
  }, [isVisible, playedOnce]);

  const tagAnim = useTextSplitAnim(tagRef, { stagger: 20, startDelay: 10, autoPlay: false });
  const tag2Anim = useTextSplitAnim(tagRef2, { stagger: 20, startDelay: 220, autoPlay: false });
  const tag3Anim = useTextSplitAnim(tagRef3, { stagger: 20, startDelay: 320, autoPlay: false });
  const pAnim = useTextSplitAnim(pRef, { stagger: 20, startDelay: 400, autoPlay: false });

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
      tag3Anim.play();
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
          <p className="tag2nd" ref={tagRef2} style={{ color: "#ef5508d8" }}>
            A MEME ECOSYSTEM
          </p>
          <p className="tag2nd" ref={tagRef3}>
            BUILT TO LAST
          </p>
          <p ref={pRef}>
            Built US-compliant, with the user experience the space forgot.
          </p>
        </div>
        <div className="heroCtaRow">
          <motion.button
            initial={{ opacity: 0, transform: "translateY(120%)" }}
            animate={{ opacity: 1, transform: "translateY(0%)" }}
            transition={{
              duration: 1,
              ease: [0.34, 1.56, 0.64, 1], // same cubic-bezier
              delay: 10.15, //
            }}
            className="ctaBtn"
          >
            Launch on Cracker
          </motion.button>
          <motion.button
            initial={{ opacity: 0, transform: "translateY(120%)" }}
            animate={{ opacity: 1, transform: "translateY(0%)" }}
            transition={{
              duration: 1,
              ease: [0.34, 1.56, 0.64, 1],
              delay: 10.25,
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
        </div>
        <motion.div
          initial={{ opacity: 0, transform: "translateX(120%)" }}
          animate={{ opacity: 1, transform: "translateX(0%)" }}
          transition={{
            duration: 1,
            ease: [0.34, 1.56, 0.64, 1], // same cubic-bezier
            delay: 10.15, // 👈 little delay
          }}
          style={expend ? { width: "25rem", height: "25rem" } : ""}
          className="heroBreifBox"
        >
          <img src={logo} alt="" srcset="" />
          <p style={expend ? { display: "block", fontSize: "1.5rem" } : {}}>
            Cracker is the first ecosystem built for DevvE powering secure token
            launches and seamless multi chain trading with no MEV, no slippage,
            powered by Devve CTS.
          </p>
          <p
            onClick={() => {
              setExpend(!expend);
            }}
          >
            {expend ? "Close" : "Read more"}
          </p>
        </motion.div>
        <video autoPlay loop muted playsInline src={robotHero}></video>
      </div>

      {/*  //component under hero section */}
      <div className="gradientMixer"></div>
      <img
        style={playedOnce ? { opacity: 1, transform: " translateX(0px)" } : {}}
        ref={imgRef}
        className="sd"
        src={scrollDown}
        alt=""
        srcset=""
      />

      <MainFeature />
      <BriefSection />
      <CardRotate />
      <Community />
    </>
  );
}
