<template>
  <v-container>
    <h1>Iniciar sesión</h1>

    <!-- Mostrar mensaje de error en caso de fallo en el inicio de sesión -->
    <div v-if="loginError">
      <p>{{ loginErrorMessage }}</p>
      <button @click="loginError = false">Intentar de nuevo</button>
    </div>

    <v-form @submit.prevent="loginUser">
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

      <v-btn type="submit" color="primary">Iniciar sesión</v-btn>
    </v-form>

    <div>
      ¿No tienes una cuenta?
      <router-link to="/register">Registrarse</router-link>
    </div>
    <div>
      <router-link to="/forgot-password">¿Olvidaste tu contraseña?</router-link>
    </div>
  </v-container>
</template>

<script>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const email = ref("");
    const password = ref("");
    const loginError = ref(false);
    const loginErrorMessage = ref("");

    const emailRules = [
      (value) => !!value || "Correo electrónico requerido",
      (value) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "El email debe ser válido",
    ];

    const passwordRules = [
      (value) => !!value || "Contraseña requerida",
      (value) =>
        value.length >= 8 || "La contraseña debe tener al menos 8 caracteres",
    ];

    async function loginUser() {
      try {
        const loginData = {
          email: email.value,
          password: password.value,
        };
        const response = await axios.post("/api/auth/login", loginData);
        if (response.data.status === "ok") {
          const { token, userType, userName } = response.data;
          localStorage.setItem("token", token);
          localStorage.setItem("userType", userType);
          localStorage.setItem("userName", userName);
          store.commit("setLoggedIn", !!token);
          store.commit("setUserType", userType);
          store.commit("setUserName", userName);
          router.push("/");
        }
        console.log(response.data.message);
      } catch (error) {
        console.error("Error en el inicio de sesión:", error);
        loginError.value = true;
        loginErrorMessage.value =
          "Hubo un problema en el inicio de sesión. Por favor, inténtalo de nuevo.";
      }
    }

    return {
      email,
      password,
      loginError,
      loginErrorMessage,
      loginUser,
      emailRules,
      passwordRules,
    };
  },
};
</script>
