<script>
import {Tracking} from "../model/tracking.entity.js";
import {MealPlanEntry} from "../model/meal-plan-entry.entity.js";
import {TrackingService} from "../services/tracking.service.js";
import {MealPlanEntryService} from "../services/meal-plan-entry.service.js";
import {TrackingGoalService} from "../services/tracking-goal.service.js";
import DataManager from "../../../shared/components/data-manager.component.vue";
import MealPlanEntryCreateAndEditDialog from "../components/meal-plan-entry-create-and-edit.component.vue";

export default {
  name: "tracking-management",
  components: {MealPlanEntryCreateAndEditDialog, DataManager},

  data() {
    return {
      // Current user's tracking (daily container)
      currentTracking: null,

      // Current user's tracking goal
      currentTrackingGoal: null,

      // Target macronutrients for the goal
      targetMacros: null,

      // Meal plan entries for the current tracking
      mealPlanEntries: [],

      // Selected meal plan entry for editing
      selectedMealPlanEntry: null,

      // Current meal plan entry being created/edited
      mealPlanEntry: new MealPlanEntry({}),

      // Dialog visibility
      createAndEditDialogIsVisible: false,

      // Edit mode flag
      isEdit: false,

      // Form submission tracking
      submitted: false,

      // Loading states
      loadingGoal: false,

      // Services
      trackingService: null,
      mealPlanEntryService: null,
      trackingGoalService: null,

      // Current user ID (you should get this from your auth system)
      currentUserId: 1, // Replace with actual user ID

      // Title for the data manager
      title: {singular: "Meal Entry", plural: "Meal Entries"}
    }
  },

  computed: {
    /**
     * Gets the current total calories consumed
     */
    totalCaloriesConsumed() {
      return this.mealPlanEntries.reduce((total, entry) => total + entry.calories, 0);
    },

    /**
     * Gets the target calories from the goal
     */
    targetCalories() {
      return this.targetMacros?.calories || 0;
    },

    /**
     * Gets remaining calories
     */
    remainingCalories() {
      return this.targetCalories - this.totalCaloriesConsumed;
    },

    /**
     * Gets the percentage of calories consumed
     */
    caloriesPercentage() {
      if (this.targetCalories === 0) return 0;
      return Math.min(100, (this.totalCaloriesConsumed / this.targetCalories) * 100);
    }
  },

  methods: {
    /**
     * Initializes tracking goal for the user
     */
    async initializeTrackingGoal() {
      this.loadingGoal = true;
      try {
        const response = await this.trackingGoalService.getByUserId(this.currentUserId);
        this.currentTrackingGoal = response.data;

        // Load target macros
        if (this.currentTrackingGoal?.id) {
          await this.loadTargetMacros();
        }
      } catch (error) {
        if (error.response?.status === 404) {
          console.log('No tracking goal found for user');
        } else {
          console.error('Error loading tracking goal:', error);
        }
      } finally {
        this.loadingGoal = false;
      }
    },

    /**
     * Loads target macronutrients for the tracking goal
     */
    async loadTargetMacros() {
      try {
        const response = await this.trackingGoalService.getTargetMacros(this.currentTrackingGoal.id);
        this.targetMacros = response.data;
      } catch (error) {
        console.error('Error loading target macros:', error);
      }
    },

    /**
     * Initializes or gets the current tracking for the user
     */
    async initializeTracking() {
      try {
        // Try to get existing tracking for user
        const response = await this.trackingService.getByUserId(this.currentUserId);
        this.currentTracking = new Tracking(response.data);
        await this.loadMealPlanEntries();
      } catch (error) {
        if (error.response?.status === 404) {
          // No tracking exists, create one for today
          await this.createTodayTracking();
        } else {
          console.error('Error loading tracking:', error);
        }
      }
    },

    /**
     * Creates a new tracking for today
     */
    async createTodayTracking() {
      try {
        const trackingData = {
          userId: this.currentUserId,
          date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
          trackingGoalId: this.currentTrackingGoal?.id || 0
        };

        const response = await this.trackingService.create(trackingData);
        this.currentTracking = new Tracking(response.data);
        this.mealPlanEntries = [];
      } catch (error) {
        console.error('Error creating tracking:', error);
      }
    },

    /**
     * Loads meal plan entries for the current tracking
     */
    async loadMealPlanEntries() {
      if (!this.currentTracking) return;

      try {
        const response = await this.mealPlanEntryService.getAllByTrackingId(this.currentTracking.id);
        this.mealPlanEntries = response.data.map(entry => new MealPlanEntry(entry));
      } catch (error) {
        console.error('Error loading meal plan entries:', error);
      }
    },

    /**
     * Handles row selection
     */
    onRowSelect(event) {
      this.selectedMealPlanEntry = event.value;
    },

    /**
     * Handles row click
     */
    onRowClick(rowData) {
      this.selectedMealPlanEntry = rowData;
    },

    /**
     * Shows success notification
     */
    notifySuccessfulAction(message) {
      this.$toast.add({severity: 'success', summary: 'Success', detail: message, life: 3000});
    },

    /**
     * Finds index of meal plan entry by ID
     */
    findIndexById(id) {
      return this.mealPlanEntries.findIndex(entry => entry.id === id);
    },

    /**
     * Handles new meal plan entry creation
     */
    onNewItem() {
      this.mealPlanEntry = new MealPlanEntry({trackingId: this.currentTracking?.id});
      this.isEdit = false;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },

    /**
     * Handles meal plan entry editing
     */
    onEditItem(item) {
      this.mealPlanEntry = new MealPlanEntry(item);
      this.isEdit = true;
      this.submitted = false;
      this.createAndEditDialogIsVisible = true;
    },

    /**
     * Handles meal plan entry deletion
     */
    async onDeleteItem(item) {
      try {
        await this.mealPlanEntryService.delete(this.currentTracking.id, item.id);
        const index = this.findIndexById(item.id);
        if (index > -1) {
          this.mealPlanEntries.splice(index, 1);
        }
        this.notifySuccessfulAction("Meal Entry Deleted");
      } catch (error) {
        console.error('Error deleting meal entry:', error);
      }
    },

    /**
     * Handles multiple meal plan entries deletion
     */
    async onDeleteSelectedItems(selectedItems) {
      try {
        for (const item of selectedItems) {
          await this.mealPlanEntryService.delete(this.currentTracking.id, item.id);
          const index = this.findIndexById(item.id);
          if (index > -1) {
            this.mealPlanEntries.splice(index, 1);
          }
        }
        this.notifySuccessfulAction("Meal Entries Deleted");
      } catch (error) {
        console.error('Error deleting meal entries:', error);
      }
    },

    /**
     * Handles cancel action
     */
    onCancelRequested() {
      this.createAndEditDialogIsVisible = false;
      this.submitted = false;
      this.isEdit = false;
    },

    /**
     * Handles save action
     */
    async onSaveRequested(item) {
      this.submitted = true;
      console.log("recibido")

      if (!this.currentTracking) {
        console.error('No tracking available');
        return;
      }

      try {
        if (this.isEdit) {
          await this.updateMealPlanEntry(item);
        } else {
          await this.createMealPlanEntry(item);
        }

        this.createAndEditDialogIsVisible = false;
        this.isEdit = false;
      } catch (error) {
        console.error('Error saving meal entry:', error);
      }
    },

    /**
     * Creates a new meal plan entry
     */
    async createMealPlanEntry(item) {
      const response = await this.mealPlanEntryService.create(this.currentTracking.id, item);
      // Since the API returns 201 Created, we need to reload the entries
      await this.loadMealPlanEntries();
      this.notifySuccessfulAction("Meal Entry Created");
    },

    /**
     * Updates an existing meal plan entry
     */
    async updateMealPlanEntry(item) {
      const response = await this.mealPlanEntryService.update(item.id, item);
      const index = this.findIndexById(item.id);
      if (index > -1) {
        this.mealPlanEntries[index] = new MealPlanEntry(item);
      }
      this.notifySuccessfulAction("Meal Entry Updated");
    },

    /**
     * Formats date for display
     */
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  },

  /**
   * Component lifecycle - initialize data
   */
  async created() {
    this.trackingService = new TrackingService();
    this.mealPlanEntryService = new MealPlanEntryService();
    this.trackingGoalService = new TrackingGoalService();

    // Initialize tracking goal first, then tracking
    await this.initializeTrackingGoal();
    await this.initializeTracking();
  }
}
</script>

