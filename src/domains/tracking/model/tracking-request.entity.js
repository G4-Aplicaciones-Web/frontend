/**
 * DTO for creating a new tracking entry.
 */
export class CreateTrackingRequest {
    /**
     * @param {Object} params
     * @param {number} [params.userId=0]
     * @param {string} [params.date='']
     * @param {number} [params.trackingGoalId=0]
     */
    constructor({
                    userId = 0,
                    date = '',
                    trackingGoalId = 0
                } = {}) {
        this.userId = userId;
        this.date = date;
        this.trackingGoalId = trackingGoalId;
    }
}
