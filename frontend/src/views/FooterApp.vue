<template>
  <v-footer class="bg-indigo-lighten-1 text-center d-flex flex-column">
    <div>
      <v-btn
        v-for="icon in icons"
        :key="icon.name"
        class="mx-4"
        :icon="true"
        variant="text"
        @click="redirectToSocial(icon.name)"
      >
        <v-icon>{{ icon.icon }}</v-icon>
      </v-btn>
    </div>

    <div class="pt-0">
      En Proyectos In, nos enorgullece ofrecer productos que no solo sean
      estéticamente atractivos, sino también funcionales y de alta calidad.
      Trabajamos de cerca con nuestros clientes para comprender sus necesidades
      y brindarles soluciones que se adapten a su estilo de vida y espacio.
      Explora nuestro catálogo y descubre cómo podemos ayudarte a transformar tu
      hogar u oficina en espacios acogedores, funcionales y llenos de encanto.
      ¡Bienvenido a Proyectos In!
    </div>

    <v-divider></v-divider>

    <div>{{ new Date().getFullYear() }} — <strong>@edwardpinzonj</strong></div>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    icons: [
      {
        name: "whatsapp",
        icon: "mdi-whatsapp",
        link: "https://api.whatsapp.com/send?phone=NUMERO_DE_TELEFONO",
      },
      {
        name: "facebook",
        icon: "mdi-facebook",
        link: "https://www.facebook.com/",
      },
      {
        name: "linkedin",
        icon: "mdi-linkedin",
        link: "https://www.linkedin.com/in/edwardpinzonj",
      },
      {
        name: "instagram",
        icon: "mdi-instagram",
        link: "https://www.instagram.com/PERFIL",
      },
    ],
  }),
  methods: {
    redirectToSocial(name) {
      const social = this.icons.find((icon) => icon.name === name);
      if (social) {
        window.open(social.link, "_blank");
      }
    },
  },
};
</script>
