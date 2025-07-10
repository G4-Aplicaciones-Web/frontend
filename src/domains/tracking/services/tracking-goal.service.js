import httpInstance from "@/shared/services/http.instance.js";

/**
 * @class TrackingGoalService
 * @description Service for managing tracking goals and their macronutrient targets.
 */
export class TrackingGoalService {
    /** @type {string} */
    resourceEndpoint = import.meta.env.VITE_TRACKING_GOAL_ENDPOINT_PATH;

    /**
     * Gets the tracking goal of a user by user ID
     * @param {number} userId - The user ID
     * @returns {Promise<import('axios').AxiosResponse<any>>}
     */
    getByUserId(userId) {
        return httpInstance.get(`${this.resourceEndpoint}/user/${userId}`);
    }

    /**
     * Gets the target macronutrients for a given tracking goal ID
     * @param {number} trackingGoalId - The tracking goal ID
     * @returns {Promise<import('axios').AxiosResponse<any>>}
     */
    getTargetMacros(trackingGoalId) {
        return httpInstance.get(`${this.resourceEndpoint}/${trackingGoalId}/target-macros`);
    }

    /**
     * Creates a new tracking goal
     * @param {Object} resource - Tracking goal creation payload
     * @param {number} resource.userId - ID of the user
     * @param {Object} resource.targetMacros - Target macronutrient values
     * @param {number} resource.targetMacros.calories
     * @param {number} resource.targetMacros.carbs
     * @param {number} resource.targetMacros.proteins
     * @param {number} resource.targetMacros.fats
     * @returns {Promise<import('axios').AxiosResponse<any>>}
     */
    create(resource) {
        return httpInstance.post(this.resourceEndpoint, resource);
    }
}