<template>
  <div class="w-full">
    <!-- Goal Summary Card -->
    <div class="goal-summary-card mb-4 p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-bold text-gray-800 dark:text-white">
          Daily Goal - {{ currentTracking ? formatDate(currentTracking.date) : 'Today' }}
        </h3>
        <div v-if="loadingGoal" class="flex items-center text-gray-500">
          <i class="pi pi-spinner pi-spin mr-2"></i>
          Loading goal...
        </div>
      </div>

      <!-- Calories Progress -->
      <div class="calories-section mb-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-lg font-semibold ">Calories</span>
          <span class="text-lg font-bold ">
            {{ totalCaloriesConsumed }} / {{ targetCalories }}
          </span>
        </div>

        <div class="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
          <div
              class="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-300"
              :style="{ width: `${caloriesPercentage}%` }"
          ></div>
        </div>

        <div class="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
          <span>{{ Math.round(caloriesPercentage) }}% consumed</span>
          <span
              :class="remainingCalories >= 0 ? 'text-green-600' : 'text-red-600'"
          >
            {{ remainingCalories >= 0 ? remainingCalories : Math.abs(remainingCalories) }}
            {{ remainingCalories >= 0 ? 'remaining' : 'over' }}
          </span>
        </div>
      </div>

      <!-- Goal Info -->
      <div v-if="currentTrackingGoal" class="goal-info grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div class="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="text-gray-500 dark:text-gray-400">Target Weight</div>
          <div class="font-semibold text-gray-800 dark:text-white">{{ currentTrackingGoal.targetWeight }} kg</div>
        </div>
        <div class="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="text-gray-500 dark:text-gray-400">Activity Level</div>
          <div class="font-semibold text-gray-800 dark:text-white capitalize">{{ currentTrackingGoal.activityLevel }}</div>
        </div>
        <div class="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="text-gray-500 dark:text-gray-400">Goal Type</div>
          <div class="font-semibold text-gray-800 dark:text-white capitalize">{{ currentTrackingGoal.goalType }}</div>
        </div>
        <div class="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="text-gray-500 dark:text-gray-400">Weekly Goal</div>
          <div class="font-semibold text-gray-800 dark:text-white">{{ currentTrackingGoal.weeklyGoal }} kg/week</div>
        </div>
      </div>

      <!-- No Goal Message -->
      <div v-else-if="!loadingGoal" class="text-center p-4 text-gray-500 dark:text-gray-400">
        <i class="pi pi-exclamation-triangle mr-2"></i>
        No tracking goal set. Please configure your goals to see target information.
      </div>
    </div>

    <!-- Meal Plan Entries Management -->
    <data-manager
        :title="title"
        :items="mealPlanEntries"
        @new-item-requested="onNewItem"
        @edit-item-requested="onEditItem($event)"
        @delete-item-requested="onDeleteItem($event)"
        @delete-selected-items-requested="onDeleteSelectedItems($event)"
        @row-click="onRowClick"
    >
      <template #custom-columns>
        <pv-column
            :sortable="true"
            field="timeOfDay"
            header="Time of Day"
            style="min-width:14rem"
        >
          <template #body="slotProps">
            <span class="capitalize">{{ slotProps.data.timeOfDay }}</span>
          </template>
        </pv-column>
        <pv-column
            :sortable="true"
            field="quantity"
            header="Quantity"
            style="min-width:12rem"
        >
          <template #body="slotProps">
            {{ slotProps.data.quantity }} portions
          </template>
        </pv-column>
        <pv-column
            :sortable="true"
            field="calories"
            header="Calories"
            style="min-width:12rem"
        >
          <template #body="slotProps">
            <span class="font-semibold text-orange-600">{{ slotProps.data.calories }} kcal</span>
          </template>
        </pv-column>
        <pv-column
            :sortable="true"
            field="notes"
            header="Notes"
            style="min-width:18rem"
        >
          <template #body="slotProps">
            <span class="text-gray-600 dark:text-gray-400">{{ slotProps.data.notes || 'No notes' }}</span>
          </template>
        </pv-column>
      </template>
    </data-manager>

    <!-- Create/Edit Dialog -->
    <meal-plan-entry-create-and-edit-dialog
        :edit="isEdit"
        :item="mealPlanEntry"
        :visible="createAndEditDialogIsVisible"
        @cancel-requested="onCancelRequested"
        @save-requested="onSaveRequested($event)"
    />
  </div>
