
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/CartSlice";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Product.css";

const Product = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:5000/api/products")
            .then((response) => {
                setProducts(response.data.slice(0, 6));  
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });
    }, []);
    
    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
        toast.success(`${product.name} added to cart!`, {
            position: "top-right",
            autoClose: 2000,
        });
    };

    return (
        <>
            <section className="product">
                <h2>TOP COURSES</h2>
                <div className="product-container">
                    <div className="product-grid">
                        {products.map((product) => (
                            <div className="product-card" key={product._id}>
                                <Link to={`/course/${product._id}`} className="product-link">
                                    <img src={product.image} alt={product.name} />
                                    <h3>{product.name}</h3>
                                </Link>
                                <p className="rating">
                                    <FaStar className="star-icon"/>{product.rating}/5
                                </p>
                                <p className="price">${product.price.toFixed(2)}</p>
                                <button className="add" onClick={() => handleAddToCart(product)}>
                                    Add to Cart
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <button className="more-btn" onClick={() => navigate('/course')}>More Courses</button>
            </section>
        </>
    );
};

export default Product;
