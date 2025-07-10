<script>
import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";

export default {
  name: "meal-plan-entry-create-and-edit-dialog",
  components: {CreateAndEdit},
  props: {
    /**
     * @type {MealPlanEntry|null}
     * @description The meal plan entry item being created or edited
     */
    item: {
      type: Object,
      default: null
    },

    /**
     * @type {Boolean}
     * @description Controls the visibility of the dialog
     */
    visible: {
      type: Boolean,
      default: false
    },

    /**
     * @type {Boolean}
     * @description Indicates if this is an edit operation
     */
    edit: {
      type: Boolean,
      default: false
    }
  },

  emits: ['cancel-requested', 'save-requested'],

  data() {
    return {
      submitted: false,
      // Local copy of the item to avoid direct prop mutation
      localItem: {}
    }
  },

  watch: {
    // Watch for changes in the item prop and update local copy
    item: {
      handler(newItem) {
        if (newItem) {
          this.localItem = { ...newItem };
        } else {
          this.localItem = {};
        }
      },
      immediate: true,
      deep: true
    },

    // Reset submitted when dialog opens/closes
    visible(newVal) {
      if (newVal) {
        this.submitted = false;
      }
    }
  },

  methods: {
    onCancelRequested() {
      this.submitted = false;
      this.$emit('cancel-requested');
    },

    onSaveRequested() {
      this.submitted = true;

      // Validate required fields
      if (!this.isFormValid()) {
        console.log('Form is not valid');
        return;
      }

      console.log("Saving meal entry:", this.localItem);
      this.$emit('save-requested', this.localItem);
    },

    isFormValid() {
      // Check if required fields are filled
      return this.localItem.timeOfDay &&
          this.localItem.quantity &&
          this.localItem.calories;
    }
  }
}
</script>

<template>
  <create-and-edit
      :entity="localItem"
      :visible="visible"
      entity-name="Meal Entry"
      @cancel-action-requested="onCancelRequested"
      @save-action-requested="onSaveRequested"
  >
    <template #content>
      <div class="meal-entry-form">
        <div class="form-grid">
          <!-- Momento del día -->
          <div class="form-field">
            <label for="timeOfDay" class="field-label">Momento del día *</label>
            <pv-select
                id="timeOfDay"
                v-model="localItem.timeOfDay"
                :options="[
                  {label: 'Desayuno', value: 'breakfast'},
                  {label: 'Almuerzo', value: 'lunch'},
                  {label: 'Cena', value: 'dinner'},
                  {label: 'Snack', value: 'snack'}
                ]"
                optionLabel="label"
                optionValue="value"
                placeholder="Selecciona momento del día"
                class="form-input"
                :class="{ 'p-invalid': submitted && !localItem.timeOfDay }"
            />
            <small v-if="submitted && !localItem.timeOfDay" class="p-error">
              Momento del día es requerido
            </small>
          </div>

          <!-- Cantidad -->
          <div class="form-field">
            <label for="quantity" class="field-label">Cantidad (porciones / gramos) *</label>
            <pv-input-number
                id="quantity"
                v-model="localItem.quantity"
                :min="0"
                :step="0.1"
                mode="decimal"
                class="form-input"
                :class="{ 'p-invalid': submitted && !localItem.quantity }"
            />
            <small v-if="submitted && !localItem.quantity" class="p-error">
              Cantidad es requerida
            </small>
          </div>

          <!-- Calorías -->
          <div class="form-field">
            <label for="calories" class="field-label">Total de Calorías *</label>
            <pv-input-number
                id="calories"
                v-model="localItem.calories"
                :min="0"
                :step="1"
                class="form-input"
                :class="{ 'p-invalid': submitted && !localItem.calories }"
            />
            <small v-if="submitted && !localItem.calories" class="p-error">
              Calorías es requerido
            </small>
          </div>

          <!-- ID de Receta -->
          <div class="form-field">
            <label for="recipeId" class="field-label">ID de Receta</label>
            <pv-input-number
                id="recipeId"
                v-model="localItem.recipeId"
                :min="0"
                class="form-input"
            />
          </div>

          <!-- Notas - Campo completo -->
          <div class="form-field form-field-full">
            <label for="notes" class="field-label">Comentarios adicionales</label>
            <pv-textarea
                id="notes"
                v-model="localItem.notes"
                autoResize
                rows="3"
                class="form-textarea"
                placeholder="Añade comentarios o notas sobre esta entrada..."
            />
          </div>
        </div>
      </div>
    </template>
  </create-and-edit>
</template>

<style scoped>
.meal-entry-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 25px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fff8 100%);
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
}

.form-field {
  display: flex;
  flex-direction: column;
}

.form-field-full {
  grid-column: 1 / -1;
}

.field-label {
  margin-bottom: 8px;
  font-weight: 600;
  color: #2d5a2d;
  font-size: 0.95rem;
}

.form-input,
.form-textarea {
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
  background-color: #fff;
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 40px;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #63B663;
  box-shadow: 0 0 0 2px rgba(99, 182, 99, 0.25);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.form-textarea::placeholder {
  color: #999;
  font-style: italic;
}

/* Error styles */
.p-error {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 4px;
}

:deep(.p-invalid) {
  border-color: #dc3545 !important;
}

:deep(.p-invalid:focus) {
  border-color: #dc3545 !important;
  box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.25) !important;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .field-label {
    color: #e0e0e0;
  }

  .meal-entry-form {
    background: linear-gradient(135deg, #1a1a1a 0%, #0f1f0f 100%);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
  }

  .form-input,
  .form-textarea,
  .form-select {
    background-color: #1e1e1e;
    color: #fff;
    border-color: #444;
  }

  .form-select {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%9ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  }

  .form-input:focus,
  .form-textarea:focus,
  .form-select:focus {
    border-color: #63B663;
    box-shadow: 0 0 0 2px rgba(99, 182, 99, 0.25);
  }

  .form-textarea::placeholder {
    color: #888;
  }

  .form-select option {
    background-color: #1e1e1e;
    color: #fff;
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .meal-entry-form {
    padding: 20px;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

/* Custom styling for PrimeVue components */
:deep(.p-inputnumber-input) {
  width: 100%;
}

:deep(.p-textarea) {
  width: 100%;
}

/* Styling for PrimeVue Select component */
:deep(.p-select) {
  width: 100%;
}

/* Green theme styling */
:deep(.p-button-success) {
  background-color: #63B663 !important;
  border-color: #63B663 !important;
}

:deep(.p-button-success:hover) {
  background-color: #4e9a4e !important;
  border-color: #4e9a4e !important;
}

/* Focus states with green theme */
.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #63B663;
  box-shadow: 0 0 0 2px rgba(99, 182, 99, 0.25);
}

:deep(.p-select:focus) {
  border-color: #63B663 !important;
  box-shadow: 0 0 0 2px rgba(99, 182, 99, 0.25) !important;
}

:deep(.p-inputnumber:focus-within) {
  border-color: #63B663 !important;
  box-shadow: 0 0 0 2px rgba(99, 182, 99, 0.25) !important;
}

:deep(.p-textarea:focus) {
  border-color: #63B663 !important;
  box-shadow: 0 0 0 2px rgba(99, 182, 99, 0.25) !important;
}
</style>