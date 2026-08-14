import "./BriefSection.css"
import crackerCoin from "../../assets/crackerCoin1.png"
import { useRef, useState , useEffect, useMemo } from "react"
import useTextSplitAnim from "../CustomHook/useTextSplitAnim.jsx";
import launchCard from "../../assets/LaunchCard.png"
import walletCard from "../../assets/walletCard.png"
import dexCard from "../../assets/dexCard.png"
import useInView  from "../CustomHook/useInView";
import scrollCue from "../../assets/ScrollDown.png";

export default function BriefSection() {
    const cardRef = useRef(null);
    const [playedOnce, setPlayedOnce] = useState(false);
    const isVisible = useInView(cardRef, 0.3);

    const pRef = useRef(null);
      useTextSplitAnim(pRef, { stagger: 40, startDelay: 100 });

    // Own trigger rather than the cards' — the cue sits beside the paragraph,
    // well above the product row, so it needs to arrive with the copy.
    const cueRef = useRef(null);
    const cueInView = useInView(cueRef, 0.1);
    const [cueShown, setCueShown] = useState(false);

      useEffect(() => {
        if (isVisible && !playedOnce) {
          setPlayedOnce(true);
        }
      }, [isVisible, playedOnce]);

      useEffect(() => {
        if (cueInView) setCueShown(true);
      }, [cueInView]);

      const products = ["Launchpad","Wallet", "Dex"];

      const cardStyles = useMemo(() => {
        return products.map((_, index) => ({
          animation: playedOnce ? "cardEntry 2.5s cubic-bezier(0.33, 1, 0.68, 1) forwards" : "none",
          animationDelay: playedOnce ? `${index * 0.2}s` : "0s",
        }));
      }, [playedOnce]);


    return(
        <div className="briefSectionShell">
        <div className="briefSectionParent">
            <svg className="svg1" width="819" height="819" viewBox="0 0 819 819" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_f_3806_495)">
<circle cx="409.301" cy="409.3" r="141.5" fill="#FAD4AD"/>
</g>
<defs>
<filter id="filter0_f_3806_495" x="0.000793457" y="6.10352e-05" width="818.6" height="818.6" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="133.9" result="effect1_foregroundBlur_3806_495"/>
</filter>
</defs>
</svg>






<svg className="svg2" width="640" height="557" viewBox="0 0 640 557" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_f_3806_496)">
<ellipse cx="319.801" cy="278.3" rx="130" ry="88.5" fill="#FBD8B4"/>
</g>
<defs>
<filter id="filter0_f_3806_496" x="0.000778198" y="4.57764e-05" width="639.6" height="556.6" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="94.9" result="effect1_foregroundBlur_3806_496"/>
</filter>
</defs>
</svg>

<img src={crackerCoin} className="coin1" />
<img src={crackerCoin} className="coin2" />
           <div className="centerPara">
             <p ref={pRef}>A COMPLETE WEB3 ECOSYSTEM WITH
DEX, WALLET, AND <span style={{color:"#FE6C25"}}>LAUNCHPAD</span>. DESIGNED FOR FAIR MARKETS.</p>
           </div>

           <div ref={cardRef} className="productBox">
            {
              products.map((item,index) =>{
                return(
                  <div style={cardStyles[index]} className="briefProductCard" >
                  
                    <img src={index === 0 ? launchCard : index === 1 ? walletCard : dexCard} alt="" srcset="" />
                    <div className="tagHeading">{item}</div>
                  </div>
                )
              })
            }
           </div>
            </div>

           {/* Outside .briefSectionParent on purpose: that element carries
               `overflow: hidden !important` to clip the blurred blobs and the
               coins, which also sheared the top off this. The shell is still
               scoped to this section, so the cue keeps moving with it — going
               body-level instead is what left the old `.sd` pinned to a fixed
               multiple of the viewport. */}
           <img
             ref={cueRef}
             className={`briefScrollCue${cueShown ? " is-in" : ""}`}
             src={scrollCue}
             alt=""
             aria-hidden="true"
             draggable="false"
           />
           </div>
    )
}