/**
 * @class MealPlanEntryService
 * @description Service class for handling CRUD operations on meal plan entries
 */
export class MealPlanEntryService {
    /** @type {string} The API endpoint for meal plan entries */
    resourceEndpoint = import.meta.env.VITE_MEAL_PLAN_ENTRIES_ENDPOINT_PATH;

    /**
     * Creates a new meal plan entry
     * @param {number} trackingId - The tracking ID this entry belongs to
     * @param {Object} resource - The meal plan entry object to create
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to the created entry
     */
    create(trackingId, resource) {
        return httpInstance.post(`${this.resourceEndpoint}/${trackingId}`, resource);
    }

    /**
     * Retrieves all meal plan entries for a tracking
     * @param {number} trackingId - The tracking ID
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to array of meal entries
     */
    getAllByTrackingId(trackingId) {
        return httpInstance.get(`${this.resourceEndpoint}/tracking/${trackingId}`);
    }

    /**
     * Updates an existing meal plan entry
     * @param {number} entryId - The ID of the entry to update
     * @param {Object} resource - The updated entry data
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to the updated entry
     */
    update(entryId, resource) {
        return httpInstance.put(`${this.resourceEndpoint}/${entryId}`, resource);
    }

    /**
     * Deletes a meal plan entry
     * @param {number} trackingId - The tracking ID
     * @param {number} entryId - The ID of the entry to delete
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves when the entry is deleted
     */
    delete(trackingId, entryId) {
        return httpInstance.delete(`${this.resourceEndpoint}/tracking/${trackingId}/entry/${entryId}`);
    }
}