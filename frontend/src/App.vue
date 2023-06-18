<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <v-row justify="center" class="mt-4">
          <v-col cols="12" sm="10" md="8" lg="8">
            <HeaderApp />
            <MenuApp />
            <!-- Contenido -->
            <router-view></router-view>

            <FooterApp />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import FooterApp from "./views/FooterApp.vue";
import MenuApp from "./views/MenuApp.vue";
import HeaderApp from "./views/HeaderApp.vue";

export default {
  name: "App",
  components: {
    FooterApp,
    MenuApp,
    HeaderApp,
  },
};
</script>
