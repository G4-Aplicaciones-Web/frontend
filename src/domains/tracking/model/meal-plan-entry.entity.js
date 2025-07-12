/**
 * Represents a meal entry for a given day.
 */
export class MealPlanEntry {
    /**
     * @param {Object} params
     * @param {number} [params.id=0]
     * @param {string} [params.mealType='']
     * @param {string} [params.foodName='']
     * @param {number} [params.quantity=0]
     * @param {number} [params.calories=0]
     * @param {number} [params.protein=0]
     * @param {number} [params.carbs=0]
     * @param {number} [params.fats=0]
     * @param {string} [params.notes='']
     * @param {string} [params.createdAt='']
     * @param {number} [params.userId]
     * @param {number} [params.recipeId]
     * @param {number} [params.dayNumber]
     */
    constructor({
                    id = 0,
                    mealType = '',
                    foodName = '',
                    quantity = 0,
                    calories = 0,
                    protein = 0,
                    carbs = 0,
                    fats = 0,
                    notes = '',
                    createdAt = '',
                    userId,
                    recipeId,
                    dayNumber
                } = {}) {
        this.id = id;
        this.mealType = mealType;
        this.foodName = foodName;
        this.quantity = quantity;
        this.calories = calories;
        this.protein = protein;
        this.carbs = carbs;
        this.fats = fats;
        this.notes = notes;
        this.createdAt = createdAt;
        this.userId = userId;
        this.recipeId = recipeId;
        this.dayNumber = dayNumber;
    }
}
