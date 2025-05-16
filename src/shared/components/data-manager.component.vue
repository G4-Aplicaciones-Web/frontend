<script>
/**
 * Import FilterMatchMode from PrimeVue core API for data table filtering
 */
import {FilterMatchMode} from '@primevue/core/api';

/**
 * @component data-manager
 * @description A reusable data management component for displaying and managing recommendations.
 * Provides a standardized interface for displaying, filtering, and performing CRUD operations on recommendations.
 */
export default {
  name: "recommendation-data-manager",
  inheritAttrs: false,
  props: {
    /**
     * @type {Array}
     * @description Array of recommendation items to be displayed in the data table
     * @required
     */
    items: {type: Array, required: true},

    /**
     * @property {String} singular - Singular form of the entity name ('Recommendation')
     * @property {String} plural - Plural form of the entity name ('Recommendations')
     * @description Title configuration for the data manager
     * @required
     */
    title:  {type: { singular: 'Recommendation', plural: 'Recommendations'}, required: true},

    /**
     * @type {Boolean}
     * @description Whether to dynamically generate columns based on the columns prop
     * @default false
     */
    dynamic: {type: Boolean, default: false},

    /**
     * @type {Array}
     * @description Array of column definitions for dynamic columns
     * @property {String} field - Field name to bind to column
     * @property {String} header - Column header text
     * @default []
     */
    columns: {type: Array, default: []},
  },

  /**
   * @event new-item-requested - Emitted when user clicks the "New" button
   * @event edit-item-requested - Emitted when user clicks the edit button for a recommendation
   * @event delete-item-requested - Emitted when user confirms deletion of a single recommendation
   * @event delete-selected-items-requested - Emitted when user confirms deletion of selected recommendations
   */
  emits: ['new-item-requested', 'edit-item-requested', 'delete-item-requested', 'delete-selected-items-requested'],

  data() {
    return {
      /**
       * @type {Array}
       * @description Array of currently selected recommendations in the data table
       */
      selectedItems: [],

      /**
       * @type {Object}
       * @description Filter configuration for the data table
       */
      filters: null
    }
  },
  methods: {
    /**
     * Initializes the filter configuration for the data table
     * Sets up a global filter with CONTAINS match mode
     */
    initFilters() {
      this.filters = {global: {value: null, matchMode: FilterMatchMode.CONTAINS}};
    },

    /**
     * Handles the "New" button click and emits the new-item-requested event
     */
    newItem() {
      this.$emit('new-item-requested');
    },

    /**
     * Shows a confirmation dialog for deleting selected recommendations
     * If confirmed, emits the delete-selected-items-requested event with selected items
     */
    confirmDeleteSelected() {
      this.$confirm.require({
        message: `Are you sure you want to delete the selected ${this.title.plural}?`,
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        rejectClass: 'p-button-secondary p-button-outlined',
        rejectLabel: 'Cancel',
        acceptLabel: 'Delete',
        acceptClass: 'p-button-danger',
        accept: () => this.$emit('delete-selected-items-requested', this.selectedItems),
        reject: () => {}
      });
    },

    /**
     * Triggers CSV export of the current data table contents
     * Uses the PrimeVue DataTable exportCSV method
     */
    exportToCsv() {
      this.$refs.dt.exportCSV();
    },

    /**
     * Handles the edit button click for a recommendation
     * @param {Object} item - The recommendation to be edited
     */
    editItem(item) {
      this.$emit('edit-item-requested', item);
    },

    /**
     * Shows a confirmation dialog for deleting a single recommendation
     * If confirmed, emits the delete-item-requested event with the recommendation
     * @param {Object} item - The recommendation to be deleted
     */
    confirmDeleteItem(item) {
      this.$confirm.require({
        message: `Are you sure you want to delete this ${this.title.singular}?`,
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        rejectClass: 'p-button-secondary p-button-outlined',
        rejectLabel: 'Cancel',
        acceptLabel: 'Delete',
        acceptClass: 'p-button-danger',
        accept: () => this.$emit('delete-item-requested', item),
        reject: () => {}
      });
    },
  },

  /**
   * Lifecycle hook called after the instance is created
   * Initializes the data table filters
   */
  created() {
    this.initFilters();
  },
}
</script>

<template>
  <h3>Manage {{ title.plural }}</h3>

  <!-- Toolbar Section -->
  <pv-toolbar class="mb-4">
    <template #start>
      <pv-button class="mr-2" icon="pi pi-plus" label="New" severity="success" @click="newItem"/>
      <pv-button :disabled="!selectedItems || !selectedItems.length" icon="pi pi-trash" label="Delete" severity="danger"
                 @click="confirmDeleteSelected"/>
    </template>
    <template #end>
      <pv-button icon="pi pi-download" label="Export" severity="help" @click="exportToCsv($event)"/>
    </template>
  </pv-toolbar>

  <!-- Data Table Section -->
  <pv-data-table
      ref="dt"
      v-model:selection="selectedItems"
      :filters="filters"
      :paginator="true"
      :rows="10"
      :rows-per-page-options="[5, 10, 20]"
      :value="items"
      current-page-report-template="Showing {first} to {last} of {totalRecords} {{title.plural}}"
      data-key="id"
      paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown">
    <pv-column :exportable="false" selection-mode="multiple" style="width: 3rem"/>
    <slot name="custom-columns"></slot>
    <pv-column v-if="dynamic" v-for="column in columns" :key="column.field" :field="column.field" :header="column.header"/>
    <pv-column :exportable="false" style="min-width:8rem">
      <template #body="slotProps">
        <pv-button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editItem(slotProps.data)"/>
        <pv-button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteItem(slotProps.data)"/>
      </template>
    </pv-column>
  </pv-data-table>
</template>

<style scoped>
</style>