import React, { useState } from "react";
import { FaUserPlus, FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";  
import "./Navbar.css";

const Navbar = ({ scrollToFooter }) => {
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);  
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const [menuOpen, setMenuOpen] = useState(false); // State for menu toggle

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/")}>
        <h2>T Academy<span>..</span></h2>
      </div>

      {/* Hamburger Menu Icon */}
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Navigation Links */}
      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li onClick={() => { navigate("/"); setMenuOpen(false); }}>Home</li>
        <li onClick={() => { navigate("/course"); setMenuOpen(false); }}>Courses</li>
        <li onClick={() => { scrollToFooter(); setMenuOpen(false); }}>Contact</li>
      </ul>

      <div className="icons">
        <div className="cart-text" onClick={() => navigate("/cart")}>
          Cart <span className="count"> [{cartCount}]</span>
        </div>
        {/* <button onClick={() => navigate('/register')} className="signup-btn">
          <FaUserPlus /> Sign Up
        </button> */}
      </div>
    </nav>
  );
};

export default Navbar;
