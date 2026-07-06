import { useEffect, useState, useRef } from "react";
import "./TopNav.css";
import MainLogo from "../../assets/MainLogo.png";

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
      <img src={MainLogo} alt="Main Logo" />
      <button>Join Us</button>
    </div>
  );
}
