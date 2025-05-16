export class Tracking {
    /**
     * Creates a new Tracking instance
     * @param {Object} params - The tracking initialization parameters
     * @param {number} [params.id=0] - Unique identifier for the tracking entry
     * @param {string} [params.date=''] - Date of the tracking entry (YYYY-MM-DD)
     * @param {string} [params.time_of_day=''] - Time of day (e.g., breakfast, lunch, dinner)
     * @param {number} [params.quantity=0.0] - Quantity of the portion consumed
     * @param {string} [params.notes=''] - Additional notes about the meal
     * @param {number} [params.recipe_id=0] - ID of the recipe linked to the tracking
     * @param {number} [params.user_id=0] - ID of the user who logged the entry
     * @param {number} [params.calories=0.0] - Total calories for this entry
     * @param {string} [params.created_at=''] - Timestamp of creation (ISO format)
     */
    constructor({
                    id = 0,
                    date = '',
                    time_of_day = '',
                    quantity = 0.0,
                    notes = '',
                    recipe_id = 0,
                    user_id = 0,
                    calories = 0.0,
                    created_at = ''
                }) {
        /** @type {number} */
        this.id = id;

        /** @type {string} */
        this.date = date;

        /** @type {string} */
        this.time_of_day = time_of_day;

        /** @type {number} */
        this.quantity = quantity;

        /** @type {string} */
        this.notes = notes;

        /** @type {number} */
        this.recipe_id = recipe_id;

        /** @type {number} */
        this.user_id = user_id;

        /** @type {number} */
        this.calories = calories;

        /** @type {string} */
        this.created_at = created_at;
    }
}