</template>

<style scoped>
.tracking-management {
  background: linear-gradient(135deg, #f8fff8 0%, #ffffff 100%);
  min-height: 100vh;
  padding: 1rem;
}

.goal-summary-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fff8 100%);
  border: 2px solid #63B663;
  box-shadow: 0 8px 25px rgba(99, 182, 99, 0.15);
  transition: all 0.3s ease;
}

.goal-summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(99, 182, 99, 0.2);
}

.calories-section {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid #63B663;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(99, 182, 99, 0.1);
}

.goal-info-card {
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8fff8 100%);
  border: 2px solid #63B663;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(99, 182, 99, 0.1);
  transition: all 0.3s ease;
}

.goal-info-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(99, 182, 99, 0.2);
  background: linear-gradient(135deg, #f8fff8 0%, #ffffff 100%);
}

.data-manager-container {
  background: white;
  border: 2px solid #63B663;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 8px 25px rgba(99, 182, 99, 0.1);
}

/* Badge styles */
.time-of-day-badge {
  display: inline-flex;
  align-items: center;
  background: linear-gradient(135deg, #63B663 0%, #4e9a4e 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: capitalize;
  box-shadow: 0 2px 8px rgba(99, 182, 99, 0.3);
}

.quantity-badge {
  display: inline-flex;
  align-items: center;
  background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%);
  color: #2d5a2d;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
  border: 1px solid #63B663;
}

