/**
 * DTO for creating a new meal plan entry from a recipe.
 */
export class CreateMealPlanEntryRequest {
    /**
     * @param {Object} params
     * @param {number} [params.userId=0]
     * @param {number} [params.recipeId=0]
     * @param {string} [params.mealPlanType='']
     * @param {number} [params.dayNumber=0]
     */
    constructor({
                    userId = 0,
                    recipeId = 0,
                    mealPlanType = '',
                    dayNumber = 0
                } = {}) {
        this.userId = userId;
        this.recipeId = recipeId;
        this.mealPlanType = mealPlanType;
        this.dayNumber = dayNumber;
    }
}
