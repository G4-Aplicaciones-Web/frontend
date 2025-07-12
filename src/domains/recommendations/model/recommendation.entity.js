
/**
 * @class Recommendation
 * @description Represents a nutritional recommendation entity within the meal planning system
 */
export class Recommendation {
    /**
     * Creates a new Recommendation instance
     * @param {Object} params - The recommendation initialization parameters
     * @param {number} [params.id=0] - Unique identifier for the recommendation
     * @param {long} [params.userId=0] - User ID associated with the recommendation (long)
     * @param {number} [params.templateId=0] - Template ID for the recommendation
     * @param {Object} [params.template=null] - Template object with title and content
     * @param {string} [params.reason=''] - The reason/purpose for the recommendation
     * @param {string} [params.notes=''] - Additional notes about the recommendation
     * @param {number} [params.timeOfDay=0] - Time of day (0=Morning, 1=Afternoon, 2=Evening, 3=AllDay)
     * @param {number} [params.score=0] - Numerical score rating of the recommendation (1-10)
     * @param {number} [params.status=0] - Current status (0=Pending, 1=Active, 2=Inactive)
     * @param {string} [params.assignedAt=''] - ISO timestamp of when assigned
     */
    constructor({
                    id = 0,
                    userId = 0,
                    templateId = 0,
                    template = null,
                    reason = '',
                    notes = '',
                    timeOfDay = 0,
                    score = 0,
                    status = 0,
                    assignedAt = ''
                } = {}) {
        this.id = id;
        this.userId = userId;
        this.templateId = templateId;
        this.template = template;
        this.reason = reason;
        this.notes = notes;
        this.timeOfDay = timeOfDay;
        this.score = score;
        this.status = status;
        this.assignedAt = assignedAt;
    }

    /**
     * Domain methods for displaying values (matching backend enums exactly)
     */
    get mappedTimeOfDay() {
        const backendToFrontend = {
            0: 'morning',
            1: 'afternoon',
            2: 'evening',
            3: 'all_day',
            'Morning': 'morning',
            'Afternoon': 'afternoon',
            'Evening': 'evening',
            'AllDay': 'all_day'
        };
        return backendToFrontend[this.timeOfDay] || 'morning';
    }

    get mappedStatus() {
        const backendToFrontend = {
            0: 'pending',
            1: 'active',
            2: 'inactive',
            'Pending': 'pending',
            'Active': 'active',
            'Inactive': 'inactive'
        };
        return backendToFrontend[this.status] || 'pending';
    }

    /**
     * Domain method to check if recommendation is pending
     */
    isPending() {
        return this.status === 0;
    }

    /**
     * Domain method to check if recommendation is active
     */
    isActive() {
        return this.status === 1;
    }

    /**
     * Domain method to check if recommendation is inactive
     */
    isInactive() {
        return this.status === 2;
    }

    /**
     * Devuelve el título del template según el templateId de la recomendación.
     * @param {Array} templates - Array de templates con propiedad id y title.
     * @returns {string}
     */
    getTemplateTitleById(templates) {
        if (!Array.isArray(templates)) return 'Sin título';
        const found = templates.find(t => t.id === this.templateId);
        return found?.title || 'Sin título';
    }

    /**
     * Domain method to get formatted assigned date
     */
    getFormattedAssignedDate() {
        if (!this.assignedAt) return 'No especificado';
        return new Date(this.assignedAt).toLocaleString('es-ES');
    }

    /**
     * Convert to backend format for API calls
     */
    toBackendFormat() {
        return {
            id: this.id,
            userId: this.userId,
            templateId: this.templateId,
            reason: this.reason,
            notes: this.notes,
            timeOfDay: this.timeOfDay,
            score: this.score,
            status: this.status,
            assignedAt: this.assignedAt
        };
    }
}

/**
 * @class CreateRecommendationRequest
 * @description DTO for creating a new recommendation (matches backend CreateRecommendationResource)
 */
export class CreateRecommendationRequest {
    /**
     * @param {Object} params
     * @param {long} [params.userId=0] - User ID (long)
     * @param {number} [params.templateId=0] - Template ID
     * @param {string} [params.reason=''] - Reason for the recommendation
     * @param {string} [params.notes=''] - Additional notes
     * @param {string} [params.timeOfDay='Morning'] - Time of day string (Morning, Afternoon, Evening, AllDay)
     * @param {number} [params.score=0] - Score rating
     * @param {string} [params.status='Pending'] - Status string (Pending, Active, Inactive)
     */
    constructor({
                    userId = 0,
                    templateId = 0,
                    reason = '',
                    notes = '',
                    timeOfDay = 'Morning',
                    score = 0,
                    status = 'Pending'
                } = {}) {
        this.userId = userId;
        this.templateId = templateId;
        this.reason = reason;
        this.notes = notes;
        this.timeOfDay = timeOfDay; // String como espera el backend
        this.score = score;
        this.status = status; // String como espera el backend
    }
}

/**
 * @class UpdateRecommendationRequest
 * @description DTO for updating an existing recommendation (matches backend UpdateRecommendationResource)
 */
export class UpdateRecommendationRequest {
    /**
     * @param {Object} params
     * @param {string} [params.reason=''] - Reason for the recommendation
     * @param {string} [params.notes=''] - Additional notes
     * @param {string} [params.timeOfDay='Morning'] - Time of day string
     * @param {number} [params.score=0] - Score rating
     * @param {string} [params.status='Pending'] - Status string
     */
    constructor({
                    reason = '',
                    notes = '',
                    timeOfDay = 'Morning',
                    score = 0,
                    status = 'Pending'
                } = {}) {
        this.reason = reason;
        this.notes = notes;
        this.timeOfDay = timeOfDay; // String como espera el backend
        this.score = score;
        this.status = status; // String como espera el backend
    }
}

/**
 * @class AutoAssignRecommendationsRequest
 * @description DTO for auto-assigning recommendations to a user
 */
export class AutoAssignRecommendationsRequest {
    /**
     * @param {Object} params
     * @param {long} [params.userId=0] - User ID to assign recommendations to (long)
     * @param {number} [params.count=3] - Number of recommendations to assign
     */
    constructor({
                    userId = 0,
                    count = 3
                } = {}) {
        this.userId = userId;
        this.count = count;
    }
}