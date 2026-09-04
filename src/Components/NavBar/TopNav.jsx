import { useEffect, useState, useRef } from "react";
import "./TopNav.css";
import CrackerMark from "./CrackerMark.jsx";
import JoinDialog from "../Join/JoinDialog.jsx";

export default function TopNav() {
  const [showNav, setShowNav] = useState(true);
  const [joinOpen, setJoinOpen] = useState(false);
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
    <>
      <div className={`topNavParent ${showNav ? "show" : "hide"}`}>
        <CrackerMark />
        <button type="button" onClick={() => setJoinOpen(true)} aria-haspopup="dialog">
          Join Us
        </button>
      </div>
      <JoinDialog open={joinOpen} onClose={() => setJoinOpen(false)} />
    </>
  );
}
