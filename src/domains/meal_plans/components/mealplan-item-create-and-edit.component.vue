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
        <div class="grid formgrid">

          <!-- Time of Day -->
          <div class="field col-12 md:col-6">
            <pv-float-label>
              <pv-input-text
                  id="description"
                  v-model="item.description"
                  placeholder="Ej:Plan Keto"
              />
              <label for="description">Descripción</label>
            </pv-float-label>
          </div>

          <!-- Quantity -->
          <div class="field col-12 md:col-6">
            <pv-float-label>
              <pv-input-number
                  id="total_calories"
                  v-model="item.total_calories"
                  :min="0"
                  :step="0.1"
                  mode="decimal"
                  placeholder="Calorias totales"
              />
              <label for="total_calories">Cantidad </label>
            </pv-float-label>
          </div>

          <!-- Calories -->
          <div class="field col-12 md:col-6">
            <pv-float-label>
              <pv-input-number
                  id="total_carbs"
                  v-model="item.total_carbs"
                  :min="0"
                  :step="1"
                  placeholder="Total de carbohidratos"
              />
              <label for="total_carbs">Carbohidratos</label>
            </pv-float-label>
          </div>

          <!-- Recipe ID -->
          <div class="field col-12 md:col-6">
            <pv-float-label>
              <pv-input-number
                  id="profile_id"
                  v-model="item.profile_id"
                  :min="0"
                  placeholder="ID del perfil (si aplica)"
              />
              <label for="profile_id">ID de Perfil</label>
            </pv-float-label>
          </div>


        </div>
      </div>
    </template>
  </create-and-edit>
</template>

<style scoped>

</style>