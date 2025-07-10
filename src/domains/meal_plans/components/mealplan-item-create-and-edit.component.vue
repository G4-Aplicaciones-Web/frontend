<script>

import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue"

export default {
  name: "mealplan-item-create-and-edit-dialog",
  components: {CreateAndEdit},
  props: {
    /**
     * @type {Tracking|null}
     * @description The category item being created or edited
     */
    item: null,

    /**
     * @type {Boolean}
     * @description Controls the visibility of the dialog
     */
    visible: false
  },

  /**
   * @event cancel-requested - Emitted when the cancel action is triggered
   * @event save-requested - Emitted when the save action is triggered with the category item
   */
  emits: ['cancel-requested', 'save-requested'],

  /**
   * @returns {Object} Component data
   */
  data() {
    return {
      /**
       * @type {Boolean}
       * @description Tracks whether the form has been submitted for validation purposes
       */
      submitted: false
    }
  },
  methods: {
    getNextMealPLanId() {
      return Math.floor(Math.random() * 1000000); // Simulación de ID
    },

    onCancelRequested() {
      this.$emit('cancel-requested');
    },

    onSaveRequested() {
      this.submitted = true;

      const now = new Date();

      if (!this.item.id) {
        this.item.id = this.getNextMealPLanId(); // solo si no tiene ID
        this.item.date = now.toISOString().split('T')[0];
        this.item.created_at = now.toISOString().slice(0, 19) + 'Z';
      }

      this.$emit('save-requested', this.item);
    }
  }

}

</script>

<template>
  <create-and-edit
      :entity="item"
      :visible="visible"
      entity-name="Meal Plan"
      @cancel-action-requested="onCancelRequested"
      @save-action-requested="onSaveRequested"
  >
    <template #content>
      <div class="p-fluid p-4">
        <div class="form-header mb-4">
          <h4 class="text-primary mb-2">Información del Plan de Comidas</h4>
          <p class="text-sm text-500">Complete los siguientes campos para crear o editar el plan de comidas</p>
        </div>
        
        <div class="grid formgrid">
          <!-- Descripción del Plan -->
          <div class="field col-12">
            <label for="description" class="font-semibold text-900 mb-2 block">
              <i class="pi pi-file-edit mr-2"></i>Descripción del Plan *
            </label>
            <pv-input-text
                id="description"
                v-model="item.description"
                placeholder="Ej: Plan Keto para pérdida de peso, Plan Mediterráneo, etc."
                class="w-full"
            />
            <small class="text-500">Ingrese una descripción clara y descriptiva del plan de comidas</small>
          </div>

          <!-- Información Nutricional -->
          <div class="col-12">
            <h5 class="text-primary mt-4 mb-3">
              <i class="pi pi-chart-line mr-2"></i>Información Nutricional
            </h5>
          </div>

          <!-- Calorías Totales -->
          <div class="field col-12 md:col-6">
            <label for="total_calories" class="font-semibold text-900 mb-2 block">
              <i class="pi pi-bolt mr-2"></i>Calorías Totales *
            </label>
            <pv-input-number
                id="total_calories"
                v-model="item.total_calories"
                :min="0"
                :max="5000"
                :step="1"
                mode="decimal"
                placeholder="Ej: 2000"
                suffix=" kcal"
                class="w-full"
            />
            <small class="text-500">Ingrese el total de calorías del plan (0-5000 kcal)</small>
          </div>

          <!-- Carbohidratos Totales -->
          <div class="field col-12 md:col-6">
            <label for="total_carbs" class="font-semibold text-900 mb-2 block">
              <i class="pi pi-shopping-bag mr-2"></i>Carbohidratos Totales *
            </label>
            <pv-input-number
                id="total_carbs"
                v-model="item.total_carbs"
                :min="0"
                :max="1000"
                :step="1"
                placeholder="Ej: 250"
                suffix=" g"
                class="w-full"
            />
            <small class="text-500">Ingrese el total de carbohidratos en gramos (0-1000g)</small>
          </div>

          <!-- ID de Perfil -->
          <div class="field col-12 md:col-6">
            <label for="profile_id" class="font-semibold text-900 mb-2 block">
              <i class="pi pi-user mr-2"></i>ID de Perfil
            </label>
            <pv-input-number
                id="profile_id"
                v-model="item.profile_id"
                :min="1"
                placeholder="Ej: 123"
                class="w-full"
            />
            <small class="text-500">ID del perfil de usuario asociado (opcional)</small>
          </div>

        </div>
        
        <div class="form-footer mt-4 pt-3 border-top-1 surface-border">
          <small class="text-500">
            <i class="pi pi-info-circle mr-1"></i>
            Los campos marcados con (*) son obligatorios
          </small>
        </div>
      </div>
    </template>
  </create-and-edit>
</template>

<style scoped>
.form-header {
  text-align: center;
  border-bottom: 1px solid var(--surface-border);
  padding-bottom: 1rem;
}

.form-header h4 {
  margin: 0;
  color: var(--primary-color);
}

.field label {
  display: flex;
  align-items: center;
}

.field label i {
  color: var(--primary-color);
}

.field small {
  margin-top: 0.25rem;
  display: block;
}

.form-footer {
  text-align: center;
  background: var(--surface-50);
  padding: 1rem;
  border-radius: 6px;
}

.p-inputnumber {
  width: 100%;
}
</style>