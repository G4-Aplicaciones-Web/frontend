<script>
/**
 * Import the base create-and-edit component to extend its functionality
 */
import CreateAndEdit from "@/shared/components/create-and-edit.component.vue";

/**
 * @component
 * @description A specialized dialog component for creating and editing Recommendation entities.
 * Extends the generic create-and-edit component with recommendation-specific UI elements.
 */
export default {
  name: "recommendation-item-create-and-edit-dialog",
  components: {CreateAndEdit},
  props: {
    /**
     * @type {Recommendation|null}
     * @description The recommendation item being created or edited
     */
    item: null,

    /**
     * @type {Boolean}
     * @description Controls the visibility of the dialog
     */
    visible: false
  },

  /**
   * @event cancel-requested - Emitted when cancel action is triggered
   * @event save-requested - Emitted when save action is triggered with recommendation data
   */
  emits: ['cancel-requested', 'save-requested'],

  data() {
    return {
      /**
       * @type {Boolean}
       * @description Tracks form submission for validation
       */
      submitted: false,

      /**
       * @type {Array}
       * @description Available time of day options
       */
      timeOptions: [
        {label: 'Morning', value: 'morning'},
        {label: 'Afternoon', value: 'afternoon'},
        {label: 'Night', value: 'night'},
        {label: 'All Day', value: 'all day'}
      ],

      /**
       * @type {Array}
       * @description Available status options
       */
      statusOptions: [
        {label: 'Active', value: 'active'},
        {label: 'Pending', value: 'pending'},
        {label: 'Inactive', value: 'inactive'}
      ]
    }
  },
  methods: {
    onCancelRequested() {
      this.$emit('cancel-requested');
    },

    onSaveRequested() {
      this.submitted = true;
      if (this.item.reason && this.item.time_of_day && this.item.status) {
        this.$emit('save-requested', this.item);
      }
    }
  }
}
</script>

<template>
  <create-and-edit :entity="item"
                   :visible="visible"
                   entity-name="Recommendation"
                   size="standard"
                   @cancel-action-requested="onCancelRequested"
                   @save-action-requested="onSaveRequested">
    <template #content>
      <div class="p-fluid">
        <!-- Reason Field -->
        <div class="field mt-5">
          <pv-float-label>
            <label for="reason">Reason*</label>
            <pv-input-text id="reason" v-model="item.reason"
                           :class="{ 'p-invalid': submitted && !item.reason }"/>
          </pv-float-label>
        </div>

        <!-- Time of Day Dropdown -->
        <div class="field">
          <pv-float-label>
            <pv-dropdown id="time_of_day" v-model="item.time_of_day"
                         :options="timeOptions" optionLabel="label" optionValue="value"
                         placeholder="Select Time of Day"
                         :class="{ 'p-invalid': submitted && !item.time_of_day }"/>
            <label for="time_of_day">Time of Day*</label>
          </pv-float-label>
        </div>

        <!-- Notes Field -->
        <div class="field">
          <pv-float-label>
            <label for="notes">Notes</label>
            <pv-textarea id="notes" v-model="item.notes" rows="3"/>
          </pv-float-label>
        </div>

        <!-- Score Input -->
        <div class="field">
          <pv-float-label>
            <label for="score">Score (1-10)</label>
            <pv-input-number id="score" v-model="item.score"
                             mode="decimal" :min="1" :max="10"/>
          </pv-float-label>
        </div>

        <!-- Status Dropdown -->
        <div class="field">
          <pv-float-label>
            <pv-dropdown id="status" v-model="item.status"
                         :options="statusOptions" optionLabel="label" optionValue="value"
                         placeholder="Select Status"
                         :class="{ 'p-invalid': submitted && !item.status }"/>
            <label for="status">Status*</label>
          </pv-float-label>
        </div>
      </div>
    </template>
  </create-and-edit>
</template>

<style scoped>
/* Add custom styles if needed */
.p-invalid {
  border-color: #f44336 !important;
}
</style>