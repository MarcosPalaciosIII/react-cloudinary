const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const productSchema = new Schema({
    title: { type: String },
    price: { type: Number },
    inStock: { type: Boolean },
    description: { type: String },
    image: { type: String },
    imageArray: { type: [String] },
});

const Product = model("Product", productSchema);
module.exports = Product;
