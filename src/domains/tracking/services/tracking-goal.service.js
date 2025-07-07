/**
 * @class TrackingGoalService
 * @description Service class for handling tracking goals
 */
export class TrackingGoalService {
    /** @type {string} The API endpoint for tracking goals */
    resourceEndpoint = import.meta.env.VITE_TRACKING_GOALS_ENDPOINT_PATH;

    /**
     * Creates a new tracking goal
     * @param {Object} resource - The tracking goal object to create
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to the created goal
     */
    create(resource) {
        return httpInstance.post(this.resourceEndpoint, resource);
    }

    /**
     * Retrieves tracking goal by user ID
     * @param {number} userId - The user ID
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to the user's tracking goal
     */
    getByUserId(userId) {
        return httpInstance.get(`${this.resourceEndpoint}/user/${userId}`);
    }

    /**
     * Gets target macronutrients by tracking goal ID
     * @param {number} goalId - The tracking goal ID
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to target macros
     */
    getTargetMacros(goalId) {
        return httpInstance.get(`${this.resourceEndpoint}/${goalId}/target-macros`);
    }
}