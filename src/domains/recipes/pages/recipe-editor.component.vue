<script>
import RecipeFormComponent from "@/domains/recipes/components/recipe-form.component.vue";
import { RecipeService } from "@/domains/recipes/services/recipe.service.js";
import { Recipe } from "@/domains/recipes/models/recipe.entity.js";

export default {
  name: 'recipe-editor',
  components: {
    RecipeFormComponent
  },
  data() {
    return {
      recipe: null, // Will hold the recipe data for the form
      isLoading: false, // State for loading existing recipe data
      isSaving: false, // State for saving the form data
      error: null, // State for errors during loading or saving
      isEditing: false, // Determines if we are editing or creating
      recipeService: new RecipeService() // Instance of the recipe service
    };
  },
  computed: {
    // Get the recipe ID from the route params
    recipeId() {
      return this.$route.params.id;
    },
    // Determine the title based on whether we are editing or creating
    pageTitle() {
      return this.isEditing ? 'Editar Receta' : 'Crear Receta';
    }
  },
  async created() {
    // Check if an ID exists in the route params to determine the mode
    if (this.recipeId) {
      this.isEditing = true;
      await this.fetchRecipe(this.recipeId); // Fetch existing recipe if editing
    } else {
      this.isEditing = false;
      this.recipe = new Recipe({}); // Initialize with an empty recipe for creation
    }
  },
  methods: {
    /**
     * Fetches the recipe data from the service for editing.
     * @param {number} id - The ID of the recipe to fetch.
     */
    async fetchRecipe(id) {
      this.isLoading = true;
      this.error = null;
      try {
        // Fetch the recipe and wrap it in the Recipe entity for type consistency
        const fetchedRecipe = await this.recipeService.getById(id);
        this.recipe = new Recipe(fetchedRecipe);
      } catch (err) {
        this.error = 'Error al cargar la receta. Por favor, inténtalo de nuevo.';
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Handles the form submission (create or update).
     * @param {object} formData - The data from the recipe form component.
     */
    async handleFormSubmit(formData) {
      this.isSaving = true;
      this.error = null; // Clear previous errors
      try {
        let result;
        if (this.isEditing) {
          // Update the existing recipe
          result = await this.recipeService.update(this.recipeId, formData);
          console.log('Receta actualizada:', result);
          // Navigate to the detail page of the updated recipe
          this.$router.push({ name: 'recipe-detail', params: { id: this.recipeId } });
        } else {
          // Create a new recipe
          result = await this.recipeService.create(formData);
          console.log('Nueva receta creada:', result);
          // Navigate to the detail page of the newly created recipe (assuming the API returns the new ID)
          this.$router.push({ name: 'recipe-detail', params: { id: result.id } });
        }
      } catch (err) {
        this.error = `Error al ${this.isEditing ? 'actualizar' : 'crear'} la receta. Por favor, verifica los datos e inténtalo de nuevo.`;
        console.error(err);
      } finally {
        this.isSaving = false;
      }
    },

    /**
     * Handles the form cancellation.
     * Navigates back to the recipe list.
     */
    handleCancel() {
      // Optionally, navigate based on where the user came from.
      // For simplicity, we navigate back to the list page.
      this.$router.push({ name: 'recipe-list' });
    }
  }
}
</script>

<template>
  <div class="recipe-editor-page">
    <h1>{{ pageTitle }}</h1>

    <div v-if="isLoading" class="loading-container">
      <p>Cargando receta...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <button @click="isEditing ? fetchRecipe(recipeId) : null" class="btn btn-primary">
        {{ isEditing ? 'Reintentar cargar' : '' }}
      </button>
      <button v-if="!isEditing" @click="handleCancel" class="btn btn-secondary">
        Volver a la lista
      </button>
    </div>

    <div v-else-if="recipe">
      <recipe-form-component
          :recipe="recipe"
          :is-editing="isEditing"
          @submit="handleFormSubmit"
          @cancel="handleCancel"
          :disabled="isSaving"
      />
      <div v-if="isSaving" class="saving-indicator">
        <p>Guardando...</p>
      </div>
    </div>

    <div v-else class="no-recipe-found">
      <p>Receta no encontrada o error de carga.</p>
      <button @click="handleCancel" class="btn btn-secondary">
        Volver a la lista
      </button>
    </div>
  </div>
</template>

<style scoped>
.recipe-editor-page {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #333;
  text-align: center;
  margin-bottom: 30px;
}

.loading-container,
.error-container,
.no-recipe-found,
.saving-indicator {
  text-align: center;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.loading-container {
  background-color: #e9e9e9;
  color: #555;
}

.error-container {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.error-message {
  margin-bottom: 15px;
}

.no-recipe-found {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeeba;
}

.saving-indicator {
  background-color: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
  margin-top: 20px;
  font-weight: bold;
}


.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 0 5px; /* Add some space between buttons */
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
}

.btn-primary:hover {
  background-color: #3e8e41;
}

.btn-secondary {
  background-color: #f1f1f1;
  color: #333;
}

.btn-secondary:hover {
  background-color: #ddd;
}

</style>