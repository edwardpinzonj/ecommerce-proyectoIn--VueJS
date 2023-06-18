//importando modulos
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/users");
const productRoutes = require("./routes/products");
const categoryRoutes = require("./routes/categories");
const mongodb = require("./db");
const morgan = require("morgan");
const session = require("express-session");
const passport = require("./auth");

const authRoutes = require("./routes/authRoutes");

const app = express();
Object.keys(require.cache).forEach((key) => {
  delete require.cache[key];
});

// Configurar el middleware para servir archivos estáticos
app.use(express.static("uploads"));
//app.use(express.static("public"));
//middleware
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Passport.js
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//Rutas

app.get("/", (req, res) => {
  res.send("¡El servidor está funcionando correctamente!");
});

console.log("Usuarios");
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);
//iniciando el servidor
const port = 3000;

app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
});
