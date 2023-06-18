<template>
  <div class="header-container">
    <div class="background"></div>
    <img :src="`${serverUrl}/banner.jpeg`" alt="Banner" class="illustration" />
  </div>
</template>

<script>
import { serverUrl } from "@/config";
export default {
  name: "HeaderApp",
  setup() {
    return { serverUrl };
  },
};
</script>

<style>
.header-container {
  position: relative;
  width: 100%;
  height: 100px;
  margin: 0 auto;
  background-color: #f7eed6; /* Tono suave de madera clara */
  display: flex;
  align-items: center;
  justify-content: center;
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* background-color: #f7eed6; /* Tono suave de madera clara */
  opacity: 0.5;
}

.illustration {
  width: 100%;
  height: 100%;
}

.company-name {
  font-family: "Arial", sans-serif;
  font-size: 24px;
  font-weight: bold;
  margin-top: 10px;
}
</style>