.calories-badge {
  display: inline-flex;
  align-items: center;
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  color: #856404;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.875rem;
  border: 1px solid #ffc107;
}

.notes-text {
  display: inline-flex;
  align-items: center;
  color: #6c757d;
  font-style: italic;
  font-size: 0.875rem;
}

/* PrimeVue component overrides */
:deep(.p-datatable) {
  border: 2px solid #63B663;
  border-radius: 12px;
  overflow: hidden;
  background-color: #ffffff;
}

:deep(.p-datatable .p-datatable-header) {
  background: linear-gradient(135deg, #63B663 0%, #4e9a4e 100%) !important;
  color: white !important;
  border-bottom: 2px solid #4e9a4e;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: #63B663 !important;
  color: white !important;
  border-bottom: 2px solid #4e9a4e;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
  background-color: #ffffff;
  border-bottom: 1px solid #e8f5e8;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background: rgba(99, 182, 99, 0.1) !important;
}

:deep(.p-datatable .p-datatable-tbody > tr:nth-child(even)) {
  background-color: #f8fff8;
}

:deep(.p-datatable .p-datatable-tbody > tr:nth-child(even):hover) {
  background: rgba(99, 182, 99, 0.15) !important;
}

/* Button styles */
:deep(.p-button-success) {
  background: linear-gradient(135deg, #63B663 0%, #4e9a4e 100%) !important;
  border-color: #63B663 !important;
  box-shadow: 0 4px 15px rgba(99, 182, 99, 0.3);
}

:deep(.p-button-success:hover) {
  background: linear-gradient(135deg, #4e9a4e 0%, #3d7a3d 100%) !important;
  border-color: #4e9a4e !important;
  box-shadow: 0 6px 20px rgba(99, 182, 99, 0.4);
}

:deep(.p-button-danger) {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%) !important;
  border-color: #dc3545 !important;
}

:deep(.p-button-danger:hover) {
  background: linear-gradient(135deg, #c82333 0%, #bd2130 100%) !important;
  border-color: #c82333 !important;
}

:deep(.p-button-info) {
  background: linear-gradient(135deg, #17a2b8 0%, #138496 100%) !important;
  border-color: #17a2b8 !important;
}

:deep(.p-button-info:hover) {
  background: linear-gradient(135deg, #138496 0%, #117a8b 100%) !important;
  border-color: #138496 !important;
}

/* Toolbar styles */
:deep(.p-toolbar) {
  background: linear-gradient(135deg, #f8fff8 0%, #e8f5e8 100%) !important;
  border: 1px solid #63B663 !important;
  border-radius: 8px;
}

/* Checkbox styles */
:deep(.p-checkbox .p-checkbox-box) {
  border: 2px solid #63B663 !important;
}

:deep(.p-checkbox .p-checkbox-box.p-highlight) {
  background-color: #63B663 !important;
  border-color: #63B663 !important;
}

/* Progress bar styles */
:deep(.p-progressbar) {
  background-color: #e8f5e8 !important;
  border-radius: 6px;
}

:deep(.p-progressbar .p-progressbar-value) {
  background: linear-gradient(135deg, #63B663 0%, #4e9a4e 100%) !important;
}

/* Toast styles */
:deep(.p-toast .p-toast-message-success) {
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%) !important;
  border-color: #63B663 !important;
  color: #155724 !important;
}

:deep(.p-toast .p-toast-message-success .p-toast-message-icon) {
  color: #63B663 !important;
}

/* Dialog styles */
:deep(.p-dialog) {
  border: 2px solid #63B663 !important;
  border-radius: 12px;
}

:deep(.p-dialog .p-dialog-header) {
  background: linear-gradient(135deg, #63B663 0%, #4e9a4e 100%) !important;
  color: white !important;
}

:deep(.p-dialog .p-dialog-content) {
  background-color: #ffffff !important;
}

/* Input styles */
:deep(.p-inputtext) {
  border: 2px solid #e8f5e8 !important;
  border-radius: 8px;
}

:deep(.p-inputtext:focus) {
  border-color: #63B663 !important;
  box-shadow: 0 0 0 0.2rem rgba(99, 182, 99, 0.25) !important;
}

:deep(.p-dropdown) {
  border: 2px solid #e8f5e8 !important;
  border-radius: 8px;
}

:deep(.p-dropdown:focus) {
  border-color: #63B663 !important;
  box-shadow: 0 0 0 0.2rem rgba(99, 182, 99, 0.25) !important;
}

:deep(.p-dropdown-panel) {
  border: 2px solid #63B663 !important;
  border-radius: 8px;
}

:deep(.p-dropdown-item:hover) {
  background-color: rgba(99, 182, 99, 0.1) !important;
}

/* Force PrimeVue components to stay white in dark mode */
:deep(.p-datatable),
.dark-mode :deep(.p-datatable),
.p-dark :deep(.p-datatable),
[data-theme="dark"] :deep(.p-datatable) {
  background-color: #ffffff !important;
  color: #000000 !important;
}

:deep(.p-datatable .p-datatable-tbody > tr),
.dark-mode :deep(.p-datatable .p-datatable-tbody > tr),
.p-dark :deep(.p-datatable .p-datatable-tbody > tr),
[data-theme="dark"] :deep(.p-datatable .p-datatable-tbody > tr) {
  background-color: #ffffff !important;
  color: #000000 !important;
  border-bottom: 1px solid #e8f5e8 !important;
}

:deep(.p-datatable .p-datatable-tbody > tr:nth-child(even)),
.dark-mode :deep(.p-datatable .p-datatable-tbody > tr:nth-child(even)),
.p-dark :deep(.p-datatable .p-datatable-tbody > tr:nth-child(even)),
[data-theme="dark"] :deep(.p-datatable .p-datatable-tbody > tr:nth-child(even)) {
  background-color: #f8fff8 !important;
}

:deep(.p-dialog .p-dialog-content),
.dark-mode :deep(.p-dialog .p-dialog-content),
.p-dark :deep(.p-dialog .p-dialog-content),
[data-theme="dark"] :deep(.p-dialog .p-dialog-content) {
  background-color: #ffffff !important;
  color: #000000 !important;
}

:deep(.p-inputtext),
.dark-mode :deep(.p-inputtext),
.p-dark :deep(.p-inputtext),
[data-theme="dark"] :deep(.p-inputtext) {
  background-color: #ffffff !important;
  color: #000000 !important;
  border-color: #e8f5e8 !important;
}

:deep(.p-dropdown),
.dark-mode :deep(.p-dropdown),
.p-dark :deep(.p-dropdown),
[data-theme="dark"] :deep(.p-dropdown) {
  background-color: #ffffff !important;
  color: #000000 !important;
  border-color: #e8f5e8 !important;
}

:deep(.p-toolbar),
.dark-mode :deep(.p-toolbar),
.p-dark :deep(.p-toolbar),
[data-theme="dark"] :deep(.p-toolbar) {
  background: linear-gradient(135deg, #f8fff8 0%, #e8f5e8 100%) !important;
  border-color: #63B663 !important;
  color: #000000 !important;
}

/* Scrollbar styles */
:deep(.p-datatable .p-datatable-scrollable-body)::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

:deep(.p-datatable .p-datatable-scrollable-body)::-webkit-scrollbar-track {
  background: #f8fff8;
  border-radius: 4px;
}

:deep(.p-datatable .p-datatable-scrollable-body)::-webkit-scrollbar-thumb {
  background: #63B663;
  border-radius: 4px;
}

:deep(.p-datatable .p-datatable-scrollable-body)::-webkit-scrollbar-thumb:hover {
  background: #4e9a4e;
}

/* Force light mode always - Override any dark mode preferences */
.tracking-management,
.dark-mode .tracking-management,
.p-dark .tracking-management,
[data-theme="dark"] .tracking-management {
  background: linear-gradient(135deg, #f8fff8 0%, #ffffff 100%) !important;
  color: #000000 !important;
}

.goal-summary-card,
.dark-mode .goal-summary-card,
.p-dark .goal-summary-card,
[data-theme="dark"] .goal-summary-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fff8 100%) !important;
  border-color: #63B663 !important;
  color: #000000 !important;
}

.goal-info-card,
.dark-mode .goal-info-card,
.p-dark .goal-info-card,
[data-theme="dark"] .goal-info-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fff8 100%) !important;
  border-color: #63B663 !important;
  color: #000000 !important;
}

.data-manager-container,
.dark-mode .data-manager-container,
.p-dark .data-manager-container,
[data-theme="dark"] .data-manager-container {
  background: white !important;
  border-color: #63B663 !important;
  color: #000000 !important;
}

.calories-section,
.dark-mode .calories-section,
.p-dark .calories-section,
[data-theme="dark"] .calories-section {
  background: rgba(255, 255, 255, 0.8) !important;
  border-color: #63B663 !important;
  color: #000000 !important;
}

/* Responsive design */
@media (max-width: 768px) {
  .tracking-management {
    padding: 0.5rem;
  }

  .goal-summary-card {
    padding: 1rem;
  }

  .goal-info {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .goal-info-card {
    padding: 1rem;
  }

  .data-manager-container {
    padding: 1rem;
  }

  .calories-section {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .goal-info {
    grid-template-columns: 1fr;
  }

  .time-of-day-badge,
  .quantity-badge,
  .calories-badge {
    font-size: 0.75rem;
    padding: 0.375rem 0.75rem;
  }

  .notes-text {
    font-size: 0.75rem;
  }
}
</style>