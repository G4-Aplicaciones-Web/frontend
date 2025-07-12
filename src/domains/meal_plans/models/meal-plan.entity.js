export class MealPlan {
    static nextId = 3;

    constructor({
        id = null,
        profileId = '',
        summary = '',
        score = 0
    }) {
        this.id = id || MealPlan.nextId++;
        this.profileId = profileId;
        this.summary = summary;
        this.score = score;
    }
}