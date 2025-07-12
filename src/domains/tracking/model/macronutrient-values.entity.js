/**
 * Represents macronutrient values consumed or targeted.
 */
export class MacronutrientValues {
    /**
     * @param {Object} params
     * @param {number} [params.id=0]
     * @param {number} [params.calories=0]
     * @param {number} [params.protein=0]
     * @param {number} [params.carbs=0]
     * @param {number} [params.fats=0]
     */
    constructor({
                    id = 0,
                    calories = 0,
                    protein = 0,
                    carbs = 0,
                    fats = 0
                } = {}) {
        this.id = id;
        this.calories = calories;
        this.protein = protein;
        this.carbs = carbs;
        this.fats = fats;
    }
}
