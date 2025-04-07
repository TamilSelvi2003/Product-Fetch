const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: Number,
    rating: Number,
    outcomes: [String],
});

module.exports = mongoose.model("Product", productSchema);
