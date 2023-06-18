const express = require("express");
const router = express.Router();
const User = require("../models/User");

const mongoose = require("../db");
// Obtener todos los usuarios
router.get("/", (req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((error) =>
      res.status(500).json({ error: "Error al obtener los usuarios" })
    );
});

// Obtener un usuario por su ID o por nombre de usuario/correo electrónico
router.get("/:idOrUsernameEmail", (req, res) => {
  const idOrUsernameEmail = req.params.idOrUsernameEmail;
  console.log(
    "Obtener un usuario por su ID o por nombre de usuario/correo electrónico"
  );

  // Verificar si el parámetro es un ID de MongoDB válido
  const isIdValid = mongoose.Types.ObjectId.isValid(idOrUsernameEmail);

  if (isIdValid) {
    // Si es un ID válido, realizar la búsqueda por ID
    User.findById(idOrUsernameEmail)
      .then((user) => {
        if (user) {
          res.json(user);
        } else {
          res.status(404).json({ message: "Usuario no encontrado" });
        }
      })
      .catch((error) =>
        res.status(500).json({ error: "Error al obtener el usuario" })
      );
  } else {
    // Si no es un ID válido, realizar la búsqueda por nombre de usuario o correo electrónico
    User.findOne({
      $or: [{ username: idOrUsernameEmail }, { email: idOrUsernameEmail }],
    })
      .then((user) => {
        if (user) {
          res.json(user);
        } else {
          res.status(404).json({ message: "Usuario no encontrado" });
        }
      })
      .catch((error) =>
        res.status(500).json({ error: "Error al obtener el usuario" })
      );
  }
});

// Crear un nuevo usuario
router.post("/", async (req, res) => {
  const { username, email, password, name, type } = req.body;
  const newUser = new User({
    username,
    email,
    password,
    name,
    type,
  });
  console.log("newUser", newUser);
  newUser
    .save()
    .then((user) => res.json(user))
    .catch((error) => {
      console.log("Error de Usuario", error);
      res.status(500).json({ error: "Error al crear el usuario" });
    });
});

// Actualizar un usuario
router.put("/:id", (req, res) => {
  const userId = req.params.id;
  const { username, password } = req.body;
  User.findByIdAndUpdate(userId, { username, password }, { new: true })
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "Usuario no encontrado" });
      }
    })
    .catch((error) =>
      res.status(500).json({ error: "Error al actualizar el usuario" })
    );
});

// Eliminar un usuario
router.delete("/:id", (req, res) => {
  const userId = req.params.id;
  User.findByIdAndDelete(userId)
    .then((user) => {
      if (user) {
        res.json({ message: "Usuario eliminado correctamente" });
      } else {
        res.status(404).json({ message: "Usuario no encontrado" });
      }
    })
    .catch((error) =>
      res.status(500).json({ error: "Error al eliminar el usuario" })
    );
});

module.exports = router;
