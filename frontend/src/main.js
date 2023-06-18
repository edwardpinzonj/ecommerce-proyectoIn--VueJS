import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";

//import VSkeletonLoader from "v-skeleton-loader";
//import panZoom from "vue-panzoom";

const app = createApp(App);
//app.component("VSkeletonLoader", VSkeletonLoader);

loadFonts();

app.use(store).use(router).use(vuetify).mount("#app");
