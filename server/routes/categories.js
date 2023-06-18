const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

// Obtener todas las categorías
router.get("/", (req, res) => {
  console.log("Categorías");
  Category.find()
    .then((categories) => res.json(categories))
    .catch((error) =>
      res.status(500).json({ error: "Error al obtener las categorías" })
    );
});

// Obtener una categoría por su ID
router.get("/:id", (req, res) => {
  const categoryId = req.params.id;
  Category.findById(categoryId)
    .then((category) => {
      if (category) {
        res.json(category);
      } else {
        res.status(404).json({ message: "Categoría no encontrada" });
      }
    })
    .catch((error) =>
      res.status(500).json({ error: "Error al obtener la categoría" })
    );
});

// Crear una nueva categoría
router.post("/", (req, res) => {
  const { name, description } = req.body;
  const newCategory = new Category({ name, description });
  newCategory
    .save()
    .then((category) => res.json(category))
    .catch((error) =>
      res.status(500).json({ error: "Error al crear la categoría" })
    );
});

// Actualizar una categoría
router.put("/:id", (req, res) => {
  const categoryId = req.params.id;
  const { name, description } = req.body;
  Category.findByIdAndUpdate(categoryId, { name, description }, { new: true })
    .then((category) => {
      if (category) {
        res.json(category);
      } else {
        res.status(404).json({ message: "Categoría no encontrada" });
      }
    })
    .catch((error) =>
      res.status(500).json({ error: "Error al actualizar la categoría" })
    );
});

// Eliminar una categoría
router.delete("/:id", (req, res) => {
  const categoryId = req.params.id;
  Category.findByIdAndDelete(categoryId)
    .then((category) => {
      if (category) {
        res.json({ message: "Categoría eliminada correctamente" });
      } else {
        res.status(404).json({ message: "Categoría no encontrada" });
      }
    })
    .catch((error) =>
      res.status(500).json({ error: "Error al eliminar la categoría" })
    );
});

module.exports = router;
