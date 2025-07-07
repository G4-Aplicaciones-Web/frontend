export class Tracking {
    /**
     * Creates a new Tracking instance
     * @param {Object} params - The tracking initialization parameters
     * @param {number} [params.id=0] - Unique identifier for the tracking entry
     * @param {string} [params.date=''] - Date of the tracking entry (YYYY-MM-DD)
     * @param {number} [params.userId=0] - ID of the user who owns this tracking
     * @param {number} [params.trackingGoalId=0] - ID of the associated tracking goal
     * @param {number} [params.trackingMacronutrientId=0] - ID of the associated macronutrient profile
     * @param {Array} [params.mealPlanEntries=[]] - Array of meal plan entries for this day
     * @param {string} [params.createdAt=''] - Timestamp of creation (ISO format)
     */
    constructor({
                    id = 0,
                    date = '',
                    userId = 0,
                    trackingGoalId = 0,
                    trackingMacronutrientId = 0,
                    mealPlanEntries = [],
                    createdAt = ''
                }) {
        /** @type {number} */
        this.id = id;

        /** @type {string} */
        this.date = date;

        /** @type {number} */
        this.userId = userId;

        /** @type {number} */
        this.trackingGoalId = trackingGoalId;

        /** @type {number} */
        this.trackingMacronutrientId = trackingMacronutrientId;

        /** @type {Array<MealPlanEntry>} */
        this.mealPlanEntries = mealPlanEntries.map(entry => new MealPlanEntry(entry));

        /** @type {string} */
        this.createdAt = createdAt;
    }

    /**
     * Adds a meal plan entry to this tracking
     * @param {MealPlanEntry} entry - The meal plan entry to add
     */
    addMealPlanEntry(entry) {
        this.mealPlanEntries.push(entry);
    }

    /**
     * Removes a meal plan entry from this tracking
     * @param {number} entryId - The ID of the entry to remove
     */
    removeMealPlanEntry(entryId) {
        this.mealPlanEntries = this.mealPlanEntries.filter(entry => entry.id !== entryId);
    }

    /**
     * Gets total calories for the day
     * @returns {number} Total calories consumed
     */
    getTotalCalories() {
        return this.mealPlanEntries.reduce((total, entry) => total + entry.calories, 0);
    }
}

