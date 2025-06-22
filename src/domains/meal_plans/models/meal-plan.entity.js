export class MealPlan {

    constructor({
        id = 0,
        profile_id = 0,
        description = '',
        created_at = '',
        total_calories = 0.0,
        total_carbs = 0.0,
        total_proteins = 0.0,
        total_fats = 0.0,
        min_score = 0.0,
        max_score = 0.0
                }) {
        this.id = id;

        this.profile_id = profile_id;

        this.description = description;

        this.created_at = created_at;

        this.total_calories = total_calories;

        this.total_carbs = total_carbs;

        this.total_proteins = total_proteins;

        this.total_fats = total_fats;

        this.min_score = min_score;

        this.max_score = max_score;
    }

}