import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearCart } from "../../redux/CartSlice"; // Import clearCart action
import { useNavigate } from "react-router-dom";

const CheckoutSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the cart after payment success
    dispatch(clearCart());

    // Redirect to home page after 2 seconds
    setTimeout(() => {
      navigate("/");
    }, 2000);
  }, [dispatch, navigate]);

  return (
    <div>
      <h2>Payment Successful! 🎉</h2>
      <p>Redirecting to home...</p>
    </div>
  );
};

export default CheckoutSuccess;
