import { TrackinggoalEntity } from './tracking-goal.entity.js';
import { MacronutrientValuesEntity } from './Macronutrient-values.entity.js';
import { MealPlanEntryEntity } from './meal-plan-entry.entity.js';

/**
 * Represents a tracking record for a specific day.
 */
export class Tracking {
    /**
     * @param {Object} params
     * @param {number} [params.id=0]
     * @param {string} [params.date='']
     * @param {number} [params.userId=0]
     * @param {TrackinggoalEntity} [params.trackingGoal=new TrackinggoalEntity()]
     * @param {MacronutrientValuesEntity} [params.consumedMacros=new MacronutrientValuesEntity()]
     * @param {Array<Object>} [params.mealPlanEntries=[]]
     * @param {string} [params.createdAt='']
     * @param {string} [params.updatedAt='']
     */
    constructor({
                    id = 0,
                    date = '',
                    userId = 0,
                    trackingGoal = new TrackinggoalEntity(),
                    consumedMacros = new MacronutrientValuesEntity(),
                    mealPlanEntries = [],
                    createdAt = '',
                    updatedAt = ''
                } = {}) {
        this.id = id;
        this.date = date;
        this.userId = userId;
        this.trackingGoal = trackingGoal;
        this.consumedMacros = consumedMacros;
        this.mealPlanEntries = mealPlanEntries.map(entry => new MealPlanEntryEntity(entry));
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
