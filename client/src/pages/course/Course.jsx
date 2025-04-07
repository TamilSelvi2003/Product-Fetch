import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/CartSlice";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "react-toastify/dist/ReactToastify.css";
import "./Course.css";
import { Link } from "react-router-dom";

const ProductPage = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch products");
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart!`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "5" && product.price < 5) ||
      (priceFilter === "10" && product.price < 10);
    const matchesRating =
      ratingFilter === "all" ||
      (ratingFilter === "3.0" && product.rating <= 3.0) ||
      (ratingFilter === "3.5" && product.rating > 3.0 && product.rating < 4.5) ||
      (ratingFilter === "4.5" && product.rating >= 4.5);

    return matchesSearch && matchesPrice && matchesRating;
  });

  if (error) return <p>Error: {error}</p>;

  return (
    <section className="section">
      <h2>Our Courses</h2>

      {/* Search & Filter Inputs */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search course..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
          <option value="all">All Prices</option>
          <option value="5">Under $5</option>
          <option value="10">Under $10</option>
        </select>

        <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}>
          <option value="all">All Ratings</option>
          <option value="3.0">3.0 & Below</option>
          <option value="3.5">3.5 - 4.4</option>
          <option value="4.5">4.5 & Above</option>
        </select>
      </div>

      {/* Product Listing with Skeleton Loader */}
      <div className="product-container">
        <div className="product-list">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div className="product-card" key={index}>
                  <Skeleton height={150} />
                  <h3><Skeleton width={100} /></h3>
                  <p className="rating"><Skeleton width={50} /></p>
                  <p className="price"><Skeleton width={60} /></p>
                  <button className="add-btn"><Skeleton width={100} height={30} /></button>
                </div>
              ))
            : filteredProducts.map((product) => (
                <div className="product-card" key={product._id}>
                    <Link to={`/product/${product._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                        <img src={product.image} alt={product.name} />
                        <h3>{product.name}</h3>
                        <p className="rating"><FaStar className="star-icon" /> {product.rating}/5</p>
                        <p className="price">${product.price.toFixed(2)}</p>
                    </Link>
                  <button className="add-btn" onClick={() => handleAddToCart(product)}>
                    Add to Cart
                  </button>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default ProductPage;
