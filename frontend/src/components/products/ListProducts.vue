<template>
  <div>
    <v-row v-if="products.length < 1">
      <v-col class="text-center">
        <v-progress-circular
          :size="118"
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col v-for="product in products" :key="product._id">
        <router-link :to="`/product/${product._id}`" class="product-link">
          <v-card class="product-card" max-width="250">
            <v-img
              :src="getProductImageUrl(product)"
              height="200"
              class="product-image"
            ></v-img>
            <div class="product-overlay"></div>
            <div class="product-details">
              <v-card-subtitle class="product-price">
                Precio: {{ formatCurrency(product.salePrice || 0) }}
              </v-card-subtitle>
              <v-card-subtitle class="product-discount">
                Descuento: {{ getDiscountPercentage(product) }}
              </v-card-subtitle>
            </div>
          </v-card>
        </router-link>
      </v-col>
    </v-row>
    <v-pagination
      v-model="currentPage"
      :length="totalPages"
      @update:currentPage="changePage"
    ></v-pagination>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";
import { serverUrl } from "@/config";
const currencyFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
});
export default {
  name: "ListProducts",
  setup() {
    const products = ref([]);
    const totalProducts = ref(0);
    const currentPage = ref(1);
    const itemsPerPage = 5;
    const skypeItems = ref(0);

    onMounted(() => {
      fetchProducts();
    });

    async function fetchProducts() {
      try {
        const response = await axios.get(
          `/api/products/ranking?limit=${itemsPerPage}&sort=-ranking&skip=${skypeItems.value}`
        );
        products.value = response.data.products;
        totalProducts.value = response.data.total;
      } catch (error) {
        console.error(error);
      }
    }

    function formatCurrency(value) {
      return currencyFormatter.format(value || 0);
    }

    function getProductImageUrl(product) {
      return `${serverUrl}/${product.thumb}`;
    }

    function getDiscountPercentage(product) {
      if (product.listPrice && product.salePrice) {
        const discount =
          ((product.listPrice - product.salePrice) / product.listPrice) * 100;
        return `${discount.toFixed(0)}%`;
      }
      return "";
    }

    const totalPages = computed(() => {
      return Math.ceil(totalProducts.value / itemsPerPage);
    });

    watch(currentPage, (newPage) => {
      changePage(newPage);
    });
    function changePage(page) {
      products.value = [];
      skypeItems.value = (page - 1) * itemsPerPage;
      currentPage.value = page;
      //console.log(skypeItems.value);
      fetchProducts();
    }
    return {
      products,
      totalProducts,
      fetchProducts,
      formatCurrency,
      getProductImageUrl,
      getDiscountPercentage,
      changePage,
      currentPage,
      totalPages,
      skypeItems,
    };
  },
};
</script>

<style>
.product-card {
  margin-bottom: 20px;
  background-color: #f2f2f2;
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;
  overflow: hidden;
}

.product-card:hover {
  transform: scale(1.05);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
}

.product-link {
  text-decoration: none;
}

.product-details {
  padding: 16px;
}

.product-price {
  font-weight: bold;
}

.product-discount {
  color: #ff0000;
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* background-color: rgba(0, 0, 0, 0.7); */
  opacity: 0;
  transition: opacity 0.3s;
}

.product-card:hover .product-overlay {
  opacity: 1;
}

.product-image {
  transition: transform 0.3s;
}

.product-card:hover .product-image {
  transform: translateY(-10px);
}
</style>
