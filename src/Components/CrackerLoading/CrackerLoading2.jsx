import "./CrackerLoading.css";
import Logo from "../../assets/Logo.webp"
import { useState , useEffect, use } from "react";
import { pre } from "framer-motion/m";
export default function CrackerLoading2({loadingComplete = false , unmount} ) {


       const [loaderInterval, setLoaderInterval] = useState(0);
       const [shadowOpacity, setShadowOpacity] = useState(0);

       useEffect(() => {
        if(loadingComplete){
          animateLoader();
        }
       },[loadingComplete])
    

       const animateLoader = () =>{
        setLoaderInterval(100);
        setTimeout(() => {
          setShadowOpacity(0.6)
          setLoaderInterval(150);

          setTimeout(() => {
            unmount(false);
          },2000)
        },3500)
       }
   /*  useEffect(() => {
    const interval = setInterval(() => {
        setLoaderInterval((prev) => {
            if (prev >= 150) {
                clearInterval(interval);
                return 150;
            }
            if(prev >= 146){
              setShadowOpacity((prev) => prev + 0.1);
            }
           
            return prev + 1;
        });
    
    }, 60);
    return () => clearInterval(interval);
    },[]) */
 return(
    <>
    <div className="CrackerLoadingParent2">
        <div style={loaderInterval >= 100 ? {height:0} : {}} className="crackReveal"></div>

        <img style={loaderInterval >= 100 ? { animation:"none",opacity:0}:{}} src={Logo} alt="" srcset="" />

 <div
 className="leftSide"
      style={loaderInterval >=150 ? {animation:"leftMoveSlide 2s forwards"} : {}}
    >
      <svg
        viewBox="0 0 1238 1274"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        style={{
          width: "100%",          // stretches horizontally
          height: "100%",         // 100% of .leftSide, which is 100% of the overlay
          objectFit: "cover",     // ensures full coverage
          display: "block",
        }}
        preserveAspectRatio="none" // fills container completely
      >
        <g id="Rectangle 41998" filter="url(#filter0_i_3633_426)">
          <path
            d="M1165.2 0H0V1274H1165.5L1163 1193L1205 1112L1165 950L1122.97 831.5L1164 720L1203 590L1165 480.5L1215 404L1202.5 322L1238 224L1202.5 167L1237 85.5L1165.2 0Z"
            fill="#FE6C25"
          />
        </g>
        <defs>
          <filter
            id="filter0_i_3633_426"
            x="-11"
            y="0"
            width="1249"
            height="1274"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="-11" />
            <feGaussianBlur stdDeviation="21.5" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix
              type="matrix"
               values={`0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 ${shadowOpacity} 0`}
            />
            <feBlend
              mode="normal"
              in2="shape"
              result="effect1_innerShadow_3633_426"
            />
          </filter>
        </defs>
      </svg>
    </div>


{/* svg2 */}


 <div
 className="rightSide"
            style={loaderInterval >=150 ? {animation:"rightMoveSlide 2s forwards"} : {}}

    >
      <svg
        viewBox="0 0 1203 1274"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        style={{
          width: "100%",          // full width
          height: "100%",         // 100% of .rightSide, which is 100% of the overlay
          objectFit: "cover",     // ensures full coverage
          display: "block",
        }}
        preserveAspectRatio="none" // fill the whole area
      >
        <g id="Rectangle 41997" filter="url(#filter0_i_3633_425)">
          <path
            d="M42.5 0H1202.5V1274H42.5V1193.5L84.5 1112.5L42.5 949.5L0 831.5L42.5 719.5L80 590L42.5 480.5L92.5 404.5L80 322L115.5 223.5L80 167.5L115.5 85L42.5 0Z"
            fill="#FE6C25"
          />
        </g>
        <defs>
          <filter
            id="filter0_i_3633_425"
            x="0"
            y="0"
            width="1207.5"
            height="1274"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="5" />
            <feGaussianBlur stdDeviation="14.5" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix
              type="matrix"
               values={`0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 ${shadowOpacity} 0`}
            />
            <feBlend
              mode="normal"
              in2="shape"
              result="effect1_innerShadow_3633_425"
            />
          </filter>
        </defs>
      </svg>
    </div>
    </div>
    </>
 )

}