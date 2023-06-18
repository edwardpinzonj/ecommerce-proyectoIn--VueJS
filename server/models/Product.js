const mongoose = require("../db");
const productSchema = new mongoose.Schema({
  sku: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  listPrice: { type: Number, required: true },
  salePrice: { type: Number, required: true },
  dimensions: {
    high: { type: Number },
    wide: { type: Number },
    long: { type: Number },
  },
  thumb: { type: String },
  images: [{ type: String }],
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  createdAt: { type: Date, default: Date.now },
  stock: { type: Number, required: true },
  ranking: { type: Number, default: 0 },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
