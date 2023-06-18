const mongoose = require("../db");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  // Otros campos relevantes para tu proyecto
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
