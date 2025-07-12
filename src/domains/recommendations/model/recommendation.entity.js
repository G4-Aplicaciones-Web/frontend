/**
 * @class Recommendation
 * @description Represents a nutritional recommendation entity within the meal planning system
 */
export class Recommendation {
    /**
     * Creates a new Recommendation instance
     * @param {Object} params - The recommendation initialization parameters
     * @param {number} [params.id=0] - Unique identifier for the recommendation
     * @param {string} [params.reason=''] - The reason/purpose for the recommendation
     * @param {string} [params.time_of_day=''] - Time of day the recommendation applies to (morning/afternoon/night/all day)
     * @param {string} [params.created_at=''] - ISO timestamp of when the recommendation was created
     * @param {string} [params.notes=''] - Additional notes about the recommendation
     * @param {number} [params.score=0] - Numerical score rating of the recommendation (1-10)
     * @param {string} [params.status=''] - Current status of the recommendation (active/pending/inactive)
     */
    constructor({
                    id = 0,
                    reason = '',
                    time_of_day = '',
                    created_at = '',
                    notes = '',
                    score = 0,
                    status = ''
                } = {}) {
        /**
         * @type {number}
         * @description Unique identifier for the recommendation
         */
        this.id = id;

        /**
         * @type {string}
         * @description The reason/purpose for the recommendation
         */
        this.reason = reason;

        /**
         * @type {string}
         * @description Time of day the recommendation applies to
         * @enum {('morning'|'afternoon'|'night'|'all day')}
         */
        this.time_of_day = time_of_day;

        /**
         * @type {string}
         * @description ISO timestamp of creation date
         */
        this.created_at = created_at;

        /**
         * @type {string}
         * @description Additional notes about the recommendation
         */
        this.notes = notes;

        /**
         * @type {number}
         * @description Numerical score rating (1-10)
         * @min 1
         * @max 10
         */
        this.score = score;

        /**
         * @type {string}
         * @description Current status of the recommendation
         * @enum {('active'|'pending'|'inactive')}
         */
        this.status = status;
    }
}