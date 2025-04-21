const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const formRoutes = require("./routes/formRoutes");
const productRoutes = require("./routes/productRoutes");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
const Product = require("./models/Product"); 
const dotenv = require('dotenv')
require('dotenv').config();


const app = express();
const server = http.createServer(app);


const io = socketIo(server, {
  cors: {
    origin: "https://product-fetch-frontend.onrender.com",   
    methods: ["GET", "POST"],
    credentials: true
  }
});



const corsOptions = {
  origin: "https://product-fetch-frontend.onrender.com", // frontend origin
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
};

app.use(cors(corsOptions));


app.use(express.json());
app.use(cors());


mongoose.connect(process.env.MONGO_URI ,{useNewUrlParser:true, useUnifiedTopology:true} )
  .catch(err => console.error("MongoDB Connection Error:", err));

app.use("/api/products", productRoutes);
app.use("/api/products:id", productRoutes);
app.use("/api/forms", formRoutes);


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
      success_url: "https://product-fetch-frontend.onrender.com/cart",
      cancel_url: "https://product-fetch-frontend.onrender.com/cart",
    });

    console.log("Checkout session created successfully:", session);
    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error.message);
    res.status(500).json({ error: error.message });
  }
});

io.on('connection', (socket) => {
  console.log('User connected');
  
 
  socket.on('userMessage', async (message) => {
    console.log('User message received:', message);  

    const botResponse = await getBotResponse(message);
    console.log('Bot response:', botResponse);  

    socket.emit('botMessage', botResponse);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const getBotResponse = async (message) => {
  try {
    const query = message.toLowerCase();
    console.log("Query:", query); 

    const allProducts = await Product.find();
    console.log("All products:", allProducts);  

    const matchedProduct = allProducts.find(product =>
      query.includes(product.name.toLowerCase())
    );

    if (!matchedProduct) {
      return "Sorry, I couldn't find a product related to your query. Can you please mention the product name?";
    }

    if (query.includes("price")) {
      return `The price of our ${matchedProduct.name} product is $${matchedProduct.price}.`;
    } else if (query.includes("rating")) {
      return `The ${matchedProduct.name} product has a rating of ${matchedProduct.rating} stars.`;
    } else if (query.includes("outcome")) {
      return `By completing the ${matchedProduct.name} product, you will learn: ${matchedProduct.outcomes.join(", ")}.`;
    } else {
      return `Our ${matchedProduct.name} product is available! Ask me about its price, rating, or learning outcomes.`;
    }
  } catch (error) {
    console.error("Error while fetching response:", error);
    return "Sorry, there was an issue processing your request. Please try again later.";
  }
};


server.listen(process.env.PORT || 5000, () => {
  console.log("Server is running on port 5000");
});
