<script>
import CreateAndEdit from "@/shared/components/create-and-edit.component.vue";

export default {
  name: "recommendation-item-create-and-edit-dialog",
  components: { CreateAndEdit },
  props: {
    item: {
      type: Object,
      default: () => ({
        reason: '',
        time_of_day: '', // Cambiado a null para mejor manejo
        notes: '',
        score: 1,
        status: '' // Cambiado a null para mejor manejo
      })
    },
    visible: Boolean
  },
  emits: ['cancel-requested', 'save-requested'],

  data() {
    return {
      submitted: false,
      timeOptions: [
        {label: 'Morning', value: 'morning'},
        {label: 'Afternoon', value: 'afternoon'},
        {label: 'Night', value: 'night'},
        {label: 'All Day', value: 'all day'}
      ],
      statusOptions: [
        {label: 'Active', value: 'active'},
        {label: 'Pending', value: 'pending'},
        {label: 'Inactive', value: 'inactive'}
      ],

      localItem: {}
    }
  },

  watch: {
    item: {
      immediate: true,
      handler(newVal) {
        this.localItem = {...newVal};
      }
    }
  },

  methods: {
    onCancelRequested() {
      this.$emit('cancel-requested');
    },

    onSaveRequested() {
      this.submitted = true;
      if (this.localItem.reason && this.localItem.time_of_day && this.localItem.status) {
        this.$emit('save-requested', this.localItem);
      }
    }
  }
}
</script>

<template>
  <create-and-edit :entity="localItem"
                   :visible="visible"
                   entity-name="Recommendation"
                   size="standard"
                   @cancel-action-requested="onCancelRequested"
                   @save-action-requested="onSaveRequested">
    <template #content>
      <div class="form-container">
        <!-- Reason Field -->
        <div class="form-field">
          <pv-float-label>
            <pv-input-text id="reason" v-model="localItem.reason"
                           :class="{ 'p-invalid': submitted && !localItem.reason }"/>
            <label for="reason">Reason*</label>
          </pv-float-label>
          <small v-if="submitted && !localItem.reason" class="error-message">Reason is required</small>
        </div>

        <!-- Time of Day Dropdown -->
        <div class="form-field">
          <pv-float-label>
            <pv-dropdown id="time_of_day" v-model="localItem.time_of_day"
                         :options="timeOptions" optionLabel="label" optionValue="value"
                         placeholder="Select Time of Day"
                         :class="{ 'p-invalid': submitted && !localItem.time_of_day }"/>
            <label for="time_of_day">Time of Day*</label>
          </pv-float-label>
          <small v-if="submitted && !localItem.time_of_day" class="error-message">Time of Day is required</small>
        </div>

        <!-- Notes Field -->
        <div class="form-field">
          <pv-float-label>
            <pv-textarea id="notes" v-model="localItem.notes" rows="3" class="notes-textarea"/>
            <label for="notes">Notes</label>
          </pv-float-label>
        </div>

        <!-- Score Input -->
        <div class="form-field">
          <pv-float-label>
            <pv-input-number id="score" v-model="localItem.score"
                             mode="decimal" :min="1" :max="10" class="score-input"/>
            <label for="score">Score (1-10)</label>
          </pv-float-label>
        </div>

        <!-- Status Dropdown -->
        <div class="form-field">
          <pv-float-label>
            <pv-dropdown id="status" v-model="localItem.status"
                         :options="statusOptions" optionLabel="label" optionValue="value"
                         placeholder="Select Status"
                         :class="{ 'p-invalid': submitted && !localItem.status }"/>
            <label for="status">Status*</label>
          </pv-float-label>
          <small v-if="submitted && !localItem.status" class="error-message">Status is required</small>
        </div>
      </div>
    </template>
  </create-and-edit>
</template>

<style scoped>
/* Tus estilos existentes se mantienen igual */
.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
}

.p-float-label {
  width: 100%;
}

.p-inputtext, .p-dropdown, .p-inputnumber, .p-textarea {
  width: 100%;
}

.p-textarea {
  min-height: 100px;
  resize: vertical;
}

.p-invalid {
  border-color: #f44336 !important;
}

.error-message {
  color: #f44336;
  font-size: 0.75rem;
  position: absolute;
  bottom: -1.25rem;
}

.notes-textarea {
  min-height: 100px;
}

.score-input {
  width: 100%;
}

@media (max-width: 768px) {
  .form-container {
    padding: 0.5rem;
  }

  .form-field {
    gap: 0.25rem;
  }
}
</style>