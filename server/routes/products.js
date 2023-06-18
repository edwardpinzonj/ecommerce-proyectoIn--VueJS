const express = require("express");
const router = express.Router();
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs/promises");
const Product = require("../models/Product");
const { JsonWebTokenError } = require("jsonwebtoken");

console.log("Productos");

function convertDimensionsToObject(dimensions) {
  const convertedDimensions = {};
  for (const key in dimensions) {
    if (dimensions.hasOwnProperty(key)) {
      convertedDimensions[key] = parseFloat(dimensions[key]) || 0;
    }
  }
  return convertedDimensions;
}
// Configurar la ruta de almacenamiento con Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = file.originalname.split(".").pop();
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + fileExtension);
  },
});

// Configurar Multer para manejar la carga de archivos
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Tamaño máximo del archivo (5MB en este caso)
  },
  fileFilter: (req, file, cb) => {
    // Validar el tipo de archivo permitido (solo imágenes)
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Formato de archivo inválido. Solo se permiten imágenes."));
    }
  },
});

//obtener productos por ranking

router.get("/ranking", async (req, res) => {
  console.log("Obtener productos por ranking");
  const limit = parseInt(req.query.limit) || 5;
  const skip = parseInt(req.query.skip) || 0;
  const sortField = req.query.sort || "ranking";
  const sortOrder = req.query.order || "desc";

  try {
    const pipeline = [
      {
        $sort: {
          [sortField]: sortOrder === "asc" ? 1 : -1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ];

    const products = await Product.aggregate(pipeline);
    const totalCount = await Product.countDocuments();

    res.json({
      products,
      total: totalCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Ruta para obtener productos aleatorios
router.get("/random", async (req, res) => {
  try {
    console.log("Obtener productos aleatorios");
    // Obtén un número específico de productos aleatorios de la base de datos
    const quantity = parseInt(req.query.quantity) || 5; // Parámetro opcional para especificar la cantidad de productos aleatorios (por defecto 5)

    // Realiza la consulta a la base de datos para obtener los productos aleatorios
    const randomProducts = await Product.aggregate([
      { $sample: { size: quantity } },
    ]);

    res.json(randomProducts);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al obtener los productos aleatorios." });
  }
});

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

// Obtener un producto por su ID
router.get("/:id", async (req, res) => {
  console.log("Obtener un producto por su ID");
  const productId = req.params.id;
  try {
    const product = await Product.findById(productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});

// Crear un nuevo producto
const cpUpload = upload.fields([
  { name: "thumb", maxCount: 1 },
  { name: "images", maxCount: 7 },
]);
router.post("/", cpUpload, async (req, res) => {
  try {
    const {
      sku,
      name,
      description,
      listPrice,
      salePrice,
      dimensions,
      categories,
      stock,
      ranking,
    } = req.body;
    const images = req.files["images"]
      ? req.files["images"].map((file) => file.filename)
      : [];
    let thumbFilename = undefined;
    // Ruta del archivo temporal de la imagen
    if (req.files["thumb"]) {
      const thumb = req.files["thumb"][0];
      const thumbPath = thumb.path;
      const resizedThumb = await sharp(thumbPath)
        .resize(null, 300) // Especifica el tamaño deseado
        .toBuffer();

      // Guardar la imagen redimensionada en la ubicación deseada
      thumbFilename = `thumbnail_${Date.now()}.jpg`; // Cambia el nombre del archivo según tus necesidades
      const thumbPathDest = `./uploads/${thumbFilename}`;

      // Guardar la imagen redimensionada
      await fs.writeFile(thumbPathDest, resizedThumb);
      await fs.unlink(thumbPath); // Eliminar el archivo temporal
    }
    const newProduct = new Product({
      sku,
      name,
      description,
      listPrice,
      salePrice,
      dimensions: JSON.parse(dimensions),
      thumb: thumbFilename,
      images,
      categories,
      stock,
      ranking,
    });

    const product = await newProduct.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el producto" });
  }
});

// Actualizar un producto
router.put("/:id", cpUpload, async (req, res) => {
  try {
    const productId = req.params.id;
    const {
      sku,
      name,
      description,
      listPrice,
      salePrice,
      dimensions,
      categories,
      stock,
      ranking,
    } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    const images = req.files["images"]
      ? req.files["images"].map((file) => file.filename)
      : [];
    let thumbFilename = undefined;
    // Ruta del archivo temporal de la imagen
    if (req.files["thumb"]) {
      const thumb = req.files["thumb"][0];
      const thumbPath = thumb.path;
      const resizedThumb = await sharp(thumbPath)
        .resize({ width: 500, height: 500 }) // Especifica el tamaño deseado
        .toBuffer();

      // Guardar la imagen redimensionada en la ubicación deseada
      thumbFilename = `thumbnail_${Date.now()}.jpg`; // Cambia el nombre del archivo según tus necesidades
      const thumbPathDest = `./uploads/${thumbFilename}`;

      // Guardar la imagen redimensionada
      await fs.writeFile(thumbPathDest, resizedThumb);
      await fs.unlink(thumbPath); // Eliminar el archivo temporal
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        sku,
        name,
        description,
        listPrice,
        salePrice,
        dimensions: JSON.parse(dimensions),
        thumb: thumbFilename,
        images,
        categories,
        stock,
        ranking,
      },
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
});

// Eliminar un producto
router.delete("/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findByIdAndDelete(productId);
    if (product) {
      res.json({ message: "Producto eliminado correctamente" });
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
});

module.exports = router;
