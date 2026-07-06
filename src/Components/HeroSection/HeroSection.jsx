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

  useTextSplitAnim(tagRef, { stagger: 20, startDelay: 10 });
  useTextSplitAnim(tagRef2, { stagger: 20, startDelay: 220 });
  useTextSplitAnim(tagRef3, { stagger: 20, startDelay: 320 });
  useTextSplitAnim(pRef, { stagger: 20, startDelay: 400 });

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 3000);
  }, []);

  useEffect(() => {
    if (!showLoader) loadProp();

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
          <p ref={tagRef}>FAIR LAUNCHES</p>
          <p className="tag2nd" ref={tagRef2}>
            REAL TEAMS
          </p>
          <p className="tag2nd" ref={tagRef3} style={{ color: "#ef5508d8" }}>
            BUILT FOR LAST
          </p>
          <p ref={pRef}>
            Verified identity. Burned liquidity. Devve's only launchpad.
          </p>
        </div>
        <motion.button
          initial={{ opacity: 0, transform: "translateY(120%)" }}
          animate={{ opacity: 1, transform: "translateY(0%)" }}
          transition={{
            duration: 1,
            ease: [0.34, 1.56, 0.64, 1], // same cubic-bezier
            delay: 10.15, // 👈 little delay
          }}
          className="ctaBtn"
        >
          Launch on Cracker
        </motion.button>
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
