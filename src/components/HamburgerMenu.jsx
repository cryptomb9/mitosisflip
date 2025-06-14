// src/components/HamburgerMenu.jsx
import React, { useState } from "react";
import AboutModal from "./AboutModal";

const HamburgerMenu = ({ user, open, setOpen }) => {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <div className={`hamburger-menu ${open ? "open" : ""}`}>
      <button onClick={() => setOpen(!open)} className="menu-btn">
        ☰
      </button>
      <div className="menu-items">
        <p>{user?.username || "Guest"}</p>
        <p>{user?.balance ?? 0} mito</p>
        <button onClick={() => setShowAbout(!showAbout)}>How to Play</button>
      </div>
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </div>
  );
};

export default HamburgerMenu;