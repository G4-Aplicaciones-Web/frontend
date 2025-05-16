<script>
/**
 * Import the Category entity model for creating and manipulating category objects
 */
import {Tracking} from "../model/tracking.entity.js";

/**
 * Import the CategoryService for handling API operations related to categories
 */
import {TrackingService} from "../services/tracking.service.js";

/**
 * Import the DataManager component for displaying and managing category data
 */
import DataManager from "../../../shared/components/data-manager.component.vue";

/**
 * Import the CategoryItemCreateAndEditDialog component for creating and editing categories
 */
import TrackingItemCreateAndEditDialog from "../components/tracking-item-create-and-edit.component.vue";

/**
 * @component
 * @description Page component for managing categories in the publishing context.
 * Provides a user interface for viewing, creating, editing, and deleting categories.
 * Handles all CRUD operations through the CategoryService.
 */
export default {
  name: "tracking-management",
  components: {TrackingItemCreateAndEditDialog, DataManager},

  /**
   * @returns {Object} Component data
   */
  data() {
    return {
      selectedTracking: null,
      /**
       * @type {Object}
       * @property {string} singular - Singular name for display purposes
       * @property {string} plural - Plural name for display purposes
       * @description Title configuration for the data manager
       */
      title: {singular: "Tracking", plural: "Trackings"},

      /**
       * @type {Array<Tracking>}
       * @description Collection of all categories loaded from the server
       */
      trackings: [],

      /**
       * @type {Tracking}
       * @description Currently selected category for editing or creating
       */
      tracking: new Tracking({}),

      /**
       * @type {Array<Tracking>}
       * @description Collection of categories selected for bulk operations
       */
      selectedTrackings: [],

      /**
       * @type {TrackingService|null}
       * @description Service for handling API requests related to categories
       */
      trackingService: null,

      /**
       * @type {Boolean}
       * @description Controls the visibility of the create/edit dialog
       */
      createAndEditDialogIsVisible: false,

      /**
       * @type {Boolean}
       * @description Indicates whether the form is in edit mode (true) or create mode (false)
       */
      isEdit: false,

      /**
       * @type {Boolean}
       * @description Tracks whether the form has been submitted for validation purposes
       */
      submitted: false,
    }
  },
  methods: {
    onRowSelect(event) {
      this.selectedTracking = event.value;
    },

    onRowClick(rowData) {
      this.selectedTracking = rowData;
    },
    /**
     * Displays a success toast notification
     * @param {string} message - The message to display in the notification
     */
    notifySuccessfulAction(message) {
      this.$toast.add({severity: 'success', summary: 'Success', detail: message, life: 3000});
    },

    /**
     * Finds the index of a category item in the category array by its ID
     * @param {string} id - The ID of the category to find
     * @returns {number} The index of the category in the array, or -1 if not found
     */
    findIndexById(id) {
      return this.trackings.findIndex(tracking => tracking.id === id);
    },

    /**
     * Handles the request to create a new category
     * Prepares the form for creating a new category and shows the dialog
     */
    onNewItem() {
      this.tracking = new Tracking({});
      this.isEdit = false;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
      console.log(this.createAndEditDialogIsVisible);
    },

    /**
     * Handles the request to edit an existing category
     * Prepares the form with the selected category data and shows the dialog
     * @param {Tracking} item - The category to edit
     */
    onEditItem(item) {
      this.tracking = new Tracking(item);
      this.isEdit = true;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },

    /**
     * Handles the request to delete a category
     * Sets the current category and initiates the delete operation
     * @param {Tracking} item - The category to delete
     */
    onDeleteItem(item) {
      this.tracking = {...item};
      this.deleteTracking();
    },

    /**
     * Handles the request to delete multiple selected categories
     * @param {Array<Tracking>} selectedItems - The array of categories to delete
     */
    onDeleteSelectedItems(selectedItems) {
      this.selectedTrackings = selectedItems;
      this.deleteSelectedTrackings();
    },

    /**
     * Handles the cancel action from the create/edit dialog
     * Closes the dialog and resets form state
     */
    onCancelRequested() {
      this.createAndEditDialogIsVisible = false;
      this.submitted = false;
      this.isEdit = false;
    },

    /**
     * Handles the save action from the create/edit dialog
     * Validates the form and calls the appropriate create or update method
     * @param {Tracking} item - The category data from the form
     */
    onSaveRequested(item) {
      console.log('onSaveRequested');
      this.submitted = true;
      if (this.tracking.user_id) {
        if (item.id) {
          this.updateTracking();
        } else {
          this.createTracking();
        }
        this.createAndEditDialogIsVisible = false;
        this.isEdit = false;
      }
    },

    /**
     * Creates a new category via the API
     * Adds the created category to the local array on success
     */
    createTracking() {
      this.trackingService.create(this.tracking).then(response => {
        let tracking = new Tracking(response.data);
        this.trackings.push(tracking);
        this.notifySuccessfulAction("Tracking Created");
      }).catch(error => console.error(error));
    },

    /**
     * Updates an existing category via the API
     * Updates the local category in the array on success
     */
    updateTracking() {
      this.trackingService.update(this.tracking.id, this.tracking).then(response => {
        console.log('updateTracking');
        let index = this.findIndexById(this.tracking.id);
        this.trackings[index] = new Tracking(response.data);
        console.log(this.trackings);
        this.notifySuccessfulAction("Tracking Updated");
      }).catch(error => console.error(error));
    },

    /**
     * Deletes the current category via the API
     * Removes the category from the local array on success
     */
    deleteTracking() {
      this.trackingService.delete(this.tracking.id).then(() => {
        let index = this.findIndexById(this.tracking.id);
        this.trackings.splice(index, 1);
        this.notifySuccessfulAction("Tracking Deleted");
      }).catch(error => console.error(error));
    },

    /**
     * Deletes multiple selected categories via the API
     * Removes the categories from the local array on success
     */
    deleteSelectedTrackings() {
      this.selectedTrackings.forEach((tracking) => {
        this.trackingService.delete(tracking.id).then(() => {
          this.trackings = this.trackings.filter((t) => t.id !== this.tracking.id);
        });
      });
      this.notifySuccessfulAction("Trackings Deleted");
    }
  },

  /**
   * Lifecycle hook called after the component instance is created
   * Initializes the category service and loads all categories from the server
   */
  created() {
    this.trackingService = new TrackingService();
    this.trackingService.getAll().then(response => {
      this.trackings = response.data.map(tracking => new Tracking(tracking));
      console.log(this.trackings);
    }).catch(error => console.error(error));
  }
}
</script>

<template>
  <div class="w-full">
    <data-manager
        :title="title"
        :items="trackings"
        @new-item-requested="onNewItem"
        @edit-item-requested="onEditItem($event)"
        @delete-item-requested="onDeleteItem($event)"
        @delete-selected-items-requested="onDeleteSelectedItems($event)"
        @row-click="onRowClick"
    >
      <template #custom-columns>
        <pv-column
            :sortable="true"
            field="time_of_day"
            :header="$t('tracking.time_of_day')"
            style="min-width:14rem"
        />
        <pv-column
            :sortable="true"
            field="quantity"
            :header="$t('tracking.quantity')"
            style="min-width:12rem"
        />
        <pv-column
            :sortable="true"
            field="notes"
            :header="$t('tracking.notes')"
            style="min-width:18rem"
        />
        <pv-column
            :sortable="true"
            field="calories"
            :header="$t('tracking.calories')"
            style="min-width:12rem"
        />
      </template>
    </data-manager>

    <tracking-item-create-and-edit-dialog
        :edit="isEdit"
        :item="tracking"
        :visible="createAndEditDialogIsVisible"
        @cancel-requested="onCancelRequested"
        @save-requested="onSaveRequested($event)"
    />
  </div>
</template>



<style scoped>
</style>