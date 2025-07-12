/**
 * Represents a user's nutritional goal.
 */
export class Trackinggoal {
    /**
     * @param {Object} params
     * @param {number} [params.id=0]
     * @param {string} [params.name='']
     * @param {string} [params.description='']
     * @param {number} [params.targetCalories=0]
     * @param {number} [params.targetProtein=0]
     * @param {number} [params.targetCarbs=0]
     * @param {number} [params.targetFats=0]
     */
    constructor({
                    id = 0,
                    name = '',
                    description = '',
                    targetCalories = 0,
                    targetProtein = 0,
                    targetCarbs = 0,
                    targetFats = 0
                } = {}) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.targetCalories = targetCalories;
        this.targetProtein = targetProtein;
        this.targetCarbs = targetCarbs;
        this.targetFats = targetFats;
    }
}
