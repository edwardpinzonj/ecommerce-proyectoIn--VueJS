<template>
  <div>
    <h1>Productos</h1>
    <v-card>
      <v-card-title>
        <v-toolbar flat>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="showAddDialog = true">Registrar</v-btn>
        </v-toolbar>
      </v-card-title>
      <v-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Thumb</th>
              <th class="text-left">Nombre</th>
              <th class="text-left">Descripción</th>
              <th class="text-left">Precio Lista</th>
              <th class="text-left">Precio Venta</th>
              <th class="text-left">Categoría</th>
              <th class="text-left">Imágenes</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product._id">
              <td>
                <img
                  :src="`${serverUrl}/${product.thumb}`"
                  alt="Thumb"
                  width="50"
                  height="50"
                />
              </td>
              <td>{{ product.name }}</td>
              <td>{{ product.description }}</td>
              <td>{{ product.listPrice }}</td>
              <td>{{ product.salePrice }}</td>
              <td>
                <ul>
                  <li v-for="category in product.categories" :key="category">
                    {{ getCategoryName(category) }}
                  </li>
                </ul>
              </td>
              <td>
                <img
                  v-for="imagen in product.images"
                  :key="imagen"
                  :src="`${serverUrl}/${imagen}`"
                  alt="Imagen"
                  width="50"
                  height="50"
                />
              </td>
              <td class="text-center">
                <router-link :to="`/product/${product._id}`">
                  <v-icon size="small" class="me-2"> mdi-eye </v-icon>
                </router-link>

                <v-icon size="small" class="me-2" @click="editProduct(product)">
                  mdi-pencil
                </v-icon>
                <v-icon size="small" @click="confirmDeleteProduct(product)">
                  mdi-delete
                </v-icon>
              </td>
            </tr>
          </tbody>
        </template>
      </v-table>
    </v-card>

    <!-- Formulario de agregar/editar producto -->
    <v-dialog v-model="showAddDialog" max-width="800px">
      <v-card>
        <v-card-title>
          <span class="headline"
            >{{ editingProduct ? "Editar" : "Registrar" }} Producto</span
          >
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveProduct">
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="form.sku"
                  label="SKU"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="form.name"
                  label="Nombre"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-textarea
                  v-model="form.description"
                  label="Descripción"
                  required
                ></v-textarea>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="form.listPrice"
                  label="Precio de lista"
                  type="number"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="form.salePrice"
                  label="Precio de venta"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="form.dimensions.high"
                  label="Altura"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="form.dimensions.wide"
                  label="Ancho"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="form.dimensions.long"
                  label="Largo"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-file-input
                  v-model="form.thumb"
                  label="Thumb"
                  accept="image/*"
                  multiple
                ></v-file-input>
              </v-col>
              <v-col cols="6">
                <v-file-input
                  v-model="form.images"
                  label="Imágenes"
                  accept="image/*"
                  multiple
                ></v-file-input>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-autocomplete
                  v-model="form.categories"
                  :items="categories"
                  label="Categorías"
                  multiple
                  chips
                  clearable
                  item-title="name"
                  item-value="_id"
                ></v-autocomplete>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="form.stock"
                  label="Stock"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="form.ranking"
                  label="Ranking"
                ></v-text-field>
              </v-col>
              <v-col cols="6"> </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" type="submit">Guardar</v-btn>
                  <v-btn color="error" @click="cancelEdit">Cancelar</v-btn>
                </v-card-actions>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import axios from "axios";
import { serverUrl } from "@/config";

