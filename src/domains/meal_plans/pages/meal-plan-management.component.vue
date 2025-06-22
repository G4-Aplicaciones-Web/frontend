<script>

import {MealPlan} from "@/domains/meal_plans/models/meal-plan.entity.js";

import {MealPlanService} from "@/domains/meal_plans/services/meal-plan.service.js";

import DataManager from "../../../shared/components/data-manager.component.vue";

import MealplanItemCreateAndEditComponent from "@/domains/meal_plans/components/mealplan-item-create-and-edit.component.vue";
import MealplanItemCreateAndEditDialog from "@/domains/meal_plans/components/mealplan-item-create-and-edit.component.vue";

export default {
  name: "meal-plan-management",
  components: {MealplanItemCreateAndEditDialog, MealplanItemCreateAndEditComponent, DataManager},

  /**
   * @returns {Object} Component data
   */
  data() {
    return {
      selectedMealPlan: null,
      /**
       * @type {Object}
       * @property {string} singular - Singular name for display purposes
       * @property {string} plural - Plural name for display purposes
       * @description Title configuration for the data manager
       */
      title: {singular: "MealPlan", plural: "MealPlans"},


      mealPlans: [],


      meal_plan: new MealPlan({}),


      selectedMealPlans: [],


      mealPlanService: null,

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

    findIndexById(id) {
      return this.mealPlans.findIndex(meal_plan => meal_plan.id === id);
    },

    /**
     * Handles the request to create a new category
     * Prepares the form for creating a new category and shows the dialog
     */
    onNewItem() {
      this.meal_plan = new MealPlan({});
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
      this.meal_plan = new MealPlan(item);
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
      this.meal_plan = {...item};
      this.deleteMealPlan();
    },

    /**
     * Handles the request to delete multiple selected categories
     * @param {Array<Tracking>} selectedItems - The array of categories to delete
     */
    onDeleteSelectedItems(selectedItems) {
      this.selectedMealPlans = selectedItems;
      this.deleteSelectedMealPlans();
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
      this.meal_plan = item;
      if (this.meal_plan.id) {
        this.updateMealPlan();
      } else {
        this.createMealPlan();
      }
      this.createAndEditDialogIsVisible = false;
      this.isEdit = false;
    },

    /**
     * Creates a new category via the API
     * Adds the created category to the local array on success
     */

     createMealPlan() {
      this.mealPlanService.create(this.meal_plan).then(response => {
        let meal_plan = new MealPlan(response.data);
        this.mealPlans.push(meal_plan);
        this.notifySuccessfulAction("MealPlan Created");
      }).catch(error => console.error(error));
    },

    /**
     * Updates an existing category via the API
     * Updates the local category in the array on success
     */
    updateMealPlan() {
      this.mealPlanService.update(this.meal_plan.id, this.meal_plan).then(response => {
        let index = this.findIndexById(this.meal_plan.id);
        this.mealPlans[index] = new MealPlan(response.data);
        this.notifySuccessfulAction("MealPlan Updated");
      }).catch(error => console.error(error));
    },

    /**
     * Deletes the current category via the API
     * Removes the category from the local array on success
     */
    deleteMealPlan() {
      this.mealPlanService.delete(this.meal_plan.id).then(() => {
        let index = this.findIndexById(this.meal_plan.id);
        this.mealPlans.splice(index, 1);
        this.notifySuccessfulAction("MealPlan Deleted");
      }).catch(error => console.error(error));
    },

    /**
     * Deletes multiple selected categories via the API
     * Removes the categories from the local array on success
     */
    deleteSelectedMealPlans() {
      this.selectedMealPlans.forEach((meal_plan) => {
        this.mealPlanService.delete(meal_plan.id).then(() => {
          this.mealPlans = this.mealPlans.filter((t) => t.id !== meal_plan.id);
        });
      });
      this.notifySuccessfulAction("Meal Plans Deleted");
    }
  },

  /**
   * Lifecycle hook called after the component instance is created
   * Initializes the category service and loads all categories from the server
   */
  created() {
    this.mealPlanService = new MealPlanService();
    this.mealPlanService.getAll().then(response => {
      this.mealPlans = response.data.map(meal_plan => new MealPlan(meal_plan));
      console.log(this.mealPlans);
    }).catch(error => console.error(error));
  }
}

</script>

<template>
  <div class="w-full">
    <data-manager
        :title="title"
        :items="mealPlans"
        @new-item-requested="onNewItem"
        @edit-item-requested="onEditItem($event)"
        @delete-item-requested="onDeleteItem($event)"
        @delete-selected-items-requested="onDeleteSelectedItems($event)"
        @row-click="onRowClick"
    >
      <template #custom-columns>
        <pv-column
            :sortable="true"
            field="description"
            :header="$t('meal_plan.description')"
            style="min-width:14rem"
        />
        <pv-column
            :sortable="true"
            field="total_calories"
            :header="$t('meal_plan.total_calories')"
            style="min-width:12rem"
        />
        <pv-column
            :sortable="true"
            field="total_carbs"
            :header="$t('meal_plan.total_carbs')"
            style="min-width:18rem"
        />
        <pv-column
            :sortable="true"
            field="profile_id"
            :header="$t('meal_plan.profile_id')"
            style="min-width:12rem"
        />
      </template>
    </data-manager>

    <mealplan-item-create-and-edit-dialog
        :edit="isEdit"
        :item=""
        :visible="createAndEditDialogIsVisible"
        @cancel-requested="onCancelRequested"
        @save-requested="onSaveRequested($event)"
    />
  </div>
</template>