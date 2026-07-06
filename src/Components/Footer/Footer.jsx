import { useEffect, useRef } from "react";
import RoboFix from "../Robo3d/RoboFix";
import "./Footer.css";
import useInView from "../CustomHook/useInView"; // adjust path if needed

export default function Footer() {
  const footerRef = useRef(null);
  let xWidth = 1000;

  useEffect(() => {
    xWidth = window.innerWidth;
  },[])
  

  // 👇 Uses YOUR custom observer
  const inView = useInView(footerRef, 0.6); // 20% visible

  return (
    <div ref={footerRef} className="footerParent">
        {/* ✅ Robo loads ONLY when footer is in viewport */}
      {inView && <RoboFix/>}
        <div className="footerCurve"></div>
      <div className="FooterGradient"></div>
      <div className="footerContent">
        <div className="footerMainContent"></div>
        <div className="footerLeftOption">
          <p> Stay Up to date</p>
          <p>get our <br></br>
              newsletter</p>
        </div>

        <div className="emailCollector">
          <input type="email" placeholder="Your Email" />
          <div className="sendEmailButton">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="15" viewBox="0 0 27 15" fill="none">
  <path d="M26.7071 8.07136C27.0976 7.68084 27.0976 7.04768 26.7071 6.65715L20.3431 0.29319C19.9526 -0.0973344 19.3195 -0.0973344 18.9289 0.29319C18.5384 0.683714 18.5384 1.31688 18.9289 1.7074L24.5858 7.36426L18.9289 13.0211C18.5384 13.4116 18.5384 14.0448 18.9289 14.4353C19.3195 14.8259 19.9526 14.8259 20.3431 14.4353L26.7071 8.07136ZM0 7.36426V8.36426H26V7.36426V6.36426H0V7.36426Z" fill="white"/>
</svg>
          </div>
        </div>


<div id="git"><p>Get in touch</p> <span >Lorem ipsum dolor sit amet consectetur adipisicing elit. Non cum voluptatem veritatis quos magnam rem!</span>
<a id="mailHref" href="mailto:support@yourdomain.com" target="_blank" rel="noopener noreferrer">
  support@yourdomain.com
</a>
</div>




<div className="footerBottomOption">
    <p>© 2025 Cracker. All rights reserved.</p>
    <div className="legalBox">
        <p>Terms & Conditions</p>
       <p>Privacy Policy</p>
    </div>
</div>
      </div>

      
    </div>
  );
}


{/* <div className="footerMainContent"></div>
<div className="footerBottomOption">
    <p>© 2025 Cracker. All rights reserved.</p>
    <div className="legalBox">
        <p>Terms & Conditions</p>
       <p>Privacy Policy</p>
    </div>
</div> */}