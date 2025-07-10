import httpInstance from "@/shared/services/http.instance.js";
import { TrackingGoalService } from "./tracking-goal.service.js";
import { MealPlanEntryService } from "./meal-plan-entry.service.js";

/**
 * @class TrackingService
 * @description Service class for handling CRUD operations on tracking (daily containers)
 */
export class TrackingService {
    /**
     * @type {string}
     * @description The base API endpoint for tracking
     */
    resourceEndpoint = import.meta.env.VITE_TRACKING_ENDPOINT_PATH;

    constructor() {
        this.trackingGoalService = new TrackingGoalService();
        this.mealPlanEntryService = new MealPlanEntryService();
    }

    /**
     * Creates a new tracking for a user
     * @param {Object} resource - The tracking object to create
     * @param {number} resource.userId - The user ID
     * @param {string} resource.date - The tracking date (YYYY-MM-DD)
     * @param {number} resource.trackingGoalId - The associated tracking goal ID
     * @returns {Promise<import('axios').AxiosResponse<any>>}
     */
    create(resource) {
        return httpInstance.post(this.resourceEndpoint, resource);
    }

    /**
     * Retrieves tracking entries by user ID
     * @param {number} userId - The user ID
     * @returns {Promise<import('axios').AxiosResponse<any>>}
     */
    getByUserId(userId) {
        return httpInstance.get(`${this.resourceEndpoint}/user/${userId}`);
    }

    /**
     * Gets consumed macronutrients for a specific tracking entry
     * @param {number} trackingId - The tracking ID
     * @returns {Promise<import('axios').AxiosResponse<any>>}
     */
    getConsumedMacros(trackingId) {
        return httpInstance.get(`${this.resourceEndpoint}/macronutrients/consumed/tracking/${trackingId}`);
    }

    /**
     * Gets tracking goal by user ID (delegated to TrackingGoalService)
     * @param {number} userId - The user ID
     * @returns {Promise<import('axios').AxiosResponse<any>>}
     */
    getTrackingGoalByUserId(userId) {
        return this.trackingGoalService.getByUserId(userId);
    }

    /**
     * Gets all meal plan entries for a specific tracking ID (delegated to MealPlanEntryService)
     * @param {number} trackingId - The tracking ID
     * @returns {Promise<import('axios').AxiosResponse<any>>}
     */
    getAllMealsByTrackingId(trackingId) {
        return this.mealPlanEntryService.getAllByTrackingId(trackingId);
    }

    /**
     * Creates a meal plan entry for a tracking (delegated to MealPlanEntryService)
     * @param {number} trackingId - The tracking ID
     * @param {Object} resource - The meal plan entry data
     * @returns {Promise<import('axios').AxiosResponse<any>>}
     */
    createMealPlanEntry(trackingId, resource) {
        return this.mealPlanEntryService.create(trackingId, resource);
    }

    /**
     * Updates a meal plan entry (delegated to MealPlanEntryService)
     * @param {number} mealPlanEntryId - The meal plan entry ID
     * @param {Object} resource - The updated data
     * @returns {Promise<import('axios').AxiosResponse<any>>}
     */
    updateMealPlanEntry(mealPlanEntryId, resource) {
        return this.mealPlanEntryService.update(mealPlanEntryId, resource);
    }

    /**
     * Removes a meal plan entry (delegated to MealPlanEntryService)
     * @param {number} trackingId - The tracking ID
     * @param {number} mealPlanEntryId - The meal plan entry ID
     * @returns {Promise<import('axios').AxiosResponse<any>>}
     */
    removeMealPlanEntry(trackingId, mealPlanEntryId) {
        return this.mealPlanEntryService.remove(trackingId, mealPlanEntryId);
    }
}

// Exportar la clase para instanciar cuando sea necesario
export default TrackingService;