import httpInstance from "@/shared/services/http.instance.js";

/**
 * @class TrackingService
 * @description Service class for handling CRUD operations on tracking (daily containers)
 */
export class TrackingService {
    /** @type {string} The API endpoint for tracking */
    resourceEndpoint = import.meta.env.VITE_TRACKING_ENDPOINT_PATH;

    /**
     * Creates a new tracking for a user
     * @param {Object} resource - The tracking object to create
     * @param {number} resource.userId - The user ID
     * @param {string} resource.date - The tracking date
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to the created tracking
     */
    create(resource) {
        return httpInstance.post(this.resourceEndpoint, resource);
    }

    /**
     * Retrieves tracking by user ID
     * @param {number} userId - The user ID
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to the user's tracking
     */
    getByUserId(userId) {
        return httpInstance.get(`${this.resourceEndpoint}/user/${userId}`);
    }

    /**
     * Gets consumed macronutrients by tracking ID
     * @param {number} trackingId - The tracking ID
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to consumed macros
     */
    getConsumedMacros(trackingId) {
        return httpInstance.get(`${this.resourceEndpoint}/macronutrients/consumed/tracking/${trackingId}`);
    }
}