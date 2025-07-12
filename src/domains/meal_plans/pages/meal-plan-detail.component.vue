<template>
  <div class="p-6 max-w-3xl mx-auto">
    <MealPlanDays v-if="mealPlanId" :mealPlanId="mealPlanId" />
    
    <!-- Búsqueda de meal plan -->
    <MealPlanSearch />
    
    <!-- Formulario de meal plan -->
    <MealPlanForm :edit-data="editingPlan" @updated="handleMealPlanUpdated" />
    
    <!-- Lista de meal plans existentes -->
    <div class="meal-plans-section">
      <h3>Planes Existentes</h3>
      <div v-if="loading" class="loading">Cargando planes...</div>
      <div v-else-if="mealPlans.length === 0" class="empty-state">
        No hay planes de comida guardados
      </div>
      <div v-else class="plans-list">
        <div v-for="plan in mealPlans" :key="plan.id" class="plan-item">
          <div class="plan-info">
            <h4>Plan #{{ plan.id }}</h4>
            <p><strong>Perfil:</strong> {{ plan.profileId }}</p>
            <p><strong>Puntuación:</strong> {{ plan.score }}</p>
            <p><strong>Resumen:</strong> {{ plan.summary }}</p>
          </div>
          <div class="plan-actions">
            <pv-button 
              icon="pi pi-pencil" 
              size="small" 
              outlined
              @click="editPlan(plan)"
              title="Editar plan"
            />
            <pv-button 
              icon="pi pi-trash" 
              size="small" 
              severity="danger"
              outlined
              @click="deletePlan(plan)"
              title="Eliminar plan"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import MealPlanDays from '../components/meal-plan-day.component.vue';
import MealPlanSearch from '../components/meal-plan-search.component.vue';
import MealPlanForm from '../components/meal-plan-form.component.vue';
import { MealPlanService } from '../services/meal-plan.service';
import axios from 'axios';

const route = useRoute();
const mealPlanId = 1;
const mealPlan = ref(null);
const mealPlans = ref([]);
const loading = ref(false);
const editingPlan = ref(null);
const mealPlanService = new MealPlanService();

const fetchMealPlan = async () => {
  const res = await axios.get(`https://alimentate-plus-api.onrender.com/meal_plans/${mealPlanId.value}`);
  mealPlan.value = res.data;
};

const loadMealPlans = async () => {
  loading.value = true;
  try {
    const response = await mealPlanService.getAllMealPlans();
    mealPlans.value = response.data;
  } catch (error) {
    console.error('Error loading meal plans:', error);
  } finally {
    loading.value = false;
  }
};

const editPlan = (plan) => {
  editingPlan.value = { ...plan };
};

const deletePlan = async (plan) => {
  if (confirm(`¿Estás seguro de eliminar el Plan #${plan.id}?`)) {
    try {
      await mealPlanService.deleteMealPlan(plan.id);
      console.log('Plan eliminado con ID:', plan.id);
      loadMealPlans();
    } catch (error) {
      console.error('Error al eliminar plan:', error);
    }
  }
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const handleMealPlanUpdated = () => {
  fetchMealPlan();
  loadMealPlans();
  editingPlan.value = null;
};

onMounted(() => {
  fetchMealPlan();
  loadMealPlans();
});
</script>

<style scoped>
.meal-plans-section {
  margin-top: 2rem;
  background: var(--background-color);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--card-shadow);
}

.meal-plans-section h3 {
  color: var(--text-color);
  margin: 0 0 1.5rem 0;
  font-weight: 600;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.meal-plans-section h3::before {
  content: '📋';
  font-size: 1.2rem;
}

.loading, .empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--text-color-light);
  font-style: italic;
}

.plans-list {
  display: grid;
  gap: 1rem;
}

.plan-item {
  background: var(--background-color-alt);
  border: 2px solid var(--border-color);
  border-radius: 10px;
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.plan-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--primary-color);
  transition: width 0.3s ease;
}

.plan-item:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 182, 99, 0.15);
}

.plan-item:hover::before {
  width: 6px;
}

.plan-info {
  flex: 1;
  padding-left: 0.75rem;
}

.plan-info h4 {
  margin: 0 0 0.75rem 0;
  color: var(--primary-color);
  font-weight: 600;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.plan-info h4::before {
  content: '🍽️';
  font-size: 1rem;
}

.plan-info p {
  margin: 0.5rem 0;
  color: var(--text-color);
  font-size: 0.9rem;
  line-height: 1.4;
}

.plan-info strong {
  color: var(--text-color);
  font-weight: 500;
}

.plan-actions {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
}

.plan-actions .p-button {
  border-radius: 8px !important;
  transition: all 0.2s ease !important;
}

.plan-actions .p-button:hover {
  background: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
  color: white !important;
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .plan-item {
    flex-direction: column;
    gap: 1rem;
  }
  
  .plan-actions {
    align-self: stretch;
    justify-content: flex-end;
  }
  
  .meal-plans-section {
    padding: 1rem;
  }
}
</style>