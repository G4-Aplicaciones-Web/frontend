<template>
  <div class="search-container">
    <div class="search-header">
      <i class="pi pi-search"></i>
      <h3>{{ $t('meal_plan.search.title') }}</h3>
    </div>
    
    <div class="search-form">
      <div class="search-field">
        <label for="mealPlanId" class="field-label">
          <i class="pi pi-hashtag"></i> {{ $t('meal_plan.search.meal_plan_id') }}
        </label>
        <div class="search-input-group">
          <pv-input-number
            id="mealPlanId"
            v-model="searchId"
            :min="1"
            placeholder="3"
            class="styled-input"
          />
          <pv-button
            :label="$t('meal_plan.search.search')"
            icon="pi pi-search"
            @click="searchMealPlan"
            :loading="loading"
            class="search-btn"
          />
        </div>
      </div>
    </div>

    <div v-if="mealPlan" class="meal-plan-result">
      <div class="result-header">
        <i class="pi pi-check-circle"></i>
        <h4>{{ $t('meal_plan.search.found') }}</h4>
      </div>
      <div class="meal-plan-card">
        <div class="meal-plan-info">
          <div class="info-item">
            <span class="label">ID:</span>
            <span class="value">{{ mealPlan.id }}</span>
          </div>
          <div class="info-item">
            <span class="label">{{ $t('meal_plan.search.profile_id') }}:</span>
            <span class="value">{{ mealPlan.profileId }}</span>
          </div>
          <div class="info-item">
            <span class="label">{{ $t('meal_plan.search.score') }}:</span>
            <span class="value">{{ mealPlan.score }}</span>
          </div>
          <div class="info-item full-width">
            <span class="label">{{ $t('meal_plan.search.summary') }}:</span>
            <p class="summary">{{ mealPlan.summary }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="error" class="error-message">
      <i class="pi pi-exclamation-triangle"></i>
      <span>{{ error }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { MealPlanService } from '../services/meal-plan.service';

const mealPlanService = new MealPlanService();

const searchId = ref(null);
const mealPlan = ref(null);
const loading = ref(false);
const error = ref('');

const searchMealPlan = async () => {
  if (!searchId.value) {
    error.value = 'Por favor ingresa un ID válido';
    return;
  }

  loading.value = true;
  error.value = '';
  mealPlan.value = null;

  try {
    const response = await mealPlanService.getByMealPlanId(searchId.value);
    console.log('Backend response:', response.data);
    mealPlan.value = response.data;
  } catch (err) {
    if (err.response?.status === 404) {
      error.value = `No se encontró un plan con ID ${searchId.value}`;
    } else {
      error.value = 'Error al buscar el plan de comidas';
    }
    console.error('Error:', err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.search-container {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 24px;
}

.search-header {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-header i {
  font-size: 1.2rem;
}

.search-header h3 {
  margin: 0;
  font-weight: 600;
  font-size: 1.1rem;
}

.search-form {
  padding: 20px;
}

.search-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
}

.field-label i {
  color: #6b7280;
  font-size: 0.85rem;
}

.search-input-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

.styled-input {
  flex: 1;
  border-radius: 8px !important;
  border: 2px solid #e5e7eb !important;
  padding: 10px 12px !important;
  font-size: 0.9rem !important;
  transition: all 0.2s ease !important;
}

.styled-input:focus {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
}

.search-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
  border-color: #3b82f6 !important;
  padding: 10px 16px !important;
  font-size: 0.9rem !important;
}

.search-btn:hover {
  background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%) !important;
  border-color: #1d4ed8 !important;
}

.meal-plan-result {
  margin-top: 20px;
  padding: 0 20px 20px;
}

.result-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #059669;
  margin-bottom: 12px;
}

.result-header i {
  font-size: 1.1rem;
}

.result-header h4 {
  margin: 0;
  font-weight: 600;
}

.meal-plan-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
}

.meal-plan-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.label {
  font-weight: 600;
  color: #374151;
  font-size: 0.85rem;
}

.value {
  color: #1f2937;
  font-size: 0.9rem;
}

.summary {
  color: #1f2937;
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.4;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #dc2626;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 12px 16px;
  margin: 20px;
  font-size: 0.9rem;
}

.error-message i {
  font-size: 1rem;
}

@media (max-width: 768px) {
  .search-input-group {
    flex-direction: column;
    align-items: stretch;
  }
  
  .meal-plan-info {
    grid-template-columns: 1fr;
  }
  
  .search-header {
    padding: 12px 16px;
  }
  
  .search-form {
    padding: 16px;
  }
}
</style>