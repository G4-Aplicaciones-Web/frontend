<script>
import CreateAndEdit from "@/shared/components/create-and-edit.component.vue";
import {CreateMealPlanEntryRequest} from "@/domains/tracking/model/meal-plan-entry-request.entity.js";


export default {
  name: "tracking-create-and-edit-dialog",
  components: { CreateAndEdit },

  props: {
    tracking: {
      type: Object,
      required: true
    },
    editingMealEntry: {
      type: Object,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    }
  },

  emits: ['meal-plan-entry-added', 'meal-plan-entry-updated', 'edit-canceled'],

  data() {
    return {
      mealEntryData: new CreateMealPlanEntryRequest(),
      mealTypes: [
        { label: 'Desayuno', value: 'Breakfast' },
        { label: 'Almuerzo', value: 'Lunch' },
        { label: 'Cena', value: 'Dinner' },
        { label: 'Snack', value: 'SNACK' }
      ],
      submitted: false
    };
  },

  watch: {
    editingMealEntry: {
      handler(newEntry) {
        if (newEntry) {
          this.mealEntryData = {
            userId: newEntry.userId ?? 0,
            recipeId: newEntry.recipeId ?? 0,
            mealPlanType: newEntry.mealType,
            dayNumber: newEntry.dayNumber ?? 0
          };
        } else {
          this.resetForm();
        }
      },
      immediate: true
    },

    visible(newVal) {
      if (newVal) {
        this.submitted = false;
      }
    }
  },

  methods: {
    resetForm() {
      this.mealEntryData = new CreateMealPlanEntryRequest({ userId: this.tracking.userId });
      this.submitted = false;
    },

    onSubmitMealEntry() {
      this.submitted = true;
      if (!this.isFormValid()) {
        return;
      }

      if (this.editingMealEntry) {
        // Para actualización, solo enviar los campos que puede actualizar el backend
        const updateData = {
          recipeId: this.mealEntryData.recipeId,
          mealPlanType: this.mealEntryData.mealPlanType,
          dayNumber: this.mealEntryData.dayNumber
        };

        this.$emit('meal-plan-entry-updated', {
          entryId: this.editingMealEntry.id,
          entry: updateData
        });
      } else {
        // Para creación, mantener la estructura original
        this.$emit('meal-plan-entry-added', {
          trackingId: this.tracking.id,
          entry: this.mealEntryData
        });
      }
      this.resetForm();
    },

    onCancelMealEntry() {
      this.$emit('edit-canceled');
      this.resetForm();
    },

    isFormValid() {
      const { recipeId, mealPlanType, dayNumber } = this.mealEntryData;

      if (this.editingMealEntry) {
        // Para actualización, no validar userId (no se necesita)
        return recipeId && mealPlanType && dayNumber >= 0;
      } else {
        // Para creación, validar userId
        return this.mealEntryData.userId && recipeId && mealPlanType && dayNumber >= 0;
      }
    }
  }
};
</script>

<template>
  <pv-dialog
      :visible="visible"
      :modal="true"
      :header="editingMealEntry ? 'Editar Entrada de Comida' : 'Crear Nueva Entrada de Comida'"
      :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      @hide="onCancelMealEntry"
  >
    <div class="meal-entry-form">
      <div class="form-grid">

        <!-- Solo mostrar campo userId cuando NO estamos editando -->
        <div v-if="!editingMealEntry" class="field">
          <pv-float-label>
            <pv-input-number
                id="userId"
                v-model="mealEntryData.userId"
                :min="1"
                :class="{ 'p-invalid': submitted && !mealEntryData.userId }"
                class="w-full"
            />
            <label for="userId">ID de Usuario *</label>
          </pv-float-label>
          <small v-if="submitted && !mealEntryData.userId" class="p-error">
            El ID de usuario es requerido
          </small>
        </div>

        <div class="field">
          <pv-float-label>
            <pv-input-number
                id="recipeId"
                v-model="mealEntryData.recipeId"
                :min="1"
                :class="{ 'p-invalid': submitted && !mealEntryData.recipeId }"
                class="w-full"
            />
            <label for="recipeId">ID de Receta *</label>
          </pv-float-label>
          <small v-if="submitted && !mealEntryData.recipeId" class="p-error">
            El ID de receta es requerido
          </small>
        </div>

        <div class="field">
          <pv-float-label>
            <pv-select
                id="mealType"
                v-model="mealEntryData.mealPlanType"
                :options="mealTypes"
                optionLabel="label"
                optionValue="value"
                :class="{ 'p-invalid': submitted && !mealEntryData.mealPlanType }"
                class="w-full"
            />
            <label for="mealType">Tipo de Comida *</label>
          </pv-float-label>
          <small v-if="submitted && !mealEntryData.mealPlanType" class="p-error">
            El tipo de comida es requerido
          </small>
        </div>

        <div class="field">
          <pv-float-label>
            <pv-input-number
                id="dayNumber"
                v-model="mealEntryData.dayNumber"
                :min="0"
                :class="{ 'p-invalid': submitted && mealEntryData.dayNumber < 0 }"
                class="w-full"
            />
            <label for="dayNumber">Número de Día *</label>
          </pv-float-label>
          <small v-if="submitted && mealEntryData.dayNumber < 0" class="p-error">
            El número de día es inválido
          </small>
        </div>

      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <pv-button
            label="Cancelar"
            icon="pi pi-times"
            severity="secondary"
            @click="onCancelMealEntry"
        />
        <pv-button
            :label="editingMealEntry ? 'Actualizar' : 'Crear'"
            icon="pi pi-check"
            @click="onSubmitMealEntry"
        />
      </div>
    </template>
  </pv-dialog>
</template>

<style scoped>
.meal-entry-form {
  padding: 1rem 0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.dialog-footer {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.p-error {
  color: #e24c4c;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.p-invalid {
  border-color: #e24c4c !important;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>