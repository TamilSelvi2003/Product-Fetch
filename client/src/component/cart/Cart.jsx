import React,{useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, incrementQuantity, decrementQuantity,clearCart } from "../../redux/CartSlice";
import { useNavigate,useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import "./cart.css";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get("payment") === "success") {
      dispatch(clearCart()); // Clear cart after successful payment
      navigate("/cart", { replace: true }); // Remove the query param from URL
    }
  }, [location, dispatch, navigate]);

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const gst = totalPrice * 0.18;  
  const discount = totalPrice * 0.10;  
  const finalTotal = Math.max(totalPrice + gst - discount, 0); // Ensure total is not negative

  const handlePayment = async () => {
    try {
      const stripe = await loadStripe('pk_test_51QWy4oKbfdpq6iwyL0m5Hdn9mQQViCaPykLvS61nLf488kaoIHTTIdMC52ny7vQh6K5N1ekWaoHQV2Pf6YSxxrWJ00muWDG1oY'); // Load stripe dynamically

      const response = await fetch("https://product-fetch-backend.onrender.com/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: cartItems }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe payment page
      } else {
        throw new Error("Failed to get payment URL");
      }
    } catch (error) {

      console.error("Payment Error:", error);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className="cart-container">
      <div className="cart-items">
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <button className="continue-btn" onClick={() => navigate("/course")}>Continue Shopping</button>
          </div>
        ) : (
          <div>
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p>Price: ${item.price.toFixed(2)}</p>
                  <div className="quantity-controls">
                    <button 
                      className="decrement" 
                      onClick={() => dispatch(decrementQuantity(item.id))} 
                      disabled={item.quantity === 1}
                    >-</button>
                    <span className="quantity">{item.quantity}</span>
                    <button className="increment" onClick={() => dispatch(incrementQuantity(item.id))}>+</button>
                  </div>
                </div>
                <button className="remove-btn" onClick={() => dispatch(removeFromCart(item.id))}>Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="order-summary">
        <h3>Order Summary</h3>
        <p>Total: ${totalPrice.toFixed(2)}</p>
        <p>GST (18%): ${gst.toFixed(2)}</p>
        <p>Discount (10%): -${discount.toFixed(2)}</p>
        <h3>Final Total: ${finalTotal.toFixed(2)}</h3>
        <button className="payment-btn" onClick={handlePayment}>Proceed to Payment</button>
      </div>
    </div>
  );
};

export default Cart;
