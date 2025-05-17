<script>
/**
 * Import the base create-and-edit component to extend its functionality
 */
import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";

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
    onCancelRequested() {
      this.$emit('cancel-requested');
    },

    onSaveRequested() {
      this.submitted = true;
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
      <div class="form-container">
        <div class="grid formgrid">
          <!-- Momento del día -->
          <div class="field col-12 md:col-6">
            <pv-float-label>
              <pv-input-text
                  id="time_of_day"
                  v-model="item.time_of_day"
              />
              <label for="time_of_day">Momento del día</label>
            </pv-float-label>
          </div>

          <!-- Cantidad -->
          <div class="field col-12">
            <pv-float-label>
              <pv-input-number
                  id="quantity"
                  v-model="item.quantity"
                  :min="0"
                  :step="0.1"
                  mode="decimal"
              />
              <label for="quantity">Cantidad (porciones / gramos)</label>
            </pv-float-label>
          </div>

          <!-- Calorías -->
          <div class="field col-12 md:col-6">
            <pv-float-label>
              <pv-input-number
                  id="calories"
                  v-model="item.calories"
                  :min="0"
                  :step="1"
              />
              <label for="calories">Total de Calorías</label>
            </pv-float-label>
          </div>

          <!-- ID de Receta -->
          <div class="field col-12 md:col-6">
            <pv-float-label>
              <pv-input-number
                  id="recipe_id"
                  v-model="item.recipe_id"
                  :min="0"
              />
              <label for="recipe_id">ID de Receta</label>
            </pv-float-label>
          </div>

          <!-- Notas -->
          <div class="field col-12">
            <pv-float-label>
              <pv-textarea
                  id="notes"
                  v-model="item.notes"
                  autoResize
                  rows="3"
              />
              <label for="notes">Comentarios adicionales</label>
            </pv-float-label>
          </div>
        </div>
      </div>
    </template>
  </create-and-edit>
</template>

<style scoped>
.form-container {
  padding: 1.5rem;
}

.formgrid {
  gap: 1rem; /* Añade un espacio entre los elementos del grid */
}

.field {
  margin-bottom: 1rem; /* Reduce un poco el margen inferior entre campos */
}

.p-float-label > input,
.p-float-label > textarea {
  background-color: #1e1e1e;
  color: #fff;
  border-color: #444;
  border-radius: 6px;
  padding: 0.75rem;
}

.p-float-label > label {
  color: #aaa;
}
</style>
