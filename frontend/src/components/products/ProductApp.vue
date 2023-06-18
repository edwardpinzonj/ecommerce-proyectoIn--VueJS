<template>
  <div>
    <div v-if="product" class="product-details">
      <v-row class="product-row">
        <v-col>
          <span class="product-name">{{ product.name }}</span>
        </v-col>
      </v-row>
      <v-row class="image-row">
        <v-slide-group
          class="pa-4"
          selected-class="bg-info"
          show-arrows
          v-model="model"
        >
          <v-slide-group-item
            v-for="(image, index) in product.images"
            :key="index"
            v-slot="{ toggle, selectedClass }"
          >
            <v-card
              color="grey-lighten-1"
              :class="['ma-4', selectedClass]"
              height="150"
              width="200"
              @click="toggle"
              @mouseover="toggle"
            >
              <v-img
                :src="getSmallImageUrl(image)"
                :class="{ selected: activeImageIndex === index }"
                @mouseover="setActiveImage(index)"
                alt="Product Image"
              />
            </v-card>
          </v-slide-group-item>
        </v-slide-group>
      </v-row>
      <v-row justify="center" class="mt-4">
        <v-col cols="10" sm="8" md="7" lg="6" class="zoom-image-row">
          <div class="zoom-image-container">
            <v-img
              max-height="500px"
              :src="getLargeImageUrl(product.images[activeImageIndex])"
              class="zoom-image"
              alt="Zoomed Product Image"
              :style="zoomedImageStyle"
              @mousemove="handleMouseMove"
              @mouseenter="startZoom"
              @mouseleave="stopZoom"
            >
              <template v-slot:placeholder>
                <ContentLoader
                  type="image"
                  :width="zoomedImageWidth"
                  :height="zoomedImageHeight"
                />
              </template>
            </v-img>
          </div>
        </v-col>
        <v-col cols="12" md="6" lg="4">
          <v-card class="product-card">
            <v-card-title class="product-description text-center">
              Características
            </v-card-title>
            <v-card-subtitle class="even-row">
              <v-row>
                <v-col>
                  <span><strong>SKU:</strong></span></v-col
                >
                <v-col
                  ><span> {{ product.sku }}</span></v-col
                >
              </v-row>
            </v-card-subtitle>
            <v-card-subtitle class="odd-row"
              ><v-row>
                <v-col
                  ><span><strong>Precio Lista:</strong></span></v-col
                >
                <v-col>
                  <span
                    class="product-list-price"
                    :class="{
                      strikethrough: product.listPrice !== product.salePrice,
                    }"
                  >
                    {{ formatCurrency(product.listPrice) }}
                  </span></v-col
                >
              </v-row>
            </v-card-subtitle>
            <v-card-subtitle class="even-row">
              <v-row>
                <v-col
                  ><span><strong>Precio:</strong></span></v-col
                >
                <v-col>
                  <span> {{ product.salePrice }}</span></v-col
                >
              </v-row>
            </v-card-subtitle>
            <v-card-subtitle class="odd-row">
              <div class="text-center">
                <span><strong>Dimensiones</strong></span>
              </div>
              <v-row>
                <v-col>
                  <span><strong>Alto</strong></span></v-col
                >
                <v-col
                  ><span> {{ product.dimensions?.high }}</span>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  ><span><strong>Ancho</strong></span></v-col
                >
                <v-col
                  ><span> {{ product.dimensions?.wide }} </span></v-col
                >
              </v-row>
              <v-row>
                <v-col
                  ><span><strong>Largo</strong></span></v-col
                ><v-col
                  ><span> {{ product.dimensions?.long }} </span></v-col
                >
              </v-row>
            </v-card-subtitle>
            <v-card-subtitle class="even-row">
              <v-row>
                <v-col>
                  <span><strong>Stock:</strong></span></v-col
                >
                <v-col
                  ><span> {{ product.stock }}</span>
                </v-col>
              </v-row>
            </v-card-subtitle>
            <v-card-subtitle class="odd-row">
              <v-row>
                <v-col
                  ><span><strong>Descripción:</strong></span></v-col
                >
                <v-col
                  ><span> {{ product.description }}</span></v-col
                >
              </v-row>
            </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <v-row>
        <v-col class="text-center">
          <v-progress-circular
            :size="118"
            indeterminate
            color="primary"
          ></v-progress-circular>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import axios from "axios";
