import "./WhySection.css";
import backImg from "../../assets/TrustBack.webp";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import walletImg from "../../assets/walletImg.webp";
import EthIcon from "../../assets/EthIcon.webp";
import dollar from "../../assets/dollar.webp";
import devve from "../../assets/devve.webp";
import cardEgg from "../../assets/CardEgg.webp";

gsap.registerPlugin(ScrollTrigger);

export default function WhySection({ ready }) {
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const tagRef = useRef(null);
  const leftCardRef = useRef(null);
  const rightCardRef = useRef(null);
  const centerCardRef = useRef(null);

  const [hover, setHovered] = useState(false);

  useEffect(() => {
    if (!ready) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=130%",
            scrub: 1.5,
            pin: true,
            pinSpacing: true,
            markers: false,
            invalidateOnRefresh: true,
          },
        });

        tl.from(centerCardRef.current, {
          scale: 0.9,
          opacity: 0,
          duration: 0.8,
          transformOrigin: "center center",
        })
          .from(
            imgRef.current,
            {
              y: 40,
              opacity: 0,
              duration: 0.8,
            },
            "-=0.4"
          )
          .from(
            tagRef.current,
            {
              y: 30,
              opacity: 0,
              duration: 0.8,
            },
            "+=0.2"
          )
          .to(
            centerCardRef.current,
            {
              width: "33%",
              height: "98%",
              scale: 0.8,
              border: "8px solid rgba(104, 74, 74, 0.18)",
              transformOrigin: "center center",
              duration: 1,
            },
            "same1st"
          )
          .to(
            tagRef.current,
            {
              scale: 0.6,
              duration: 1,
            },
            "same1st"
          )
          .from(
            leftCardRef.current,
            {
              y: "150%",
              duration: 1,
            },
            "same2nd"
          )
          .from(
            rightCardRef.current,
            {
              y: "150%",
              duration: 2,
            },
            "same2nd"
          );
      }, containerRef);

      ScrollTrigger.refresh();

      return () => ctx.revert();
    });

    return () => {
      mm.revert(); // 💥 mobile + resize safe cleanup
    };
  }, [ready]);

  return (
    <section className="whySectionWrapper">
      <div className="whySecParent" ref={containerRef}>
        <div ref={centerCardRef} className="whyCenterCard">
          <img ref={imgRef} src={backImg} alt="" />
          <p ref={tagRef} className="whyTagLine">
            Why We Are Trusted in the Crypto{" "}
            <span style={{ color: "#FE6C25" }}>Ecosystem</span>
          </p>
        </div>

        <div ref={leftCardRef} className="leftCardWhy">
          <div
            className="topLeftCardWhy"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <p>Verified badges</p>

            {/* SVGs SAME AS YOUR CODE */}
            {/* no GSAP touch here */}

            <p>Optional KYC for real transparency</p>
          </div>

          <div className="bottomLeftCardWhy">
            <p>Your record stays with you across every launch.</p>
            <img id="centerImgWallet" src={walletImg} alt="" />
            <img id="ethIcon" src={EthIcon} alt="" />
            <img id="dollarW" src={dollar} alt="" />
            <img id="devveW" src={devve} alt="" />
            <p>Bid-to-win + limited launches stop serial deployers.</p>
          </div>
        </div>

        <div ref={rightCardRef} className="rightCardWhy">
          <div className="topRightCardWhy"></div>
          <div className="bottomRightCardWhy">
            <p>
              Zero slippage. <br /> Zero bots.
            </p>
            <img className="cardEgg" src={cardEgg} alt="" />
            <p>CTS swaps block all snipes and front-runs.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
