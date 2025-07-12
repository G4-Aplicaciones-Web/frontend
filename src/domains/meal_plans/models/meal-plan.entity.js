export class MealPlan {
    constructor({
        id = null,
        profileId = 0,
        summary = '',
        score = 0
    }) {
        this.id = id;
        this.profileId = profileId;
        this.summary = summary;
        this.score = score;
    }

    static generateUniqueId(existingIds = []) {
        const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
        return maxId + 1;
    }
}