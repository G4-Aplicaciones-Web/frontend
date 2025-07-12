<script>
import CreateAndEdit from "@/shared/components/create-and-edit.component.vue";
import { Select as PvSelect, SelectButton as PvSelectButton, InputText as PvInputText, Textarea as PvTextarea, InputNumber as PvInputNumber, FloatLabel as PvFloatLabel } from "primevue";

export default {
  name: "recommendation-item-create-and-edit-dialog",
  components: {
    PvSelectButton,
    PvSelect,
    PvInputText,
    PvTextarea,
    PvInputNumber,
    PvFloatLabel,
    CreateAndEdit
  },
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
      timeOptionsInternal: [
        { label: 'Morning', value: 'morning' },
        { label: 'Afternoon', value: 'afternoon' },
        { label: 'Evening', value: 'evening' },
        { label: 'All Day', value: 'all_day' }
      ],
      statusOptionsInternal: [
        { label: 'Pending', value: 'pending' },
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' }
      ]
    }
  },
  computed: {
    mappedTimeOfDay: {
      get() {
        const backendToFrontend = {
          0: 'morning',
          1: 'afternoon',
          2: 'evening',
          3: 'all_day',
          'Morning': 'morning',
          'Afternoon': 'afternoon',
          'Evening': 'evening',
          'AllDay': 'all_day'
        };
        return backendToFrontend[this.item.timeOfDay] || 'morning';
      },
      set(value) {
        const frontendToBackend = {
          'morning': 'Morning',
          'afternoon': 'Afternoon',
          'evening': 'Evening',
          'all_day': 'AllDay'
        };
        this.item.timeOfDay = frontendToBackend[value] || 'Morning';
      }
    },
    mappedStatus: {
      get() {
        const backendToFrontend = {
          0: 'pending',
          1: 'active',
          2: 'inactive',
          'Pending': 'pending',
          'Active': 'active',
          'Inactive': 'inactive'
        };
        return backendToFrontend[this.item.status] || 'pending';
      },
      set(value) {
        const frontendToBackend = {
          'pending': 'Pending',
          'active': 'Active',
          'inactive': 'Inactive'
        };
        this.item.status = frontendToBackend[value] || 'Pending';
      }
    }
  },
  methods: {
    onCancelRequested() {
      this.$emit('cancel-requested');
    },
    onSaveRequested() {
      this.submitted = true;
      if (this.item.reason && this.item.timeOfDay && this.item.status) {
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
              <pv-select id="time_of_day" v-model="mappedTimeOfDay"
                         :options="timeOptionsInternal" optionLabel="label" optionValue="value"
                         :class="{ 'p-invalid': submitted && !item.timeOfDay }"/>
              <label for="time_of_day">Time of Day*</label>
            </pv-float-label>
          </div>
          <div class="field col-12 md:col-6">
            <pv-float-label>
              <pv-select id="status" v-model="mappedStatus"
                         :options="statusOptionsInternal" optionLabel="label" optionValue="value"
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
  gap: 1rem;
}
</style>