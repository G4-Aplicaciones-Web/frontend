import httpInstance from "@/shared/services/http.instance.js";

/**
 * @class MealPlanEntryService
 * @description Service for managing meal plan entries related to tracking.
 */
export class MealPlanEntryService {
    /** @type {string} */
    resourceEndpoint = import.meta.env.VITE_MEAL_PLAN_ENTRY_ENDPOINT_PATH;

    /**
     * Creates a new meal plan entry for a given tracking
     * @param {number} trackingId - The tracking ID to which the meal belongs
     * @param {Object} resource - The entry creation payload
     * @param {number} resource.userId
     * @param {number} resource.recipeId
     * @param {string} resource.mealPlanType
     * @param {number} resource.dayNumber
     * @returns {Promise<import('axios').AxiosResponse<any>>}
     */
    create(trackingId, resource) {
        return httpInstance.post(`${this.resourceEndpoint}/tracking/${trackingId}`, resource);
    }

    /**
     * Gets all meal plan entries for a specific tracking ID
     * @param {number} trackingId
     * @returns {Promise<import('axios').AxiosResponse<any>>}
     */
    getAllByTrackingId(trackingId) {
        return httpInstance.get(`${this.resourceEndpoint}/tracking/${trackingId}`);
    }

    /**
     * Updates a specific meal plan entry by its ID
     * @param {number} mealPlanEntryId
     * @param {Object} resource - The updated meal plan entry
     * @returns {Promise<import('axios').AxiosResponse<any>>}
     */
    update(mealPlanEntryId, resource) {
        return httpInstance.put(`${this.resourceEndpoint}/${mealPlanEntryId}`, resource);
    }

    /**
     * Removes a meal plan entry from a tracking
     * @param {number} trackingId
     * @param {number} mealPlanEntryId
     * @returns {Promise<import('axios').AxiosResponse<any>>}
     */
    remove(trackingId, mealPlanEntryId) {
        return httpInstance.delete(`${this.resourceEndpoint}/tracking/${trackingId}/entry/${mealPlanEntryId}`);
    }
}
