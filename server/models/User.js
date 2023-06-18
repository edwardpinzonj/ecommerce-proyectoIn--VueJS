const mongoose = require("../db");
const bcrypt = require("bcrypt");
// Definir el esquema de usuario
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ["admin", "cliente"], required: true },
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

userSchema.pre("save", async function (next) {
  console.log("pre save", this.password);
  try {
    // Solo realiza el hash de la contraseña si es nueva o ha sido modificada
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Crear el modelo de usuario
const User = mongoose.model("User", userSchema);

module.exports = User;
