<template>
  <div>
    <ProductsRandom class="mb-5" />
    <ListProducts class="mb-5" />
  </div>
</template>

<script>
import ProductsRandom from "@/components/products/ProductsRandom.vue";
import ListProducts from "@/components/products/ListProducts.vue";

export default {
  name: "HomeView",
  components: {
    ProductsRandom,
    ListProducts,
  },
};
</script>

<style>
.mb-5 {
  margin-top: 20;
  margin-bottom: 40px;
}
</style>
