import "./MainFeature.css";
import FeatureGradient from "../../assets/FeatureGradient.png";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState, useMemo } from "react";
import useInView from "../CustomHook/useInView.jsx";
import topLeft from "../../assets/topLeft.png";
import bottomLeft from "../../assets/bottomLeft.png";
import topRight from "../../assets/topRight.png";
import bottomRight from "../../assets/bottomRight.png";
import useTextSplitAnim from "../CustomHook/useTextSplitAnim.jsx";
import FeatureDialog from "./FeatureDialog.jsx";
import featureDialogData from "./featureDialogData.js";

function ExpandButton({ onClick, label }) {
  return (
    <button className="cardExpandBtn" onClick={onClick} aria-label={label}>
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
  const openCard = (key, event) => {
    const cardEl = event.currentTarget.parentElement;
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
        ? { animation: "gridAnimate 3s cubic-bezier(0.34, 1.56, 0.64, 1) 1s forwards" }
        : undefined,
    [playedOnce]
  );

  const topLeftImgStyle = useMemo(() => (playedOnce ? { opacity: 1, transition: "all 1.5s ease-in-out 3.3s" } : undefined), [playedOnce]);
  const bottomLeftImgStyle = useMemo(() => (playedOnce ? { opacity: 1, transition: "all 1.5s ease-in-out 3.6s" } : undefined), [playedOnce]);
  const topRightImgStyle = useMemo(() => (playedOnce ? { opacity: 1, transition: "all 1.5s ease-in-out 3.5s" } : undefined), [playedOnce]);
  const bottomRightImgStyle = useMemo(() => (playedOnce ? { opacity: 1, transition: "all 1.5s ease-in-out 3.8s" } : undefined), [playedOnce]);

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
    <div ref={sectionRef} className="mainFeatureParent">
    
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
          >
            <img
              style={topLeftImgStyle}
              src={topLeft}
              alt=""
              srcset=""
            />
            <ExpandButton
              label="Expand Verified Founders"
              onClick={(e) => openCard("verifiedFounders", e)}
            />
            <div className="blTag">
              <p>Verified Founders</p>
            </div>
            {/* .bl */}
          </div>
          <div className="bottomLeftCard">
            <img
              style={bottomLeftImgStyle}
              src={bottomLeft}
              alt=""
              srcset=""
            />
            <ExpandButton
              label="Expand Permanently Locked Liquidity"
              onClick={(e) => openCard("lockedLiquidity", e)}
            />
            <div className="blTag">
              <p>Permanently Locked Liquidity</p>
            </div>
          </div>
        </div>
        <div className="rightCards">
          <div className="topRightCard">
            <ExpandButton
              label="Expand Auction Based Launch Access"
              onClick={(e) => openCard("auctionAccess", e)}
            />
            <div className="blTag">
              <p>Auction Based Launch Access</p>
            </div>
            <img
              style={topRightImgStyle}
              src={topRight}
              alt=""
              srcset=""
            />
          </div>
          <div
            style={gridAnimateStyle}
            className="bottomRightCard"
          >
            <ExpandButton
              label="Expand Built In Stability Reserve"
              onClick={(e) => openCard("stabilityReserve", e)}
            />
            <div className="blTag">
              <p>Built In Stability Reserve</p>
            </div>
            <img
              style={bottomRightImgStyle}
              src={bottomRight}
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
    </div>
  );
}
