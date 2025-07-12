export class Recipe {
    constructor({
                    id = 0,
                    name = '',
                    description = '',
                    urlInstructions = '',
                    totalNutrients = { calories: 0, carbohydrates: 0, proteins: 0, fats: 0 },
                    userId = 0,
                    recipeType = 0,
                    ingredients = []
                } = {}) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.urlInstructions = urlInstructions;
        this.totalNutrients = totalNutrients;
        this.userId = userId;
        this.recipeType = recipeType;
        this.ingredients = ingredients;
    }
}
