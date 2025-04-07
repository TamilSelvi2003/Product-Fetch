
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")("sk_test_51QWy4oKbfdpq6iwySY7YdeGjQBLygk16h13R8lWF9i16XSAQtVEjw6YiCqp0rCeYo4x0CIFJVTOZC0OHIcxtfNiw00LvZGHGDk"); // Use correct secret key
const formRoutes = require("./routes/formRoutes");
const productRoutes = require("./routes/productRoutes");
const app = express();
const mongoose = require("mongoose");


app.use(express.json());
app.use(cors());

//db section

mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://itsmethamizh1105:6d3aAYY135Ac2nwd@cluster0.tb6vf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB Connection Error:", err));

//routes

app.use("/api/products", productRoutes);
app.use("/api/products:id", productRoutes);

app.use("/api/forms", formRoutes);



// payment section
app.post("/create-checkout-session", async (req, res) => {
    try {
      console.log("🔄 Received request to create checkout session:", req.body);
  
      const { items } = req.body;
      if (!items || items.length === 0) {
        return res.status(400).json({ error: "Cart is empty" });
      }
  
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: items.map(item => ({
          price_data: {
            currency: "usd",
            product_data: { name: item.name },
            unit_amount: item.price * 100,
          },
          quantity: item.quantity,
        })),
        mode: "payment",
        success_url: "http://localhost:5173/cart?payment=success",  
        cancel_url: "http://localhost:7173/cart?payment=failed",   
      });
      
      console.log(" Checkout session created successfully:", session);
      res.json({ url: session.url });
    } catch (error) {
      console.error(" Error creating checkout session:", error.message);
      res.status(500).json({ error: error.message });
    }
  });
  

    
  

app.listen(5000, () => console.log("Server running on port 5000"));
