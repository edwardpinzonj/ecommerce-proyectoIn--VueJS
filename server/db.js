const mongoose = require("mongoose");

// Establecer la conexión a MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/ecommerce", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useCreateIndex: true,
  })
  .then(() => console.log("Conexión a MongoDB establecida"))
  .catch((error) => console.error("Error al conectar a MongoDB:", error));

module.exports = mongoose;
