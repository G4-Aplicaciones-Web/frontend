<script>
import { RecipeService } from "@/domains/recipes/services/recipe.service.js";
import RecipeCardComponent from "@/domains/recipes/components/recipe-card.component.vue";
import { Recipe } from "@/domains/recipes/models/recipe.entity.js";

const recipeService = new RecipeService();

export default {
  name: 'recipe-list',
  components: {
    RecipeCardComponent
  },
  data() {
    return {
      recipes: [],
      filteredRecipes: [],
      searchQuery: '',
      loading: true,
      error: null
    };
  },
  created() {
    this.loadRecipes();
  },
  methods: {
    async loadRecipes() {
      try {
        this.loading = true;
        const recipesData = await recipeService.getAll();
        this.recipes = recipesData.map(data => new Recipe(data));
        this.filteredRecipes = [...this.recipes];
        this.loading = false;
      } catch (error) {
        this.error = 'Error al cargar las recetas. Por favor, inténtalo de nuevo.';
        console.error(error);
        this.loading = false;
      }
    },
    filterRecipes() {
      if (!this.searchQuery) {
        this.filteredRecipes = [...this.recipes];
        return;
      }

      const query = this.searchQuery.toLowerCase();
      this.filteredRecipes = this.recipes.filter(recipe =>
          recipe.title.toLowerCase().includes(query) ||
          recipe.description.toLowerCase().includes(query)
      );
    },
    viewRecipeDetails(recipeId) {
      this.$router.push({ name: 'recipe-detail', params: { id: recipeId } });
    },
    editRecipe(recipeId) {
      this.$router.push({ name: 'recipe-editor', params: { id: recipeId } });
    },
    createNewRecipe() {
      this.$router.push({ name: 'recipe-creator' });
    }
  }
}
</script>

<template>
  <!-- No cambia la plantilla -->
  <div class="recipes-list-page">
    <div class="page-header">
      <h1>{{ $t('recipes.title') }}</h1>
      <button @click="createNewRecipe" class="btn btn-primary">
        <span class="icon">+</span> {{ $t('recipes.newRecipe') }}
      </button>
    </div>

    <div class="search-section">
      <input
          type="text"
          v-model="searchQuery"
          :placeholder="$t('recipes.searchPlaceholder')"
          class="search-input"
          @input="filterRecipes"
      />
    </div>

    <div v-if="loading" class="loading-container">
      <p>{{ $t('recipes.loading') }}</p>
    </div>

    <div v-else-if="filteredRecipes.length === 0" class="no-recipes">
      <p v-if="searchQuery">
        {{ $t('recipes.noMatches') }} "{{ searchQuery }}"
      </p>
      <p v-else>
        {{ $t('recipes.emptyMessage') }}
      </p>
    </div>

    <div v-else class="recipes-grid">
      <recipe-card-component
          v-for="recipe in filteredRecipes"
          :key="recipe.id"
          :recipe="recipe"
          @view-details="viewRecipeDetails(recipe.id)"
          @edit-recipe="editRecipe(recipe.id)"
      />
    </div>
  </div>
</template>

<style scoped>
.recipes-list-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.page-header h1 {
  margin: 0;
  color: #333;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
}

.btn-primary:hover {
  background-color: #3e8e41;
}

.icon {
  margin-right: 5px;
  font-size: 1.2em;
}

.search-section {
  margin-bottom: 25px;
}

.search-input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.25);
}

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.loading-container {
  text-align: center;
  padding: 40px;
  color: #666;
}

.no-recipes {
  text-align: center;
  padding: 40px;
  background-color: #f9f9f9;
  border-radius: 8px;
  color: #666;
}

@media (max-width: 768px) {
  .recipes-grid {
    grid-template-columns: 1fr;
  }
}
</style>