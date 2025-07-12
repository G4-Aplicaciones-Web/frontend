/**
 * @class Recipe
 * @description Represents a recipe entity within the meal planning system
 */
export class Recipe {
    /**
     * Creates a new Recipe instance
     * @param {Object} params - The recipe initialization parameters
     * @param {number} [params.id=0] - Unique identifier for the recipe
     * @param {string} [params.title=''] - Title of the recipe
     * @param {string} [params.description=''] - Detailed description of the recipe
     * @param {number} [params.total_calories=0] - Total calories in the recipe
     * @param {number} [params.total_carbs=0] - Total carbohydrates in grams
     * @param {number} [params.total_proteins=0] - Total proteins in grams
     * @param {number} [params.total_fats=0] - Total fats in grams
     */
    constructor({
                    id = 0,
                    title = '',
                    description = '',
                    total_calories = 0,
                    total_carbs = 0,
                    total_proteins = 0,
                    total_fats = 0
                } = {}) {
        /**
         * @type {number}
         * @description Unique identifier for the recipe
         */
        this.id = id;

        /**
         * @type {string}
         * @description Title of the recipe
         */
        this.title = title;

        /**
         * @type {string}
         * @description Detailed description of the recipe including preparation instructions
         */
        this.description = description;

        /**
         * @type {number}
         * @description Total calories in the recipe
         * @min 0
         */
        this.total_calories = total_calories;

        /**
         * @type {number}
         * @description Total carbohydrates in grams
         * @min 0
         */
        this.total_carbs = total_carbs;

        /**
         * @type {number}
         * @description Total proteins in grams
         * @min 0
         */
        this.total_proteins = total_proteins;

        /**
         * @type {number}
         * @description Total fats in grams
         * @min 0
         */
        this.total_fats = total_fats;
    }
}