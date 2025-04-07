import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/CartSlice";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import "./SingleProduct.css";

const SingleProduct = () => {
    const { id } = useParams(); 
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

   useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
        .then((response) => {
            setProduct(response.data);
            setLoading(false);
        })
        .catch((error) => {
            console.error("Error fetching product:", error);
            setError("Product not found");
            setLoading(false);
        });
}, [id]);


    if (loading) return <h2>Loading...</h2>;
    if (error) return <h2>{error}</h2>;

    return (
        <div className="single-product">
            <div className="product-image">
                <img src={product.image} alt={product.name} />
            </div>
            <div className="product-details">
                <h1>{product.name}</h1>
                <p className="rate"><FaStar className="star-icon"/> {product.rating}/5</p>
                <p className="price">Price: ${product.price.toFixed(2)}</p>
                <h3 style={{ marginBottom: "20px" }}>What You Will Learn:</h3>
                <ul>
                    {product.outcomes.map((outcome, index) => (
                        <li key={index}>{outcome}</li>
                    ))}
                </ul>
                <div className="btns">
                    <button className="add-to-cart" onClick={() => dispatch(addToCart(product))}>
                        Add to Cart
                    </button>
                    <button onClick={() => navigate('/')} className="back">Back</button>
                </div>
            </div>
        </div>
    );
};

export default SingleProduct;
