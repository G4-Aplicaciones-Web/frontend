<script>
import {Recipe} from "@/domains/recipes/models/recipe.entity.js";

export default {
  name: 'recipe-card',
  props: {
    recipe: {
      type: Recipe,
      required: true,
    }
  },
  methods: {
    truncateDescription(description) {
      return description.length > 100 ? description.substring(0, 100) + '...' : description;
    },
    viewDetails() {
      this.$emit('view-details', this.recipe.id);
    },
    editRecipe() {
      this.$emit('edit-recipe', this.recipe.id);
    }
  }
}
</script>

<template>
  <div class="recipe-card">
    <div class="card-header">
      <h3 class="recipe-title">{{ recipe.name }}</h3>
    </div>
    <div class="card-body">
      <p class="recipe-description">{{ truncateDescription(recipe.description) }}</p>
      <div class="nutrition-info">
        <div class="nutrition-item">
          <span class="label">{{ $t('recipeCard.calories') }}</span>
          <span class="value">{{ recipe.totalNutrients?.calories ?? 0 }}</span>
        </div>
        <div class="nutrition-items">
          <div class="nutrition-item">
            <span class="label">{{ $t('recipeCard.carbs') }}</span>
            <span class="value">{{ recipe.totalNutrients?.carbohydrates ?? 0 }}g</span>
          </div>
          <div class="nutrition-item">
            <span class="label">{{ $t('recipeCard.proteins') }}</span>
            <span class="value">{{ recipe.totalNutrients?.proteins ?? 0 }}g</span>
          </div>
          <div class="nutrition-item">
            <span class="label">{{ $t('recipeCard.fats') }}</span>
            <span class="value">{{ recipe.totalNutrients?.fats ?? 0 }}g</span>
          </div>
        </div>
      </div>

    </div>
    <div class="card-footer">
      <button @click="viewDetails" class="btn btn-primary">{{ $t('common.viewDetails') }}</button>
      <button @click="editRecipe" class="btn btn-secondary">{{ $t('common.edit') }}</button>
    </div>
  </div>
</template>

<style scoped>
.recipe-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  background: white;
  margin-bottom: 20px;
}

.recipe-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.card-header {
  padding: 15px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.recipe-title {
  margin: 0;
  font-size: 1.25rem;
  color: #333;
}

.card-body {
  padding: 15px;
}

.recipe-description {
  color: #666;
  margin-bottom: 15px;
}

.nutrition-info {
  margin-top: 15px;
}

.nutrition-items {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.nutrition-item {
  margin-bottom: 5px;
}

.label {
  font-weight: bold;
  margin-right: 5px;
  color: #555;
}

.value {
  color: #333;
}

.card-footer {
  padding: 15px;
  background-color: #f8f9fa;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;
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