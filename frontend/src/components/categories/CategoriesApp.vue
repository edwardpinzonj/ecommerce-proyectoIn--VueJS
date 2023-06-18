<template>
  <div>
    <h1>Categorias</h1>
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
              <th class="text-left">Nombre</th>
              <th class="text-left">Descripción</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in categories" :key="category._id">
              <td>{{ category.name }}</td>
              <td>{{ category.description }}</td>
              <td class="text-center">
                <v-icon
                  size="small"
                  class="me-2"
                  @click="editCategory(category)"
                >
                  mdi-pencil
                </v-icon>
                <v-icon size="small" @click="confirmDeleteCategory(category)">
                  mdi-delete
                </v-icon>
              </td>
            </tr>
          </tbody>
        </template>
      </v-table>
    </v-card>

    <v-dialog v-model="showAddDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline"
            >{{ editingCategory ? "Editar" : "Registrar" }} Categoría</span
          >
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveCategory">
            <v-text-field
              v-model="form.name"
              label="Nombre"
              required
            ></v-text-field>
            <v-textarea
              v-model="form.description"
              label="Descripción"
              required
            ></v-textarea>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" type="submit">Guardar</v-btn>
              <v-btn color="error" @click="cancelEdit">Cancelar</v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- Eliminar -->
    <v-dialog v-model="showDeleteDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Eliminar Categoría</span>
        </v-card-title>
        <v-card-text>
          <p>
            ¿Estás seguro de eliminar la categoría "{{
              categoryToDelete.name
            }}"?
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="deleteCategoryConfirmed"
            >Confirmar</v-btn
          >
          <v-btn color="error" @click="cancelDeleteCategory">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import axios from "axios";

export default {
  name: "CategoriesApp",
  setup() {
    const categories = ref([]);
    const loading = ref(false);
    const showAddDialog = ref(false);
    const showDeleteDialog = ref(false);
    const categoryToDelete = ref(null);
    const editingCategory = ref(null);
    const form = reactive({
      name: "",
      description: "",
    });

    const fetchCategories = async () => {
      try {
        loading.value = true;
        const response = await axios.get("/api/categories");
        categories.value = response.data;
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      } finally {
        loading.value = false;
      }
    };

    const editCategory = (category) => {
      editingCategory.value = category;
      form.name = category.name;
      form.description = category.description;
      showAddDialog.value = true;
    };

    const cancelEdit = () => {
      editingCategory.value = null;
      resetForm();
      showAddDialog.value = false;
    };

    const saveCategory = async () => {
      try {
        loading.value = true;
        if (editingCategory.value) {
          // Actualizar categoría existente
          const response = await axios.put(
            `/api/categories/${editingCategory.value._id}`,
            {
              name: form.name,
              description: form.description,
            }
          );
          const updatedCategory = response.data;
          const index = categories.value.findIndex(
            (category) => category._id === updatedCategory._id
          );
          if (index !== -1) {
            categories.value.splice(index, 1, updatedCategory);
          }
        } else {
          // Registrar nueva categoría
          const response = await axios.post("/api/categories", {
            name: form.name,
            description: form.description,
          });
          const newCategory = response.data;
          categories.value.push(newCategory);
        }
        cancelEdit();
      } catch (error) {
        console.error("Error al guardar la categoría:", error);
      } finally {
        loading.value = false;
      }
    };

    const confirmDeleteCategory = (category) => {
      categoryToDelete.value = category;
      showDeleteDialog.value = true;
    };

    const cancelDeleteCategory = () => {
      console.log("cancelDeleteCategory", categoryToDelete.value);
      //categoryToDelete.value = null;
      showDeleteDialog.value = false;
    };

    const deleteCategoryConfirmed = async () => {
      try {
        const category = categoryToDelete.value;
        if (category !== null) {
          await axios.delete(`/api/categories/${category._id}`);
          categories.value = categories.value.filter(
            (c) => c._id !== category._id
          );
        }
        cancelDeleteCategory();
      } catch (error) {
        console.error("Error al eliminar la categoría:", error);
      }
    };

    const resetForm = () => {
      form.name = "";
      form.description = "";
    };

    onMounted(fetchCategories);

    return {
      categories,
      loading,
      showAddDialog,
      showDeleteDialog,
      categoryToDelete,
      editingCategory,
      form,
      fetchCategories,
      editCategory,
      cancelEdit,
      saveCategory,
      confirmDeleteCategory,
      cancelDeleteCategory,
      deleteCategoryConfirmed,
    };
  },
};
</script>
