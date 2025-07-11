<template>
  <div class="meal-form-container">
    <div class="form-header">
      <i class="pi pi-plus-circle"></i>
      <h3>{{ form.id ? $t('meal_plan.form.edit_plan') : $t('meal_plan.form.add_plan') }}</h3>
    </div>
    
    <form @submit.prevent="submit" class="meal-form">
      <div class="form-grid">
        <div class="form-field">
          <label for="profileId" class="field-label">
            <i class="pi pi-user"></i> {{ $t('meal_plan.form.profile_id') }}
          </label>
          <pv-input-number
            id="profileId"
            v-model="form.profileId"
            :min="1"
            placeholder="123"
            :class="{'p-invalid': submitted && !form.profileId}"
            class="styled-input"
          />
          <small v-if="submitted && !form.profileId" class="p-error">
            {{ $t('meal_plan.form.profile_required') }}
          </small>
        </div>

        <div class="form-field">
          <label for="score" class="field-label">
            <i class="pi pi-star"></i> {{ $t('meal_plan.form.score') }}
          </label>
          <pv-input-number
            id="score"
            v-model="form.score"
            :min="0"
            :max="100"
            :step="0.1"
            placeholder="85.5"
            class="styled-input"
          />
        </div>

        <div class="form-field full-width">
          <label for="summary" class="field-label">
            <i class="pi pi-file-text"></i> {{ $t('meal_plan.form.summary') }}
          </label>
          <pv-textarea
            id="summary"
            v-model="form.summary"
            :placeholder="$t('meal_plan.form.summary_placeholder')"
            :class="{'p-invalid': submitted && !form.summary}"
            class="styled-input"
            rows="4"
          />
          <small v-if="submitted && !form.summary" class="p-error">
            {{ $t('meal_plan.form.summary_required') }}
          </small>
        </div>
      </div>

      <div class="form-actions">
        <pv-button
          type="button"
          :label="$t('meal_plan.form.cancel')"
          severity="secondary"
          outlined
          @click="reset"
          class="cancel-btn"
        />
        <pv-button
          type="submit"
          :label="form.id ? $t('meal_plan.form.update') : $t('meal_plan.form.create')"
          :icon="form.id ? 'pi pi-check' : 'pi pi-plus'"
          class="submit-btn"
        />
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, watch, ref } from 'vue';
import { MealPlanService } from '../services/meal-plan.service';
import { MealPlan } from '../models/meal-plan.entity';

const emit = defineEmits(['updated']);
const props = defineProps({
  editData: Object
});

const submitted = ref(false);
const mealPlanService = new MealPlanService();

const form = reactive({
  id: null,
  profileId: 0,
  summary: '',
  score: 0
});

watch(() => props.editData, (val) => {
  if (val) {
    Object.assign(form, val);
    submitted.value = false;
  }
});

const reset = () => {
  Object.assign(form, {
    id: null,
    profileId: 0,
    summary: '',
    score: 0
  });
  submitted.value = false;
};

const submit = async () => {
  submitted.value = true;
  
  if (!form.profileId || !form.summary) {
    return;
  }

  // Crear instancia de MealPlan
  const mealPlan = new MealPlan({
    profile_id: form.profileId,
    summary: form.summary,
    score: form.score
  });
  
  console.log('MealPlan entity:', mealPlan);
  console.log('Tipo de profile_id:', typeof mealPlan.profileId);
  
  try {
    const response = await mealPlanService.create(mealPlan);
    console.log('Respuesta del servidor:', response.data);
    reset();
    emit('updated');
  } catch (error) {
    console.error('Error al guardar:', error);
    console.error('Response data:', error.response?.data);
    console.error('Validation errors:', error.response?.data?.errors);
  }
};
</script>

<style scoped>
.meal-form-container {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 24px;
}

.form-header {
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  color: white;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-header i {
  font-size: 1.2rem;
}

.form-header h3 {
  margin: 0;
  font-weight: 600;
  font-size: 1.1rem;
}

.meal-form {
  padding: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-field.full-width {
  grid-column: 1 / -1;
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

.styled-input {
  border-radius: 8px !important;
  border: 2px solid #e5e7eb !important;
  padding: 10px 12px !important;
  font-size: 0.9rem !important;
  transition: all 0.2s ease !important;
}

.styled-input:focus {
  border-color: #4ade80 !important;
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.1) !important;
}

.styled-input.p-invalid {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
}

.p-error {
  color: #ef4444;
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.p-error::before {
  content: '⚠';
  font-size: 0.85rem;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.cancel-btn {
  padding: 8px 16px !important;
  font-size: 0.9rem !important;
}

.submit-btn {
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%) !important;
  border-color: #4ade80 !important;
  padding: 8px 16px !important;
  font-size: 0.9rem !important;
}

.submit-btn:hover {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%) !important;
  border-color: #22c55e !important;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .form-header {
    padding: 12px 16px;
  }
  
  .meal-form {
    padding: 16px;
  }
}
</style>