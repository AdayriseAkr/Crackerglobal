import React from "react";
import "./LiquidNav.css";
import {motion} from "framer-motion"
import { NavLink, useLocation } from "react-router-dom";
import ContactDialog from "../Contact/ContactDialog.jsx";
import { LAUNCHPAD_URL, DEX_URL } from "../../siteLinks.js";
const links = [
  { to: "/", label: "Home", end: true },
  { label: "Products", isStatic: true },
  // isDialog: opens the contact card rather than navigating. Everything a
  // visitor wants from a contact page — who the company is, where it is
  // registered, which mailbox to use — fits in a panel, and the /contact
  // route currently renders the 3D robot and no contact details at all.
  { label: "Contact", isDialog: true },
];

// Jump-to-section menu that replaces the old (non-functional) Login button —
// there's no login flow, so a quick-nav for people already familiar with
// the site who don't want to scroll past everything again is a better use
// of that spot. Each id matches an `id` added on the target section's root
// element (MainFeature, BriefSection, SpotlightBento, CardRotate).
const QUICK_NAV_LINKS = [
  { label: "Our Main Feature", id: "main-feature" },
  { label: "All Products", id: "products" },
  { label: "Why Cracker", id: "why-cracker" },
  { label: "What You Get", id: "what-you-get" },
];

