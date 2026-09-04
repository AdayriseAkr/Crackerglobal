import "./BriefSection.css"
import crackerCoin from "../../assets/crackerCoin1.webp"
import { useRef, useState , useEffect, useMemo } from "react"
import useTextSplitAnim from "../CustomHook/useTextSplitAnim.jsx";
import launchpadArt from "../../assets/launchpadMain2.webp"
import dexArt from "../../assets/dexmain.webp"
import { LAUNCHPAD_URL, DEX_URL } from "../../siteLinks.js"
import useInView  from "../CustomHook/useInView";
import scrollCue from "../../assets/ScrollDown.webp";

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

      // The wallet borrows the launchpad artwork: it sits blurred behind a
      // Coming Soon label, so it reads as texture rather than as a screenshot
      // of something that does not exist yet. Borrowed from Launchpad rather
      // than Dex because Dex is the card right next to it, and the same shot
      // twice in a row would be obvious even blurred. When the wallet ships it
      // wants its own image and this flag removed, nothing else.
      const products = [
        { label: "Launchpad", art: launchpadArt, href: LAUNCHPAD_URL },
        { label: "Dex", art: dexArt, href: DEX_URL },
        { label: "Wallet", art: launchpadArt, comingSoon: true },
      ];

      const cardStyles = useMemo(() => {
        return products.map((_, index) => ({
          animation: playedOnce ? "cardEntry 2.5s cubic-bezier(0.33, 1, 0.68, 1) forwards" : "none",
          animationDelay: playedOnce ? `${index * 0.2}s` : "0s",
        }));
      }, [playedOnce]);


    // Not id="products" any more: that belongs to the section holding all four
    // products with their copy and CTAs. Two elements sharing an id would also
    // mean getElementById returns whichever comes first in the document.
    return(
        <div id="ecosystem" className="briefSectionShell">
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
              products.map((product, index) => {
                const face = (
                  <>
                    <img id={`${product.label}img`} src={product.art} alt="" />
                    <div className="tagHeading">{product.label}</div>
                    {product.comingSoon ? (
                      <span className="briefProductSoon">Coming Soon</span>
                    ) : (
                      <span className="briefProductGo">
                        Go
                        <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                          <path
                            d="M3 8h9M8.5 4l4 4-4 4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    )}
                  </>
                );

                // A real anchor for the two that go somewhere, a plain div for the
                // one that does not. An <a> with no href is not a link to the
                // keyboard or a screen reader, and an <a> pointing nowhere is
                // worse: it announces itself as clickable and then does nothing.
                return product.comingSoon ? (
                  <div
                    key={product.label}
                    style={cardStyles[index]}
                    className="briefProductCard is-soon"
                  >
                    {face}
                  </div>
                ) : (
                  <a
                    key={product.label}
                    href={product.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={cardStyles[index]}
                    className="briefProductCard"
                    aria-label={`Open ${product.label}`}
                  >
                    {face}
                  </a>
                );
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