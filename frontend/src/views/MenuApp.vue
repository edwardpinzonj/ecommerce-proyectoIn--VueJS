<template>
  <nav class="navbar">
    <div class="container">
      <div class="menu-container">
        <router-link v-show="!isMobile" to="/" class="text-decoration-none"
          >Inicio</router-link
        >
        <button v-if="isMobile" class="menu-button" @click="toggleMenu">
          <span class="menu-icon" :class="{ open: menuOpen }"></span>
        </button>
      </div>

      <ul
        class="nav-menu"
        :class="{ open: menuOpen }"
        v-if="!isMobile || menuOpen"
      >
        <li v-show="isMobile">
          <router-link to="/" class="text-decoration-none">Inicio</router-link>
        </li>
        <li
          v-show="isAdmin && isLoggedIn"
          v-for="item in menuItemsAdmin"
          :key="item.title"
        >
          <router-link :to="item.route" class="text-decoration-none">
            {{ item.title }}
          </router-link>
        </li>

        <li v-for="item in menuItems" :key="item.title">
          <router-link :to="item.route" class="text-decoration-none">
            {{ item.title }}
          </router-link>
        </li>
        <li>
          <router-link
            v-if="!isLoggedIn"
            to="/login"
            class="text-decoration-none"
            >Login</router-link
          >
        </li>
        <li>
          <router-link
            v-if="isLoggedIn"
            @click="logout"
            to="/"
            class="text-decoration-none"
            >Logout</router-link
          >
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { useRouter } from "vue-router";
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";

export default {
  name: "MenuApp",
  setup() {
    const router = useRouter();
    const store = useStore();
    const isLoggedIn = computed(() => store.state.isLoggedIn);
    const userName = computed(() => store.state.userName);
    const isAdmin = computed(() => store.state.userType === "admin");
    const menuOpen = ref(false);

    const logout = () => {
      localStorage.removeItem("token");
      store.commit("setLoggedIn", false);
      store.commit("setUserType", null);
      store.commit("setUserName", null);
      router.push("/");
    };

    onMounted(() => {
      const token = localStorage.getItem("token");
      store.commit("setLoggedIn", !!token);
      const userType = localStorage.getItem("userType");
      store.commit("setUserType", userType);
      const userName = localStorage.getItem("userName");
      store.commit("setUserName", userName);
    });

    const menuItems = [
      { title: "Acerca de", route: "/about" },
      { title: "Ayuda", route: "/help" },
    ];
    const menuItemsAdmin = [
      { title: "Categorías", route: "/categories" },
      { title: "Productos", route: "/products" },
    ];

    const isMobile = computed(() => {
      return window.innerWidth <= 768; // Actualizado a 768 para que coincida con la regla CSS correspondiente
    });

    const toggleMenu = () => {
      menuOpen.value = !menuOpen.value;
    };

    return {
      isLoggedIn,
      isAdmin,
      userName,
      logout,
      menuItems,
      menuItemsAdmin,
      isMobile,
      menuOpen,
      toggleMenu,
    };
  },
};
</script>

<style scope>
.navbar {
  background-color: rgb(var(--v-theme-primary)) !important;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.menu-container {
  display: flex;
  align-items: center;
}

.menu-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-icon {
  width: 24px;
  height: 2px;
  background-color: rgb(var(--v-theme-on-primary));
  transition: transform 0.3s ease;
}

.menu-icon.open {
  transform: rotate(45deg);
}

.menu-icon::before,
.menu-icon::after {
  content: "";
  position: absolute;
  width: 24px;
  height: 2px;
  background-color: rgb(var(--v-theme-on-primary));
  transition: transform 0.3s ease;
}

.menu-icon::before {
  transform: translateY(-8px);
}

.menu-icon::after {
  transform: translateY(8px);
}

.nav-menu {
  list-style: none;
  display: flex;
  flex-direction: row;
}

.nav-menu li {
  padding: 1px 10px;
}

.navbar a {
  background-color: rgb(var(--v-theme-primary)) !important;
  color: rgb(var(--v-theme-on-primary)) !important;
  opacity: 1;
  transition: opacity 0.3s ease;
}

.navbar a:hover {
  background-color: rgb(var(--v-theme-primary-variant)) !important;
}

.nav-menu li a {
  background-color: rgb(var(--v-theme-primary)) !important;
  color: rgb(var(--v-theme-on-primary)) !important;
  opacity: 1;
  transition: opacity 0.3s ease;
}

.nav-menu li a:hover {
  background-color: rgb(var(--v-theme-primary-variant)) !important;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .nav-menu {
    top: 50px;
    right: 0;
    width: 100%;
    list-style-type: none;
    background-color: rgb(var(--v-theme-primary)) !important;
    display: none;
  }

  .nav-menu.open {
    display: block;
  }

  .nav-menu li {
    display: block;
    font-size: 16px;
    margin-bottom: 10px;
  }
}
</style>
