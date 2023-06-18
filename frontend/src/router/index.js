import { createRouter, createWebHistory } from "vue-router";

import Home from "@/views/HomeView.vue";
import ProductsApp from "../components/products/ProductsApp.vue";
import CategoriesApp from "../components/categories/CategoriesApp.vue";
import ProductApp from "../components/products/ProductApp.vue";

import AboutApp from "@/views/AboutApp.vue";
import HelpApp from "@/views/HelpApp.vue";
import LoginApp from "../components/users/LoginApp.vue";
import RegisterApp from "../components/users/RegisterApp.vue";

import PageNotFound from "@/views/PageNotFound.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/categories",
    name: "Categories",
    component: CategoriesApp,
    meta: {
      requiresAuth: true, // Indica que esta ruta requiere autenticación
    },
  },
  {
    path: "/products",
    name: "Products",
    component: ProductsApp,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/product/:id",
    name: "Product",
    component: ProductApp,
  },
  {
    path: "/about",
    name: "About",
    component: AboutApp,
  },
  {
    path: "/help",
    name: "Help",
    component: HelpApp,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginApp,
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterApp,
  },
  {
    path: "/register/:type",
    name: "RegisterWithType",
    component: RegisterApp,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "PageNotFound",
    component: PageNotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guardia de navegación
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    // Verifica si la ruta requiere autenticación
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");
    if (token && userType === "admin") {
      // Usuario autenticado y de tipo "admin", permitir el acceso a la ruta
      next();
    } else {
      // Usuario no autenticado o no es de tipo "admin", redirigir a la página de inicio de sesión u otra ruta
      next("/login");
    }
  } else {
    // Ruta pública, permitir el acceso
    next();
  }
});

export default router;
