export class Profile {
    constructor({
                    id,
                    fullName,
                    gender,
                    height,
                    weight,
                    score,
                    activityLevelId,
                    objectiveId,
                    allergies = [],
                }) {
        this.id = id;
        this.fullName = fullName;
        this.gender = gender;
        this.height = height;
        this.weight = weight;
        this.score = score;
        this.activityLevelId = activityLevelId;
        this.objectiveId = objectiveId;
        this.allergies = allergies;
    }
}
