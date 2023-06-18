<template>
  <div>
    <div v-if="randomProducts.length < 1" class="text-center">
      <v-progress-circular
        :size="118"
        indeterminate
        color="primary"
      ></v-progress-circular>
    </div>

    <v-carousel v-else :height="carouselHeight">
      <v-carousel-item v-for="product in randomProducts" :key="product._id">
        <div class="product-details">
          <div class="image-container">
            <router-link :to="`/product/${product._id}`">
              <img
                :src="getProductImageUrl(product)"
                alt="Product Image"
                class="product-image"
              />
            </router-link>
          </div>
        </div>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script>
import axios from "axios";
import { serverUrl } from "@/config";

export default {
  name: "ProductsRandom",
  data() {
    return {
      randomProducts: [],
      carouselHeight: "300",
    };
  },
  mounted() {
    this.fetchRandomProducts();
  },
  methods: {
    async fetchRandomProducts() {
      try {
        const response = await axios.get("/api/products/random?quantity=2");
        this.randomProducts = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    getProductImageUrl(product) {
      return `${serverUrl}/${product.thumb}`;
    },
  },
};
</script>

<style scope>
.title {
  text-align: center;
  color: #337ab7;
}

.product-details {
  background-color: #f2f2f2;
  padding: 20px;
  margin-bottom: 20px;
}

.product-name {
  text-align: center;
  font-size: 18px;
  margin-bottom: 10px;
}

.image-container {
  position: relative;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-price {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 14px;
  text-align: center;
}
.v-progress-circular {
  margin: 1rem;
}
</style>
