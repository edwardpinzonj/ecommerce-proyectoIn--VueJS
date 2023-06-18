// Vuetify
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

console.log("vuetify.js: components", components);
const vuetify = createVuetify({
  components,
  directives,
});

export default vuetify;

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
