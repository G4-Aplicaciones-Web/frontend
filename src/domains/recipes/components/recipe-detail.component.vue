<script>
import {Recipe} from "@/domains/recipes/models/recipe.entity.js";

export default {
  name: 'recipe-detail',
  props: {
    recipe: {
      type: Recipe,
      required: true
    }
  },
  data() {
    return {
      showDeleteModal: false
    };
  },
  methods: {
    editRecipe() {
      this.$emit('edit', this.recipe.id);
    },
    confirmDelete() {
      this.showDeleteModal = true;
    },
    closeModal() {
      this.showDeleteModal = false;
    },
    deleteRecipe() {
      this.$emit('delete', this.recipe.id);
      this.closeModal();
    }
  }
}
</script>

<template>
  <div class="recipe-detail" v-if="recipe">
    <div class="detail-header">
      <h2>{{ recipe.title }}</h2>
      <div class="action-buttons">
        <button @click="editRecipe" class="btn btn-primary">Editar</button>
        <button @click="confirmDelete" class="btn btn-danger">Eliminar</button>
      </div>
    </div>

    <div class="nutrition-summary">
      <div class="nutrition-card">
        <div class="nutrition-value">{{ recipe.total_calories }}</div>
        <div class="nutrition-label">Calorías</div>
      </div>
      <div class="nutrition-card">
        <div class="nutrition-value">{{ recipe.total_carbs }}g</div>
        <div class="nutrition-label">Carbohidratos</div>
      </div>
      <div class="nutrition-card">
        <div class="nutrition-value">{{ recipe.total_proteins }}g</div>
        <div class="nutrition-label">Proteínas</div>
      </div>
      <div class="nutrition-card">
        <div class="nutrition-value">{{ recipe.total_fats }}g</div>
        <div class="nutrition-label">Grasas</div>
      </div>
    </div>

    <div class="description-section">
      <h3>Descripción</h3>
      <div class="description-content">
        {{ recipe.description }}
      </div>
    </div>

    <div class="modal" v-if="showDeleteModal">
      <div class="modal-content">
        <h3>Confirmar eliminación</h3>
        <p>¿Estás seguro de que deseas eliminar esta receta? Esta acción no se puede deshacer.</p>
        <div class="modal-actions">
          <button @click="closeModal" class="btn btn-secondary">Cancelar</button>
          <button @click="deleteRecipe" class="btn btn-danger">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loading">
    <p>Cargando receta...</p>
  </div>
</template>

<style scoped>
.recipe-detail {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 25px;
  max-width: 900px;
  margin: 0 auto;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

.detail-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.8rem;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.nutrition-summary {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 30px;
}

.nutrition-card {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  flex: 1;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.nutrition-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.12);
}

.nutrition-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #4CAF50;
  margin-bottom: 5px;
}

.nutrition-label {
  color: #666;
  font-size: 0.9rem;
}

.description-section {
  margin-top: 20px;
}

.description-section h3 {
  color: #333;
  font-size: 1.3rem;
  margin-bottom: 10px;
}

.description-content {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  line-height: 1.6;
  white-space: pre-wrap;
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

.btn-danger {
  background-color: #f44336;
  color: white;
}

.btn-danger:hover {
  background-color: #d32f2f;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 25px;
  border-radius: 8px;
  max-width: 450px;
  width: 100%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.modal-content h3 {
  margin-top: 0;
  color: #333;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}
</style>