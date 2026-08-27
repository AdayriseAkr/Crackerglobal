import { useEffect, useState, useRef } from "react";
import "./TopNav.css";
import CrackerMark from "./CrackerMark.jsx";

export default function TopNav() {
  const [showNav, setShowNav] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`topNavParent ${showNav ? "show" : "hide"}`}>
      <CrackerMark />
      <button>Join Us</button>
    </div>
  );
}
