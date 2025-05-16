<script>
/**
 * Import the base create-and-edit component to extend its functionality
 */
import CreateAndEdit from "../../shared/components/create-and-edit.component.vue";

/**
 * @component
 * @description A specialized dialog component for creating and editing Category entities.
 * This component wraps the generic create-and-edit component and adds category-specific
 * UI elements and validation.
 */
export default {
  name: "tracking-item-create-and-edit-dialog",
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
    getNextTrackingId() {
      return Math.floor(Math.random() * 1000000); // Simulación de ID
    },

    onCancelRequested() {
      this.$emit('cancel-requested');
    },

    onSaveRequested() {
      this.submitted = true;

      const now = new Date();

      if (!this.item.id) {
        this.item.id = this.getNextTrackingId(); // solo si no tiene ID
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
      entity-name="Tracking"
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
                  id="time_of_day"
                  v-model="item.time_of_day"
                  placeholder="Ej: Desayuno, Almuerzo, Cena"
              />
              <label for="time_of_day">Momento del día</label>
            </pv-float-label>
          </div>

          <!-- Quantity -->
          <div class="field col-12 md:col-6">
            <pv-float-label>
              <pv-input-number
                  id="quantity"
                  v-model="item.quantity"
                  :min="0"
                  :step="0.1"
                  mode="decimal"
                  placeholder="Cantidad consumida"
              />
              <label for="quantity">Cantidad (porciones / gramos)</label>
            </pv-float-label>
          </div>

          <!-- Calories -->
          <div class="field col-12 md:col-6">
            <pv-float-label>
              <pv-input-number
                  id="calories"
                  v-model="item.calories"
                  :min="0"
                  :step="1"
                  placeholder="Total de calorías"
              />
              <label for="calories">Calorías</label>
            </pv-float-label>
          </div>

          <!-- Recipe ID -->
          <div class="field col-12 md:col-6">
            <pv-float-label>
              <pv-input-number
                  id="recipe_id"
                  v-model="item.recipe_id"
                  :min="0"
                  placeholder="ID de la receta (si aplica)"
              />
              <label for="recipe_id">ID de Receta</label>
            </pv-float-label>
          </div>

          <!-- Notes -->
          <div class="field col-12">
            <pv-float-label>
              <pv-input-textarea
                  id="notes"
                  v-model="item.notes"
                  autoResize
                  rows="3"
                  placeholder="Observaciones o comentarios adicionales"
              />
              <label for="notes">Notas</label>
            </pv-float-label>
          </div>

        </div>
      </div>
    </template>
  </create-and-edit>
</template>




<style scoped>

</style>