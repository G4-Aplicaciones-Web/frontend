<template>
  <div class="meal-form-container">
    <div class="form-header">
      <i class="pi pi-plus-circle"></i>
      <h3>{{ form.id ? $t('meal_plan_day.form.edit_meal') : $t('meal_plan_day.form.add_meal') }}</h3>
    </div>
    
    <form @submit.prevent="submit" class="meal-form">
      <div class="form-grid">
        <div class="form-field">
          <label for="recipe_id" class="field-label">
            <i class="pi pi-book"></i> {{ $t('meal_plan_day.form.recipe_id') }}
          </label>
          <pv-input-number
            id="recipe_id"
            v-model="form.recipe_id"
            :min="1"
            placeholder="123"
            :class="{'p-invalid': submitted && !form.recipe_id}"
            class="styled-input"
          />
          <small v-if="submitted && !form.recipe_id" class="p-error">
            {{ $t('meal_plan_day.form.recipe_required') }}
          </small>
        </div>

        <div class="form-field">
          <label for="day_number" class="field-label">
            <i class="pi pi-calendar"></i> {{ $t('meal_plan_day.form.day_number') }}
          </label>
          <pv-input-number
            id="day_number"
            v-model="form.day_number"
            :min="1"
            :max="30"
            placeholder="1"
            :class="{'p-invalid': submitted && !form.day_number}"
            class="styled-input"
          />
          <small v-if="submitted && !form.day_number" class="p-error">
            {{ $t('meal_plan_day.form.day_required') }}
          </small>
        </div>

        <div class="form-field full-width">
          <label for="meal_type" class="field-label">
            <i class="pi pi-clock"></i> {{ $t('meal_plan_day.form.meal_type') }}
          </label>
          <pv-select
            id="meal_type"
            v-model="form.meal_plan_type_id"
            :options="mealTypes"
            option-label="label"
            option-value="value"
            :placeholder="$t('meal_plan_day.form.select_meal_type')"
            :class="{'p-invalid': submitted && !form.meal_plan_type_id}"
            class="styled-input"
          />
          <small v-if="submitted && !form.meal_plan_type_id" class="p-error">
            {{ $t('meal_plan_day.form.meal_type_required') }}
          </small>
        </div>
      </div>

      <div class="form-actions">
        <pv-button
          type="button"
          :label="$t('meal_plan_day.form.cancel')"
          severity="secondary"
          outlined
          @click="reset"
          class="cancel-btn"
        />
        <pv-button
          type="submit"
          :label="form.id ? $t('meal_plan_day.form.update') : $t('meal_plan_day.form.create')"
          :icon="form.id ? 'pi pi-check' : 'pi pi-plus'"
          class="submit-btn"
        />
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, watch, ref } from 'vue';
import { createMeal, updateMeal } from '../services/meal-plan-day.service';

const emit = defineEmits(['updated']);
const props = defineProps({
  editData: Object,
  mealPlanId: Number
});

const submitted = ref(false);

import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const mealTypes = [
  { label: t('meal_plan_day.form.breakfast'), value: 1 },
  { label: t('meal_plan_day.form.lunch'), value: 2 },
  { label: t('meal_plan_day.form.dinner'), value: 3 }
];

const form = reactive({
  id: null,
  recipe_id: '',
  meal_plan_type_id: '',
  day_number: ''
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
    recipe_id: '',
    meal_plan_type_id: '',
    day_number: ''
  });
  submitted.value = false;
};

const submit = async () => {
  submitted.value = true;
  
  if (!form.recipe_id || !form.day_number || !form.meal_plan_type_id) {
    return;
  }

  try {
    const payload = { ...form, meal_plan_id: props.mealPlanId };
    form.id ? await updateMeal(payload) : await createMeal(payload);
    reset();
    emit('updated');
  } catch (error) {
    console.error('Error al guardar:', error);
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