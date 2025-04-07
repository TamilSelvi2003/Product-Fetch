import React, { useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./component/navabr/Navbar";
import Cart from "./component/cart/Cart";
import Footer from "./component/footer/Footer";
import Header from "./component/header/Header";
import Courses from "./pages/course/Course";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SingleProduct from "./pages/Single/SingleProduct";
import CheckoutSuccess from "./pages/checkout/Checkout";

const App = () => {
  const footerRef = useRef(null);

  const scrollToFooter = () => {
    footerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Router>
      <ToastContainer />
      {/* Pass scrollToFooter as a prop */}
      <Navbar scrollToFooter={scrollToFooter} />
      <Routes>
        <Route path="/" element={<Header />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/course" element={<Courses />} />
        <Route path="/product/:id" element={<SingleProduct />} />
        <Route path="/sucess" element={<CheckoutSuccess />} />
      </Routes>
      <Footer ref={footerRef} />
    </Router>
  );
};

export default App;
