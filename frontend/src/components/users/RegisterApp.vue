<template>
  <v-container>
    <h1>Registro de Usuarios</h1>

    <!-- Mostrar mensaje de registro exitoso -->
    <div v-if="registrationSuccess">
      <p>¡Registro exitoso!</p>
      <router-link to="/login">Ir al inicio de sesión</router-link>
    </div>

    <!-- Mostrar mensaje de error en caso de fallo en el registro -->
    <div v-if="registrationError">
      <p>{{ registrationErrorMessage }}</p>
      <button @click="registrationError = false">Intentar de nuevo</button>
    </div>

    <v-form
      v-if="!registrationSuccess && !registrationError"
      @submit.prevent="registerUser"
      ref="form"
    >
      <v-text-field
        v-model="username"
        label="Nombre de usuario"
        required
        :rules="usernameRules"
      ></v-text-field>
      <v-text-field
        v-model="name"
        label="Apellido"
        required
        :rules="nameRules"
      ></v-text-field>
      <v-text-field
        v-model="email"
        label="Email"
        required
        :rules="emailRules"
      ></v-text-field>
      <v-text-field
        v-model="password"
        label="Contraseña"
        required
        type="password"
        :rules="passwordRules"
      ></v-text-field>

      <v-btn type="submit" color="primary">Registrar</v-btn>
    </v-form>
  </v-container>
</template>

<script>
import { ref } from "vue";
import { useRoute } from "vue-router";

export default {
  setup() {
    const router = useRoute();
    const typeUser = router.params?.type === "admin" ? "admin" : "cliente";
    console.log("typeUser", typeUser);
    const username = ref("");
    const email = ref("");
    const password = ref("");
    const name = ref("");

    const nameRules = [(value) => !!value || "Nombre completo requerido"];
    const usernameRules = [(value) => !!value || "Nombre de usuario requerido"];
    const emailRules = [
      (value) => !!value || "Correo electrónico requerido",
      (value) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "El email debe ser válido",
      async (value) => {
        if (!value) return true;
        const isUnique = await checkUniqueEmail(value);
        return isUnique || "El correo electrónico ya está registrado";
      },
    ];
    const passwordRules = [
      (value) => !!value || "Contraseña requerida",
      (value) =>
        value.length >= 8 || "La contraseña debe tener al menos 8 caracteres",
    ];

    let registrationSuccess = ref(false);
    let registrationError = ref(false);
    let registrationErrorMessage = ref("");

    async function checkUniqueEmail(email) {
      try {
        const response = await fetch(`/api/users/${email}`);
        return response.status === 404; // Return true if email is not found
      } catch (error) {
        console.error("Error validando el email", error);
        return false;
      }
    }

    async function registerUser() {
      if (validateForm()) {
        const userData = {
          username: username.value,
          email: email.value,
          password: password.value,
          name: name.value,
          type: typeUser,
        };
        try {
          const response = await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
          });

          if (response.ok) {
            console.log("User registered successfully:", response.data);
            registrationSuccess.value = true;
          } else {
            console.error("Error registering user:", response.statusText);
            registrationError.value = true;
            registrationErrorMessage.value =
              "Hubo un problema al registrar el usuario. Por favor, inténtalo de nuevo.";
          }
        } catch (error) {
          console.error("Error registering user:", error);
          registrationError.value = true;
          registrationErrorMessage.value =
            "Hubo un problema al registrar el usuario. Por favor, inténtalo de nuevo.";
        }
      }
    }

    function validateForm() {
      let isValid = true;

      if (!username.value) {
        usernameRules.forEach((rule) => {
          if (typeof rule === "function" && !rule(username.value)) {
            isValid = false;
          }
        });
      }

      if (!name.value) {
        nameRules.forEach((rule) => {
          if (typeof rule === "function" && !rule(name.value)) {
            isValid = false;
          }
        });
      }

      if (!email.value) {
        emailRules.forEach((rule) => {
          if (typeof rule === "function" && !rule(email.value)) {
            isValid = false;
          }
        });
      }

      if (!password.value) {
        passwordRules.forEach((rule) => {
          if (typeof rule === "function" && !rule(password.value)) {
            isValid = false;
          }
        });
      }

      return isValid;
    }

    return {
      username,
      email,
      password,
      name,
      nameRules,
      usernameRules,
      emailRules,
      passwordRules,
      registrationSuccess,
      registrationError,
      registrationErrorMessage,
      registerUser,
    };
  },
};
</script>
