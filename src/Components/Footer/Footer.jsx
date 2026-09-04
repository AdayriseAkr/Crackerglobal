import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// Lazy, so three.js and @react-three become their own chunk rather than part
// of the bundle every visitor waits for. The robot already only renders on a
// desktop that has scrolled to the footer, but a static import is resolved at
// load time whether the component is used or not - so phones were downloading
// a 3D engine to run a section that deliberately does not show it.
const RoboFix = lazy(() => import("../Robo3d/RoboFix"));
import "./Footer.css";
import useInView from "../CustomHook/useInView"; // adjust path if needed
import { AnimatePresence } from "framer-motion";
import LegalSheet from "../Legal/LegalSheet.jsx";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef(null);
  const curveRef = useRef(null);
  // null when closed, otherwise the id of the document being shown.
  const [openDoc, setOpenDoc] = useState(null);

  // The 3D robot is desktop only. Not hidden with CSS: RoboFix is a WebGL
  // canvas, and display:none still leaves it compiling shaders and running a
  // render loop on the device least able to afford it. Not rendering it means
  // it costs nothing.
  //
  // The cutoff was 640px, which left tablets rendering it. It never fit there:
  // the camera holds a fixed vertical fov, so a narrower canvas keeps the
  // robot's height and takes away the room beside it, and it read as oversized
  // however it was scaled. 1024 matches the breakpoint the CSS uses for the
  // same boundary everywhere else in the site.
  const ROBOT_HIDDEN_BELOW = "(max-width: 1023px)";
  const [isSmallScreen, setIsSmallScreen] = useState(
    () => typeof window !== "undefined" && window.matchMedia(ROBOT_HIDDEN_BELOW).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(ROBOT_HIDDEN_BELOW);
    const onChange = (e) => setIsSmallScreen(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  let xWidth = 1000;

  // The footer's top edge bends from flat to curved as you scroll into it.
  //
  // .footerCurve is a 150%-wide band sitting behind the gradient plate, so only
  // its top edge is ever visible. At border-radius 0 that band is a rectangle
  // and the edge is a straight line; at 100% it is an ellipse and the edge
  // becomes an arc. Scrubbing between the two is what bends the surface.
  //
  // The resting value in CSS is the curved one, so if this never runs the
  // footer looks exactly as it does today rather than sitting square.
  useLayoutEffect(() => {
    const footer = footerRef.current;
    const curve = curveRef.current;
    if (!footer || !curve) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        curve,
        { borderRadius: "0%" },
        {
          borderRadius: "100%",
          // Linear: scroll position is already doing the easing.
          ease: "none",
          scrollTrigger: {
            trigger: footer,
            // Straight until the footer is a fifth of the way up the screen,
            // then bending the rest of the way in. Tying both ends to the
            // footer's own top edge is what makes the curve read as a function
            // of how much footer is showing.
            start: "top 80%",
            end: "top 10%",
            // Numeric scrub adds a second of catch-up, so the edge keeps
            // bending for a moment after the wheel stops rather than being
            // welded to the scrollbar.
            scrub: 1,
            invalidateOnRefresh: true,
          },
        }
      );
    }, footer);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    xWidth = window.innerWidth;
  },[])
  

  // 👇 Uses YOUR custom observer
  const inView = useInView(footerRef, 0.6); // 20% visible

  return (
    <div ref={footerRef} className="footerParent">
        {/* ✅ Robo loads ONLY when footer is in viewport */}
      {/* No fallback: the robot is decoration, and a spinner in its place
          would draw more attention to the gap than the gap does. */}
      {inView && !isSmallScreen && (
        <Suspense fallback={null}>
          <RoboFix />
        </Suspense>
      )}
        <div ref={curveRef} className="footerCurve"></div>
      <div className="FooterGradient"></div>
      <div className="footerContent">
        <div className="footerMainContent"></div>
        <div className="footerLeftOption">
          <p>All of Cracker</p>
          <p>one complete <br></br>
              ecosystem</p>
        </div>




<div id="git"><p>Get in touch</p> <span>Questions about the products, partnerships, or anything else.</span>
<a id="mailHref" href="mailto:support@crackerglobal.com">
  support@crackerglobal.com
</a>
</div>




<div className="footerBottomOption">
    <p>© 2025 Cracker. All rights reserved.</p>
    <div className="legalBox">
        {/* Buttons, not <p>. These open a dialog, and a paragraph with an
            onClick is invisible to the keyboard and announces nothing to a
            screen reader. */}
        <button
          type="button"
          onClick={() => setOpenDoc("terms")}
          aria-haspopup="dialog"
        >
          Terms &amp; Conditions
        </button>
        <button
          type="button"
          onClick={() => setOpenDoc("privacy")}
          aria-haspopup="dialog"
        >
          Privacy Policy
        </button>
    </div>
</div>
      </div>

      
      <AnimatePresence>
        {openDoc && (
          <LegalSheet docId={openDoc} onClose={() => setOpenDoc(null)} />
        )}
      </AnimatePresence>
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