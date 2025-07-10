export class MealPlanEntry {
    /**
     * Creates a new MealPlanEntry instance
     * @param {Object} params - The meal plan entry initialization parameters
     * @param {number} [params.id=0] - Unique identifier for the meal plan entry
     * @param {string} [params.timeOfDay=''] - Time of day (e.g., breakfast, lunch, dinner)
     * @param {number} [params.quantity=0.0] - Quantity of the portion consumed
     * @param {string} [params.notes=''] - Additional notes about the meal
     * @param {number} [params.recipeId=0] - ID of the recipe linked to the entry
     * @param {number} [params.calories=0.0] - Total calories for this entry
     * @param {number} [params.trackingId=0] - ID of the tracking this entry belongs to
     */
    constructor({
                    id = 0,
                    timeOfDay = '',
                    quantity = 0.0,
                    notes = '',
                    recipeId = 0,
                    calories = 0.0,
                    trackingId = 0
                }) {
        /** @type {number} */
        this.id = id;

        /** @type {string} */
        this.timeOfDay = timeOfDay;

        /** @type {number} */
        this.quantity = quantity;

        /** @type {string} */
        this.notes = notes;

        /** @type {number} */
        this.recipeId = recipeId;

        /** @type {number} */
        this.calories = calories;

        /** @type {number} */
        this.trackingId = trackingId;
    }
}