export default {
  name: "ProductosApp",
  setup() {
    const products = ref([]);
    const categories = ref([]);
    const loading = ref(false);
    const showAddDialog = ref(false);
    const editingProduct = ref(null);
    const form = reactive({
      sku: "",
      name: "",
      description: "",
      listPrice: "",
      salePrice: "",
      dimensions: {
        high: "",
        wide: "",
        long: "",
      },
      thumb: null,
      images: [],
      categories: [],
      stock: "",
      ranking: "",
    });
    //Nombre de la ccategoría
    const getCategoryName = (categoryId) => {
      const category = categories.value.find((cat) => cat._id === categoryId);
      return category ? category.name : "";
    };

    // Obtener todos los productos
    const fetchProducts = async () => {
      try {
        loading.value = true;
        const response = await axios.get("/api/products");
        products.value = response.data;
      } catch (error) {
        console.error(error);
      } finally {
        loading.value = false;
      }
    };

    // Obtener todas las categorías
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        categories.value = response.data;
      } catch (error) {
        console.error(error);
      }
    };

    // Guardar un producto
    const saveProduct = async () => {
      try {
        loading.value = true;
        const formData = new FormData();
        formData.append("sku", form.sku);
        formData.append("name", form.name);
        formData.append("description", form.description);
        formData.append("listPrice", form.listPrice);
        formData.append("salePrice", form.salePrice);
        formData.append("dimensions", JSON.stringify(form.dimensions));
        for (let i = 0; i < form.thumb.length; i++) {
          formData.append("thumb", form.thumb[i]);
        }
        // formData.append("thumb", form.thumb);
        for (let i = 0; i < form.images.length; i++) {
          formData.append("images", form.images[i]);
        }
        for (let i = 0; i < form.categories.length; i++) {
          formData.append("categories", form.categories[i]);
        }
        formData.append("stock", form.stock);
        formData.append("ranking", form.ranking);
        if (editingProduct.value) {
          await axios.put(
            `/api/products/${editingProduct.value._id}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
        } else {
          // Crear un nuevo producto
          await axios.post("/api/products", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        }

        showAddDialog.value = false;
        fetchProducts();
        resetForm();
      } catch (error) {
        console.error(error);
      } finally {
        loading.value = false;
      }
    };

    // Editar un producto
    const editProduct = (product) => {
      editingProduct.value = product;
      form.sku = product.sku;
      form.name = product.name;
      form.description = product.description;
      form.listPrice = product.listPrice;
      form.salePrice = product.salePrice;
      form.dimensions = { ...product.dimensions };
      form.thumb = null; //product.thumb ? [`${serverUrl}/${product.thumb}`] : null; // Construir la URL completa de la imagen de thumb
      form.images = [];
      // form.images = product.images
      //   ? product.images.map((image) => `${serverUrl}/${image}`)
      //   : []; // Construir la URL completa de las imágenes
      form.categories = product.categories;
      form.stock = product.stock;
      form.ranking = product.ranking;
      showAddDialog.value = true;
    };

    // Eliminar un producto
    const confirmDeleteProduct = async (product) => {
      if (confirm("¿Está seguro de eliminar este producto?")) {
        try {
          loading.value = true;
          await axios.delete(`/api/products/${product._id}`);
          fetchProducts();
        } catch (error) {
          console.error(error);
        } finally {
          loading.value = false;
        }
      }
    };

    // Cancelar edición
    const cancelEdit = () => {
      editingProduct.value = null;
      resetForm();
      showAddDialog.value = false;
    };

    // Limpiar formulario
    const resetForm = () => {
      form.sku = "";
      form.name = "";
      form.description = "";
      form.listPrice = "";
      form.salePrice = "";
      form.dimensions.high = "";
      form.dimensions.wide = "";
      form.dimensions.long = "";
      form.thumb = null;
      form.images = [];
      form.categories = [];
      form.stock = "";
      form.ranking = "";
    };

    onMounted(() => {
      fetchProducts();
      fetchCategories();
    });

    return {
      getCategoryName,
      products,
      categories,
      loading,
      showAddDialog,
      editingProduct,
      form,
      saveProduct,
      editProduct,
      cancelEdit,
      confirmDeleteProduct,
      serverUrl,
    };
  },
};
</script>
