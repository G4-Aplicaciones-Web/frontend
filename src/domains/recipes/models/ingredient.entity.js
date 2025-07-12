// models/ingredient.entity.js
export class Ingredient {
    constructor({
                    id = 0,
                    name = '',
                    nutrients = {
                        calories: 0,
                        carbs: 0,
                        proteins: 0,
                        fats: 0
                    },
                    ingredientCategory = 'NoCategory'
                } = {}) {
        this.id = id;
        this.name = name;
        this.nutrients = nutrients;
        this.ingredientCategory = ingredientCategory;
    }

    get caloriesPerGram() {
        return this.nutrients.calories / 100;
    }
}
