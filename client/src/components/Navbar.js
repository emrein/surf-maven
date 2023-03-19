import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEquals, FaBars, FaTimes } from "react-icons/fa";
import { IconContext } from "react-icons";
import "./Navbar.css";

export const Navbar = () => {
  const [isClicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(!isClicked);
  };

  const closeMenu = () => {
    setClicked(false);
  };

  return (
    <IconContext.Provider value={{ color: "#FF6B35" }}>
      <nav className="navbar">
        <Link to="/home" className="navbar-logo">
          <FaEquals />
          <span id="title">Surf-Maven</span>
        </Link>
        <div className="menu-icon" onClick={handleClick}>
          {isClicked ? <FaTimes /> : <FaBars />}
        </div>
        <div className={isClicked ? "navbar-menu active" : "navbar-menu"}>
          <Link to="/home" className="menu-item" onClick={closeMenu}>
            Home
          </Link>
          <Link to="/edit" className="menu-item" onClick={closeMenu}>
            Edit Behaviors
          </Link>
          <Link to="/monitor" className="menu-item" onClick={closeMenu}>
            Monitor Behaviors
          </Link>
          <Link to="/about" className="menu-item" onClick={closeMenu}>
            About
          </Link>
        </div>
      </nav>
    </IconContext.Provider>
  );
};