const LiquidNav = () => {
let [hovered, setHovered] = React.useState(false);
let [menuOpen, setMenuOpen] = React.useState(false);
let [mobileProductsOpen, setMobileProductsOpen] = React.useState(false);
let [quickNavOpen, setQuickNavOpen] = React.useState(false);
let [contactOpen, setContactOpen] = React.useState(false);
const location = useLocation();

// Every path that shuts the mobile menu goes through here. The products
// pop-up is a SIBLING of the panel, not a child of it, so closing the panel
// does not take it with them: clicking Contact while the products sheet was
// open used to dismiss the nav and leave Launchpad/Dex/Wallet floating on the
// page by themselves. Anything that closes one has to close the other.
const closeMobileMenu = () => {
  setMenuOpen(false);
  setMobileProductsOpen(false);
};
const desktopNavRef = React.useRef(null);
const mobileNavRef = React.useRef(null);

// The mobile nav is fixed to the bottom-right, which is exactly where the
// footer puts its Terms and Privacy links — the tab sat on top of them and
// swallowed the taps. It gets out of the way while the footer is on screen.
//
// Hidden rather than layered behind: this element is position:fixed, so a
// higher z-index on the footer would cover it visually while it kept taking
// the clicks in that corner. Nothing to see and nothing to hit is the only
// version that actually frees the links.
let [footerInView, setFooterInView] = React.useState(false);

React.useEffect(() => {
  // Re-queried per route: the footer is not mounted on every page, and the
  // observer has to attach to whichever instance is on screen now.
  const footer = document.querySelector(".footerParent");
  if (!footer) {
    setFooterInView(false);
    return undefined;
  }

  const observer = new IntersectionObserver(
    ([entry]) => setFooterInView(entry.isIntersecting),
    // A sliver counts. Waiting for a quarter of the footer would leave the
    // tab sitting over the links for the first part of the scroll into it.
    { threshold: 0.01 }
  );
  observer.observe(footer);
  return () => observer.disconnect();
}, [location.pathname]);

// An open panel would otherwise fade out mid-use and come back still open.
React.useEffect(() => {
  if (footerInView) closeMobileMenu();
}, [footerInView]);

// Dismiss an open menu when a press lands anywhere outside of it. pointerdown
// rather than click so it covers mouse and touch with one listener and fires
// before the press can move focus or start a scroll; the toggle button itself
// is inside the wrapper, so opening never trips this on its own way in — the
// pointerdown is seen as inside, and the click that follows still toggles.
// The listener is only attached while something is actually open.
React.useEffect(() => {
  if (!quickNavOpen && !menuOpen) return undefined;
  const handlePointerDown = (event) => {
    if (quickNavOpen && !desktopNavRef.current?.contains(event.target)) {
      setQuickNavOpen(false);
    }
    if (menuOpen && !mobileNavRef.current?.contains(event.target)) {
      closeMobileMenu();
    }
  };
  document.addEventListener("pointerdown", handlePointerDown);
  return () => document.removeEventListener("pointerdown", handlePointerDown);
}, [quickNavOpen, menuOpen]);

const toggleMenu = () => {
  setMenuOpen((open) => {
    const next = !open;
    if (!next) setMobileProductsOpen(false);
    return next;
  });
};

// Same guarantee expressed structurally: the pop-up cannot be shown unless
// the panel it belongs to is open, whatever the state says. Belt and braces,
// because this is the second time it has been possible to leave one behind.
const productsPopOpen = menuOpen && mobileProductsOpen;

// The target sections only exist on "/" — if a quick-nav link is clicked
// from another route (e.g. /contact) there's nothing yet to scroll to, so
// this falls back to a full navigation with the id as a hash instead,
// which the browser resolves on its own once that page has loaded.
const goToSection = (id) => {
  setQuickNavOpen(false);
  closeMobileMenu();
  if (location.pathname === "/") {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    window.location.href = `/#${id}`;
  }
};

  return (
    <>
    <motion.div initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 80,
        damping: 6, // lower damping = more bounce
        mass: 1.1, // smaller mass = faster bounce

      }}
       ref={desktopNavRef}
       className={`liquidGlass-wrapper dock desktopDock${quickNavOpen ? " isQuickNavOpen" : ""}`}>
      <div className="liquidGlass-effect"></div>
      <div className="liquidGlass-tint"></div>
      <div className="liquidGlass-shine"></div>

      <div className="liquidGlass-text">
        <div style={hovered ? {height:"12rem" } : {height:0 }} onMouseEnter={() => { if (!quickNavOpen) setHovered(true); }} onMouseLeave={() => {setHovered(false)}}   className="productsOption">
          <div className="liquidGlass-effect"></div>
      <div  className="liquidGlass-tint"></div>
      <div className="liquidGlass-shine" id="liquidGlass-shine-border"></div>
      <div style={{zIndex:"99999 !important"}} className="ProductsOptions">
        {/* These were three bare spans that did nothing at all. Launchpad
            and Dex are live products on their own domains, so they are
            real links and open in a new tab rather than navigating someone
            off the page mid-scroll.

            Wallet stays a span on purpose: an anchor with no destination
            is still announced as a link and still offers a context menu
            full of options that go nowhere. The Soon tag is what says why
            it does not respond, rather than leaving it to feel broken. */}
        <a href={LAUNCHPAD_URL} target="_blank" rel="noopener noreferrer">
          Launchpad
        </a>
        <a href={DEX_URL} target="_blank" rel="noopener noreferrer">
          Dex
        </a>
        <span className="isSoon" aria-disabled="true">
          Wallet
          <em className="navSoonTag">Soon</em>
        </span>
      </div>
        </div>
        {/* Grows out of the dock itself (part of the same glass panel,
            same background layers above) rather than floating as its own
            separate panel — the whole wrapper's height animates open
            (.isQuickNavOpen, in the CSS) to make room for this above the
            existing nav row, matching the wireframe: one shape, options on
            top, the familiar dock pinned at the bottom. Each option fades
            and slides in with its own staggered delay on open; closing
            reverses through the same transition for a real exit, not an
            instant cut. */}
        <div className={`quickNavGrid ${quickNavOpen ? "is-open" : ""}`}>
          {/* Two boxes, not one: .quickNavGridInner only clips the reveal and
              must stay padding-free (a collapsed box keeps its padding, so any
              padding here would leave a sliver of card visible while closed),
              while .quickNavGridCard carries the light background and padding. */}
          <div className="quickNavGridInner">
            <div className="quickNavGridCard">
              {QUICK_NAV_LINKS.map((item, i) => (
                <span
                  key={item.id}
                  className="quickNavGridItem"
                  style={{ transitionDelay: quickNavOpen ? `${i * 0.06}s` : "0s" }}
                  onClick={() => goToSection(item.id)}
                >
                  {item.label}
                </span>
              ))}
            </div>
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
                  <span id={link.label} onMouseEnter={() => { if (!quickNavOpen) setHovered(true); }} onMouseLeave={() => {setHovered(false)}} onClick={() => setQuickNavOpen(false)}   className="navOption">
                    {link.label}
                  </span>
                ) : link.isDialog ? (
                  <button
                    type="button"
                    /* Wears the same active state a NavLink gets for the route
                       you are on: while the card is up, this is where you are. */
                    className={`navOption ${contactOpen ? "active" : ""}`}
                    aria-haspopup="dialog"
                    aria-expanded={contactOpen}
                    onClick={() => {
                      setQuickNavOpen(false);
                      setContactOpen(true);
                    }}
                  >
                    {link.label}
                  </button>
                ) : (
                  <NavLink
                    to={link.to}
                    end={link.end}
                    onClick={() => setQuickNavOpen(false)}
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

         <button
          type="button"
          className={`navSideOption navQuickNavToggle ${quickNavOpen ? "is-open" : ""}`}
          aria-label={quickNavOpen ? "Close quick navigation" : "Open quick navigation"}
          aria-expanded={quickNavOpen}
          onClick={() => {
            setQuickNavOpen((open) => !open);
            setHovered(false);
          }}
         >
          <span className="hamburgerIcon">
            <span className="hamburgerLine"></span>
            <span className="hamburgerLine"></span>
            <span className="hamburgerLine"></span>
          </span>
         </button>
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

    {/* ---- Mobile: hamburger trigger, bottom-right, same glass look ---- */}
    {/* The shell exists so the products pop-up can be a SIBLING of the panel
        rather than a section inside it. The panel clips its own overflow (that
        is what makes the tab morph into a sheet), so nothing inside it can
        ever escape above its top edge. Bottom-anchored with auto height, so
        the panel stays put and anything stacked above it grows upward. */}
    <div
      ref={mobileNavRef}
      className={`mobileNavShell${footerInView ? " is-hidden" : ""}`}
    >

      {/* Products pop-up: its own glass card, one z-layer BEHIND the panel and
          tucked under it by a negative margin, so opening it reads as a second
          sheet sliding out from behind the first rather than a row appearing
          inside it. */}
      <div className={`mobileProductsPop ${productsPopOpen ? "is-open" : ""}`}>
        {/* Pure clipper for the 0fr -> 1fr reveal: no padding, no background. */}
        <div className="mobileProductsPopInner">
          <div className="mobileProductsPopCard">
            <div className="liquidGlass-effect"></div>
            <div className="liquidGlass-tint"></div>
            <div className="liquidGlass-shine"></div>
            {/* Same three, and the same reasoning as the desktop menu
                above. closeMobileMenu on the two live ones so the sheet is
                not left hanging open behind the tab that just opened. */}
            <a
              href={LAUNCHPAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMobileMenu}
            >
              Launchpad
            </a>
            <a
              href={DEX_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMobileMenu}
            >
              Dex
            </a>
            <span className="isSoon" aria-disabled="true">
              Wallet
              <em className="navSoonTag">Soon</em>
            </span>
          </div>
        </div>
      </div>

    <div className={`liquidGlass-wrapper mobileNavToggle ${menuOpen ? "is-open" : ""}`}>
      <div className="liquidGlass-effect"></div>
      <div className="liquidGlass-tint"></div>
      <div className="liquidGlass-shine"></div>

      <div className="mobileNavOptionsRow">
        <div className="mobileNavOptionsInner">
          <nav className="mobileNavOptions">
            {/* Row 1: the three main links, side by side rather than stacked. */}
            <div className="mobileNavPrimary">
              {links.map((link) =>
                link.isDialog ? (
                  <button
                    key={link.label}
                    type="button"
                    className="mobileNavOption"
                    aria-haspopup="dialog"
                    onClick={() => {
                      closeMobileMenu();
                      setContactOpen(true);
                    }}
                  >
                    {link.label}
                  </button>
                ) : link.isStatic ? (
                  <button
                    key={link.label}
                    type="button"
                    /* Tinted rather than given the full `active` orange: `active`
                       means "this is the route you are on", and Home may well be
                       wearing it at the same moment. A softer brand fill says
                       "this one is expanded" without claiming to be the current
                       page or putting two solid orange pills in one row. */
                    className={`mobileNavOption${mobileProductsOpen ? " is-expanded" : ""}`}
                    aria-expanded={mobileProductsOpen}
                    onClick={() => setMobileProductsOpen((open) => !open)}
                  >
                    {link.label}
                  </button>
                ) : (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    onClick={closeMobileMenu}
                    className={({ isActive }) => `mobileNavOption ${isActive ? "active" : ""}`}
                  >
                    {link.label}
                  </NavLink>
                )
              )}
            </div>

            <div className="mobileQuickNavDivider"></div>

            {/* Jump-to-section links, on their own lighter card so they read as
                a separate group from the nav above the line. */}
            <div className="mobileQuickNav">
              {QUICK_NAV_LINKS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="mobileNavOption mobileQuickNavOption"
                  onClick={() => goToSection(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </div>

      <button
        type="button"
        className="hamburgerToggleBtn"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        onClick={toggleMenu}
      >
        <span className="hamburgerIcon">
          <span className="hamburgerLine"></span>
          <span className="hamburgerLine"></span>
          <span className="hamburgerLine"></span>
        </span>
      </button>
    </div>
    </div>

    <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
};

export default LiquidNav;
