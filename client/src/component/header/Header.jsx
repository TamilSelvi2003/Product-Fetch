import React from "react";
import "./Header.css";
import headerImage from "../../img/3.jpg"; 
import Product from "../../pages/product/Product";

const Header = () => {
  return (
    <>
    <header className="header">
      <img src={headerImage} alt="Banner" className="banner-img" />
      <div className="overlay">
        <h1 className="training-text">Learn. Grow. Succeed.</h1>
       <p>Master the skills you need to excel in your career with expert-led courses!</p>
        <button className="join-btn">Start Learning Today</button>
      </div>
    
    </header>
    <Product/>
    </>
  );
};

export default Header;
