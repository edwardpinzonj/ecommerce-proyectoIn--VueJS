const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("../auth");
const User = require("../models/User");

const router = express.Router();

// Ruta para el inicio de sesión local
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      const token = jwt.sign({ userId: user._id }, "vueauthsecretkey");
      const userType = user.type;
      const userName = user.username;
      // Envía el token al cliente si el inicio de sesión fue exitoso
      return res.json({
        status: "ok",
        token,
        message: "Inicio de sesión exitoso",
        userType,
        userName,
      });
    });
  })(req, res, next);
});

//Ruta para cerrar sesión
router.get("/logout", (req, res) => {
  req.logout(); // Eliminar la sesión del usuario
  res.redirect("/"); // Redirigir al inicio u otra página después de cerrar sesión
});

// Ruta para el registro de usuarios
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }
    // Generar el hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error en el servidor" });
  }
});

// Ruta para el inicio de sesión con Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Ruta de callback para el inicio de sesión con Google
router.get("/google/callback", passport.authenticate("google"), (req, res) => {
  // Maneja la lógica después del inicio de sesión exitoso con Google
  res.redirect("/dashboard");
});

module.exports = router;
