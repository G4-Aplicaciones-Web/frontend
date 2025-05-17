<script>
import {Recipe} from "@/domains/recipes/models/recipe.entity.js";

export default {
  name: 'recipe-form',
  props: {
    recipe: {
      type: Recipe,
      required: true
    },
    isEditing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        id: 0,
        title: '',
        description: '',
        total_calories: 0,
        total_carbs: 0,
        total_proteins: 0,
        total_fats: 0
      }
    };
  },
  created() {
    // Clone the recipe object to avoid modifying the original
    this.formData = { ...this.recipe };
  },
  watch: {
    recipe: {
      handler(newRecipe) {
        this.formData = { ...newRecipe };
      },
      deep: true
    }
  },
  methods: {
    submitForm() {
      // Validate form data
      if (!this.formData.title || !this.formData.description) {
        alert('Por favor, completa todos los campos requeridos.');
        return;
      }

      // Ensure all numeric fields are numbers and not strings
      const recipeData = {
        ...this.formData,
        total_calories: Number(this.formData.total_calories),
        total_carbs: Number(this.formData.total_carbs),
        total_proteins: Number(this.formData.total_proteins),
        total_fats: Number(this.formData.total_fats)
      };

      // Emit the event with the recipe data
      this.$emit('submit', recipeData);
    },
    cancel() {
      this.$emit('cancel');
    }
  }
}
</script>

<template>
  <div class="recipe-form">
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="title">{{ $t('recipeForm.title') }}</label>
        <input
            type="text"
            id="title"
            v-model="formData.title"
            class="form-control"
            required
        />
      </div>

      <div class="form-group">
        <label for="description">{{ $t('recipeForm.description') }}</label>
        <textarea
            id="description"
            v-model="formData.description"
            class="form-control"
            rows="5"
            required
        ></textarea>
      </div>

      <div class="nutrition-section">
        <h3>{{ $t('recipeForm.nutritionInfo') }}</h3>

        <div class="form-group">
          <label for="total_calories">{{ $t('recipeForm.totalCalories') }}</label>
          <input
              type="number"
              id="total_calories"
              v-model.number="formData.total_calories"
              class="form-control"
              min="0"
              required
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="total_carbs">{{ $t('recipeForm.carbs') }}</label>
            <input
                type="number"
                id="total_carbs"
                v-model.number="formData.total_carbs"
                class="form-control"
                min="0"
                required
            />
          </div>

          <div class="form-group">
            <label for="total_proteins">{{ $t('recipeForm.proteins') }}</label>
            <input
                type="number"
                id="total_proteins"
                v-model.number="formData.total_proteins"
                class="form-control"
                min="0"
                required
            />
          </div>

          <div class="form-group">
            <label for="total_fats">{{ $t('recipeForm.fats') }}</label>
            <input
                type="number"
                id="total_fats"
                v-model.number="formData.total_fats"
                class="form-control"
                min="0"
                required
            />
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" class="btn btn-secondary" @click="cancel">
          {{ $t('common.cancel') }}
        </button>
        <button type="submit" class="btn btn-primary">
          {{ isEditing ? $t('common.update') : $t('common.create') }}
        </button>
      </div>
    </form>
  </div>
</template>


<style scoped>
.recipe-form {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  max-width: 800px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-row .form-group {
  flex: 1;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-control:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.25);
}

input[type="number"] {
  text-align: right;
}

.nutrition-section {
  background-color: #f0f8f0;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.nutrition-section h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #2e7d32;
  font-size: 1.2rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
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