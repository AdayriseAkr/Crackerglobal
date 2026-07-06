import React from "react";
import "./LiquidNav.css";
import {motion} from "framer-motion"
import { NavLink } from "react-router-dom";
const links = [
  { to: "/", label: "Home", end: true },
  { label: "Products", isStatic: true },
  { to: "/contact", label: "Contact" },
  { to: "/blogs", label: "News" },
];
const LiquidNav = () => {
let [hovered, setHovered] = React.useState(false);


  return (
    <motion.div initial={{ width: "0%", height: "3rem" }}
      animate={{ width: "30%", height: "5rem" }}
      transition={{
        type: "spring",
        stiffness: 80,
        damping: 6, // lower damping = more bounce
        mass: 1.1, // smaller mass = faster bounce
       
      }}
       className="liquidGlass-wrapper dock">
      <div className="liquidGlass-effect"></div>
      <div className="liquidGlass-tint"></div>
      <div className="liquidGlass-shine"></div>

      <div className="liquidGlass-text">
        <div style={hovered ? {height:"12rem" } : {height:0 }} onMouseEnter={() => {setHovered(true)}} onMouseLeave={() => {setHovered(false)}}   className="productsOption">
          <div className="liquidGlass-effect"></div>
      <div  className="liquidGlass-tint"></div>
      <div className="liquidGlass-shine" id="liquidGlass-shine-border"></div>
      <div style={{zIndex:"99999 !important"}} className="ProductsOptions">
        <span>Launchpad</span>
        <span>Dex</span>
        <span>Wallet</span>
      </div>
        </div>
        <div className="dock">
        <div className="mainContentDock">
             <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:2,delay:1}} className="navOptions">
            {links.map((link, i) => (
              <motion.div
                key={link.to || link.label}
              >
                {link.isStatic ? (
                  <span id={link.label} onMouseEnter={() => {setHovered(true)}} onMouseLeave={() => {setHovered(false)}}   className="navOption">
                    {link.label}
                  </span>
                ) : (
                  <NavLink
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) =>
                      `navOption ${isActive ? "active" : ""}`
                    }
                  >
                    {link.label}
                  </NavLink>
                )}
              </motion.div>
            ))}
         </motion.div>

         <div className="dividerLine"></div>

         <motion className="navSideOption">
          <span>Login</span>
         </motion>
        </div>
        
        </div>
      </div>

      {/* SVG filter lives in the component so it works anywhere you drop it */}
      <svg style={{ display: "none" }}>
        <filter
          id="glass-distortion"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.01 0.01"
            numOctaves="1"
            seed="5"
            result="turbulence"
          />
          <feComponentTransfer in="turbulence" result="mapped">
            <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
            <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
            <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
          </feComponentTransfer>

          <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />

          <feSpecularLighting
            in="softMap"
            surfaceScale="5"
            specularConstant="1"
            specularExponent="100"
            lightingColor="white"
            result="specLight"
          >
            <fePointLight x="-200" y="-200" z="300" />
          </feSpecularLighting>

          <feComposite
            in="specLight"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="0"
            result="litImage"
          />

          <feDisplacementMap
            in="SourceGraphic"
            in2="softMap"
            scale="150"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

{/* secondHoverFilter */}


    </motion.div>
  );
};

export default LiquidNav;
