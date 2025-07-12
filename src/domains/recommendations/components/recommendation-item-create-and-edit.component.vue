<script>
import CreateAndEdit from "@/shared/components/create-and-edit.component.vue";
import {Select as PvSelect, SelectButton as PvSelectButton} from "primevue";
export default {
  name: "recommendation-item-create-and-edit-dialog",
  components: {PvSelectButton, PvSelect, CreateAndEdit},
  props: {
    item: {
      type: Object,
      required: true
    },
    visible: {
      type: Boolean,
      default: false
    },
    edit: {
      type: Boolean,
      default: false
    }
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
      ]
    }
  },
  methods: {
    onCancelRequested() {
      this.$emit('cancel-requested');
    },
    onSaveRequested() {
      console.log('Item a guardar:', this.item);
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
                   :edit="edit"
                   entity-name="Recommendation"
                   size="standard"
                   @cancel-action-requested="onCancelRequested"
                   @save-action-requested="onSaveRequested">
    <template #content>
      <div class="form-container">
        <div class="grid formgrid">
          <div class="field col-12 md:col-6">
            <pv-float-label>
              <pv-input-text id="reason" v-model="item.reason"
                             :class="{ 'p-invalid': submitted && !item.reason }"/>
              <label for="reason">Reason*</label>
            </pv-float-label>
          </div>
          <div class="field col-12 md:col-6">
            <pv-float-label>
              <pv-select id="time_of_day" v-model="item.time_of_day"
                         :options="timeOptions" optionLabel="label" optionValue="value"
                         :class="{ 'p-invalid': submitted && !item.time_of_day }"/>
              <label for="time_of_day">Time of Day*</label>
            </pv-float-label>
          </div>
          <div class="field col-12 md:col-6">
            <pv-float-label>
              <pv-select id="status" v-model="item.status"
                         :options="statusOptions" optionLabel="label" optionValue="value"
                         :class="{ 'p-invalid': submitted && !item.status }"/>
              <label for="status">Status*</label>
            </pv-float-label>
          </div>
          <div class="field col-12 md:col-6">
            <pv-float-label>
              <pv-textarea id="notes" v-model="item.notes" rows="2"/>
              <label for="notes">Notes</label>
            </pv-float-label>
          </div>
          <div class="field col-12 md:col-6">
            <pv-float-label>
              <label for="score">Score (1-10)</label>
              <pv-input-number id="score" v-model="item.score"
                               mode="decimal" :min="1" :max="10"/>
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

</style>