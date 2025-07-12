import httpInstance from "@/shared/services/http.instance.js";

/**
 * @class RecommendationService
 * @description Service for managing recommendations with DDD approach
 */
export class RecommendationService {
    /** @type {string} The API endpoint for recommendations */
    resourceEndpoint = import.meta.env.VITE_RECOMMENDATIONS_ENDPOINT_PATH;

    /**
     * Get all recommendations
     * @returns {Promise<Array>} Promise with all recommendations
     */
    getAll() {
        return httpInstance.get(this.resourceEndpoint)
            .then(response => response.data)
            .catch(error => {
                console.error('Error fetching recommendations:', error);
                throw error;
            });
    }

    /**
     * Get recommendation by ID
     * @param {number} id - Recommendation ID
     * @returns {Promise<Object>} Promise with recommendation data
     */
    getById(id) {
        return httpInstance.get(`${this.resourceEndpoint}/${id}`)
            .then(response => response.data)
            .catch(error => {
                console.error('Error fetching recommendation:', error);
                throw error;
            });
    }

    /**
     * Get recommendations by user ID
     * @param {long} userId - The user ID (long)
     * @returns {Promise<Array>} Promise with user recommendations
     */
    getByUserId(userId) {
        return httpInstance.get(`${this.resourceEndpoint}/user/${userId}`)
            .then(response => response.data)
            .catch(error => {
                console.error('Error fetching user recommendations:', error);
                throw error;
            });
    }

    /**
     * Create a new recommendation
     * @param {CreateRecommendationRequest} request - Recommendation creation request
     * @returns {Promise<Object>} Promise with created recommendation data
     */
    create(request) {
        return httpInstance.post(this.resourceEndpoint, request)
            .then(response => response.data)
            .catch(error => {
                console.error('Error creating recommendation:', error);
                throw error;
            });
    }

    /**
     * Create a base recommendation (template)
     * @param {CreateRecommendationRequest} request - Base recommendation creation request
     * @returns {Promise<Object>} Promise with created base recommendation data
     */
    createBase(request) {
        const payload = {
            templateId: request.templateId,
            reason: request.reason,
            notes: request.notes,
            timeOfDay: request.timeOfDay, // String como espera el backend
            score: request.score,
            status: request.status // String como espera el backend
        };

        return httpInstance.post(`${this.resourceEndpoint}/base`, payload)
            .then(response => response.data)
            .catch(error => {
                console.error('Error creating base recommendation:', error);
                throw error;
            });
    }

    /**
     * Auto-assign recommendations to a user
     * @param {AutoAssignRecommendationsRequest} request - Auto-assign request
     * @returns {Promise<Array>} Promise with assigned recommendations
     */
    autoAssignRecommendations(request) {
        return httpInstance.post(`${this.resourceEndpoint}/auto-assign`, request)
            .then(response => response.data)
            .catch(error => {
                console.error('Error auto-assigning recommendations:', error);
                throw error;
            });
    }

    /**
     * Update an existing recommendation
     * @param {number} id - Recommendation ID
     * @param {UpdateRecommendationRequest} request - Recommendation update request
     * @returns {Promise<Object>} Promise with updated recommendation data
     */
    update(id, request) {
        const payload = {
            reason: request.reason,
            notes: request.notes,
            timeOfDay: request.timeOfDay, // String como espera el backend
            score: request.score,
            status: request.status // String como espera el backend
        };

        return httpInstance.put(`${this.resourceEndpoint}/${id}`, payload)
            .then(response => response.data)
            .catch(error => {
                console.error('Error updating recommendation:', error);
                throw error;
            });
    }

    /**
     * Delete a recommendation
     * @param {number} id - Recommendation ID
     * @returns {Promise<void>} Promise indicating success
     */
    delete(id) {
        return httpInstance.delete(`${this.resourceEndpoint}/${id}`)
            .catch(error => {
                console.error('Error deleting recommendation:', error);
                throw error;
            });
    }
}