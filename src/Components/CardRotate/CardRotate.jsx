import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import Draggable from "gsap/Draggable";
import "./CardRotate.css";
import { CustomEase } from "gsap/CustomEase";
import circleR from "../../assets/circularR.svg"
import circImg1 from "../../assets/Photo by Bailey Burton.png"
import circImg2 from "../../assets/Photo by ConvertKit.png"
import circImg3 from "../../assets/Photo by Marivi Pazos.png"
import circImg4 from "../../assets/Photo by Michael Dagonakis.png"
import circImg5 from "../../assets/Photo by Mika.png"
import circImg6 from "../../assets/Photo by Ono Kosuki.png"
import circImg7 from "../../assets/Photo by Tom Morbey.png"
import roboFair1 from "../../assets/FairRobo.png"
import roboFair2 from "../../assets/FairRobo2.png"
import backGradient from "../../assets/FeatureGradient.png"
import useTextSplitAnim from "../CustomHook/useTextSplitAnim.jsx";


gsap.registerPlugin(Draggable, CustomEase);
CustomEase.create(
  "osmoEase",
  "0.25, 1, 0.5, 1"
);
const CardRotator = () => {
  const animRef2 = useRef(null);
  const pRef2 = useRef(null);
  const containerRef = useRef(null);
  const dragMoverRef = useRef(null);
  const [onHover, setOnHover] = React.useState(false);
  /* ================= CONFIG ================= */

  let WHEEL_RADIUS = "120vw"; // arc 120 depth (bigger = flatter)
  let GAP_ANGLE = 28;         // spacing between cards
  let DRAG_RATIO = 15;        // drag sensitivity

  /* ================= MAIN LOGIC ================= */

  useEffect(() =>{
    let xWidth = window.innerWidth;
    x=console.log(xWidth);
    if(xWidth < 800){
      WHEEL_RADIUS = "300vw";
      GAP_ANGLE = 45;
      DRAG_RATIO = 5;  
    }
  },[])

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const cards = container.querySelectorAll(".rCard");
    const proxy = document.createElement("div");

    const TOTAL_ARC = cards.length * GAP_ANGLE;
    const wrap = gsap.utils.wrap(-TOTAL_ARC / 2, TOTAL_ARC / 2);
    const snapStep = GAP_ANGLE * DRAG_RATIO ;

    const updateLayout = () => {
      const x = gsap.getProperty(proxy, "x");
      const rotation = x / DRAG_RATIO;

      cards.forEach((card, i) => {
        const angle = wrap(i * GAP_ANGLE + rotation);
        const dist = Math.abs(angle);

        gsap.set(card, {
          rotation: angle,
          transformOrigin: `50% ${WHEEL_RADIUS}`,
          scale: 1,
          opacity: 1,
          zIndex: 100 - Math.round(dist),
        });

        // Optional performance culling
        if (dist > 70) {
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

    return () => draggable.kill();
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
    <div onMouseEnter={() => {setOnHover(true)}} onMouseLeave={() => {setOnHover(false)}} className="cardRotateParent" ref={containerRef}>
      <img id="backGrad" src={backGradient} alt="" srcset="" />
         <div style={onHover ? {opacity:1}:{opacity:0}} ref={dragMoverRef} className="dragMover">
        <div  className="dragCircle">
          <p>Drag</p>
        </div>
      </div>
      
      <img src={circleR} alt="" srcset="" />
      <div className="WhyWe">
        <h1  ref={animRef2}>Why Choose <span style={{color:"rgb(254, 108, 37)"}}>Us</span></h1>
        <p ref={pRef2}>We don’t just build features ,we build clarity, trust, and long-term value. Every decision is driven by correctness, performance, and real-world usability.</p>
      </div>

      {/* INDIVIDUAL CARDS (NO MAP) */}

      <div id="rCard2" className="rCard">
        {/* <h2>Design 1</h2>
        <p>This is the first card.</p> */}
        <div className="commonCardContent">
          <div className="tagLines">
          <div style={{backgroundColor:"#DB6E00"}} className="tagDiv">ZERO SLIPPAGE</div>
          <div style={{backgroundColor:"#DB6E00"}} className="tagDiv">ZERO BOT</div>
          </div>
          <svg width="84" height="84" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  <p>Fixed pricing and bot-free execution ensure transparent, secure trades.</p>
</div>
        </div>

<div className="imgSlideShow">
  <img id="roboFair1" src={roboFair1} alt="" srcset="" />
  <img id="roboFair2" src={roboFair2} alt="" srcset="" />
</div>

      </div>

      <div id="rCard1" className="rCard purple">
         <div className="commonCardContent">
          <div className="tagLines">
          <div style={{backgroundColor:"#D4D4D4" , color:"rgba(0, 0, 0, 0.66)"}} className="tagDiv">BUILD FOR</div>
          <div style={{backgroundColor:"#D4D4D4", color:"rgba(0, 0, 0, 0.66)"}} className="tagDiv">TRUST</div>
          </div>
          <svg width="59" height="65" viewBox="0 0 59 65" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_i_4256_625)">
<path d="M29.8135 0.926758L31.2646 2.15332L31.752 2.54102C32.0711 2.78814 32.5417 3.14161 33.1494 3.56934C34.3655 4.42532 36.1292 5.57781 38.3262 6.7666C42.3414 8.93926 48.6612 11.68 55.999 12.4336L57.9316 12.6318L58.3623 12.6758L58.3809 13.1084L58.4629 15.0498C58.479 15.4282 58.7899 23.7751 55.5752 33.8809C53.6769 39.8487 50.9329 45.2034 47.416 49.793C42.9984 55.5582 37.3632 60.1018 30.6728 63.2969L29.7041 63.7598L29.4893 63.8623L29.2734 63.7598L28.3047 63.2969C21.6143 60.1018 15.98 55.5579 11.5625 49.793C8.04559 45.2031 5.3007 39.8489 3.40234 33.8809C0.187961 23.7758 0.49853 15.4292 0.514648 15.0498L0.597656 13.1074L0.616211 12.6758L1.0459 12.6318L2.97949 12.4336C10.317 11.68 16.6362 8.93922 20.6514 6.7666C22.8483 5.57784 24.6127 4.42554 25.8291 3.56934C26.437 3.14142 26.9081 2.7874 27.2275 2.54004C27.3871 2.41645 27.5087 2.31924 27.5908 2.25293C27.6319 2.21976 27.6636 2.19406 27.6846 2.17676C27.6949 2.16825 27.7027 2.16166 27.708 2.15723C27.7128 2.15322 27.7153 2.15082 27.7158 2.15039L29.168 0.926758L29.4912 0.654297L29.8135 0.926758ZM29.4883 7.70898C28.1371 8.68595 26.0565 10.0823 23.3818 11.5371C20.545 13.0801 17.6118 14.3796 14.6631 15.3994C11.7942 16.3915 8.90205 17.1168 6.03613 17.5703C6.16436 20.5605 6.68829 26.14 8.68457 32.3564C10.401 37.7011 12.8561 42.4652 15.9775 46.5205C19.5899 51.2137 24.1297 54.9853 29.4893 57.749C34.8749 54.9717 39.4326 51.1767 43.0537 46.4512C46.1774 42.3746 48.6295 37.5861 50.3379 32.2148C52.3053 26.0304 52.8187 20.5293 52.9434 17.5703C50.077 17.1168 47.1847 16.3917 44.3154 15.3994C41.3666 14.3796 38.4327 13.0802 35.5957 11.5371C32.9206 10.082 30.8395 8.68588 29.4883 7.70898Z" fill="black" stroke="black"/>
<path d="M45.6289 25.2627L26.9189 43.9727L26.5654 43.6191L16.6582 33.7109L16.3047 33.3574L20.1904 29.4717L26.9189 36.2002L38.2539 24.8662L41.7432 21.377L45.6289 25.2627Z" fill="black" stroke="black"/>
</g>
<defs>
<filter id="filter0_i_4256_625" x="0" y="0" width="62.9766" height="68.417" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="5" dy="5"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.38 0"/>
<feBlend mode="normal" in2="shape" result="effect1_innerShadow_4256_625"/>
</filter>
</defs>
</svg>


<div className="mainTagAndDesc">
  <h1 style={{color:"#201D1D"}}>Verify Badges</h1>
  <p style={{color:"#201D1D"}}>Optional KYC for real transparency</p>
</div>
</div>




        
      <span>CRACKER</span>
      </div>

      <div id="rCard3" className="rCard">
        <div className="commonCardContent">
          <div className="tagLines">
          <div style={{backgroundColor:"rgba(255, 255, 255, 0.23)"}} className="tagDiv">ZERO SLIPPAGE</div>
          <div style={{backgroundColor:"rgba(255, 255, 255, 0.23)"}} className="tagDiv">ZERO BOT</div>
          </div>
          <svg width="84" height="84" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  <p>Fixed pricing and bot-free execution ensure transparent, secure trades.</p>
</div>


        </div>
        <div className="blackCardGraphics">
  <div id="bcard1" className="blackCardRect1"></div>
  <div id="bcard2" className="blackCardRect1"></div>
  <div id="bcard3" className="blackCardRect1"></div>
  <div id="bcard4" className="blackCardRect1"></div>
  <div id="bcard5" className="blackCardRect1"></div>
  

</div>
      </div>

      <div className="rCard orange">
        <h2>Design 4</h2>
        <p>Orange theme.</p>
      </div>



      <div id="rCard6" className="rCard teal">
        <div className="commonCardContent">
          <div className="tagLines">
          <div className="tagDiv">JOIN OUR</div>
          <div className="tagDiv">COMMUNITY</div>
          </div>
          <svg className="car6Svg" width="86" height="76" viewBox="0 0 76 76" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M61.4411 5.64941C60.8381 5.64941 60.2201 5.75968 59.6107 5.9967L39.4656 13.8307C37.5298 14.5835 36.2547 16.4476 36.2547 18.5246V25.4878L16.4975 16.597C15.8145 16.2897 15.113 16.1476 14.4295 16.1476C11.7775 16.1473 9.39453 18.2839 9.39453 21.1897L9.39453 70.4785H42.9697L42.9697 63.7634H66.4723V10.6904C66.4723 7.80195 64.1051 5.64941 61.4411 5.64941ZM39.6122 63.7634V67.121H12.7521L12.7521 21.1897C12.7521 20.9381 12.8072 20.7121 12.896 20.5103C12.9003 20.5005 12.9028 20.4883 12.9072 20.4788C12.9974 20.2845 13.1246 20.118 13.2731 19.9781C13.3722 19.8851 13.4921 19.8252 13.6081 19.7584C13.6789 19.7178 13.7406 19.6594 13.8156 19.6293C14.0088 19.5515 14.2138 19.5084 14.4195 19.5071C14.4227 19.5071 14.4262 19.5052 14.4294 19.5052C14.6148 19.5052 14.7989 19.5626 14.9817 19.6281C15.0274 19.6445 15.0744 19.6385 15.1197 19.6589L27.5002 25.2301L34.8769 28.5497L36.6659 29.3547L38.6223 30.2351C38.917 30.3681 39.1672 30.5832 39.3428 30.8547C39.5183 31.1263 39.6119 31.4427 39.6122 31.766V63.7634H39.6122ZM63.1148 60.4059H42.9698V31.7659C42.9698 29.7841 41.8076 27.9865 40.0002 27.1732L39.6122 26.9986V18.5247C39.6122 17.827 40.0323 17.2129 40.6826 16.9601L60.8277 9.1258C61.0306 9.04692 61.2371 9.00695 61.4412 9.00695C62.2462 9.00695 63.1149 9.65059 63.1149 10.6904L63.1148 60.4059Z" fill="white"/>
<path d="M23.7384 29.6673H30.1456V36.0745H23.7384V29.6673ZM23.7384 41.6808H30.1456V48.088H23.7384V41.6808ZM22.9375 52.8933H30.9465V65.7077H22.9375V52.8933ZM55.7743 20.8574H62.1816V27.2646H55.7743V20.8574ZM55.7743 32.8708H62.1816V39.2781H55.7743V32.8708ZM42.96 46.4862H50.9689V59.3005H42.96V46.4862Z" fill="white"/>
</svg>
<div className="mainTagAndDesc">
  <h1>Community</h1>
  <p>Fixed pricing and bot-free execution ensure transparent, secure trades.</p>
</div>
        </div>
       <div className="commCardCircle">
        {
          [circImg1,circImg2,circImg3,circImg4,circImg5,circImg6,circImg7,circImg5,circImg6,circImg7,,circImg2,circImg3].map((imgSrc, index) => {
            return <img src={imgSrc} id={`ci${index}`} srcset="" />
          })
        }
       </div>
       <button className="commJoin" type="button">Join</button>
      </div>

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