import { serverUrl } from "@/config";
import { ContentLoader } from "vue-content-loader";

export default {
  name: "ProductApp",
  components: {
    ContentLoader,
  },
  setup() {
    const router = useRoute();
    const model = ref(null);
    const productId = router.params.id;
    const product = ref(null);
    const activeImageIndex = ref(0);
    const zoomedImageWidth = ref(400);
    const zoomedImageHeight = ref(400);
    const zoomedImageStyle = ref({
      transform: "scale(1)",
      "transform-origin": "0 0",
    });
    const isZooming = ref(false);

    onMounted(fetchProduct);

    async function fetchProduct() {
      try {
        const response = await axios.get(`/api/products/${productId}`);

        product.value = { ...response.data };
      } catch (error) {
        console.error(error);
      }
    }

    function formatCurrency(value) {
      return `$${value.toFixed(2)}`;
    }

    function getSmallImageUrl(image) {
      return `${serverUrl}/${image}`;
    }

    function getLargeImageUrl(image) {
      return `${serverUrl}/${image}`;
    }

    function setActiveImage(index) {
      activeImageIndex.value = index;
    }

    function handleMouseMove(event) {
      if (!isZooming.value) return;
      const imageRect = event.target.getBoundingClientRect();
      const x = event.clientX - imageRect.left;
      const y = event.clientY - imageRect.top;
      const centerX = imageRect.width / 2;
      const centerY = imageRect.height / 2;

      const zoomLevel = 2;
      const offsetX = -((x - centerX) * (zoomLevel - 1));
      const offsetY = -((y - centerY) * (zoomLevel - 1));

      zoomedImageStyle.value = {
        transform: `scale(${zoomLevel}) translate(${offsetX}px, ${offsetY}px)`,
        "transform-origin": `${centerX}px ${centerY}px`,
      };
    }

    function startZoom() {
      isZooming.value = true;
    }

    function stopZoom() {
      isZooming.value = false;
      resetZoom();
    }

    function resetZoom() {
      zoomedImageStyle.value = {
        transform: "scale(1)",
        "transform-origin": "0 0",
      };
    }

    return {
      product,
      activeImageIndex,
      zoomedImageWidth,
      zoomedImageHeight,
      zoomedImageStyle,
      fetchProduct,
      formatCurrency,
      getSmallImageUrl,
      getLargeImageUrl,
      setActiveImage,
      handleMouseMove,
      startZoom,
      stopZoom,
      model,
    };
  },
};
</script>

<style>
.strikethrough {
  text-decoration: line-through;
}

.product-details {
  margin-bottom: 20px;
}

.product-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.image-row {
  display: flex;
}

.image-row .v-img {
  width: 200px;
  height: 150px;
  margin-right: 10px;
  cursor: pointer;
}

.image-row .v-img.selected {
  border: none;
  elevation: 10;
}

.zoom-image-row {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.zoom-image-container {
  width: 100%;
  position: relative;
  overflow: hidden;
}

.zoom-image {
  border: 1px solid #ccc;
  position: absolute;
  top: 0;
  left: 0;
  transition: transform 0.3s;
}

.product-description {
  display: flex;
  flex-direction: column;
}

.product-card {
  margin-top: 20px;
  padding: 20px;
}

.product-card .even-row {
  background-color: #f5f5f5;
  padding: 10px;
}

.product-card .odd-row {
  background-color: white;
  padding: 10px;
}
.product-name {
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Your Font", sans-serif;
  font-size: 24px;
  font-weight: bold;
  text-transform: uppercase;
}
</style>
