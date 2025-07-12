import httpInstance from "@/shared/services/http.instance.js";

/**
 * @class RecommendationTemplateService
 * @description Service for managing recommendation templates
 */
export class RecommendationTemplateService {
    /** @type {string} The API endpoint for recommendation templates */
    resourceEndpoint = '/recommendation-templates';

    /**
     * Get all recommendation templates
     * @returns {Promise<Array>} Promise with all templates
     */
    getAll() {
        return httpInstance.get(this.resourceEndpoint)
            .then(response => response.data)
            .catch(error => {
                console.error('Error fetching recommendation templates:', error);
                throw error;
            });
    }

    /**
     * Get recommendation template by ID
     * @param {number} id - Template ID
     * @returns {Promise<Object>} Promise with template data
     */
    getById(id) {
        return httpInstance.get(`${this.resourceEndpoint}/${id}`)
            .then(response => response.data)
            .catch(error => {
                console.error('Error fetching recommendation template:', error);
                throw error;
            });
    }

    /**
     * Create a new recommendation template
     * @param {CreateRecommendationTemplateRequest} request - Template creation request
     * @returns {Promise<Object>} Promise with created template data
     */
    create(request) {
        return httpInstance.post(this.resourceEndpoint, {
            title: request.title,
            content: request.content
        })
            .then(response => response.data)
            .catch(error => {
                console.error('Error creating recommendation template:', error);
                throw error;
            });
    }

    /**
     * Update an existing recommendation template
     * @param {number} id - Template ID
     * @param {CreateRecommendationTemplateRequest} request - Template update request
     * @returns {Promise<Object>} Promise with updated template data
     */
    update(id, request) {
        return httpInstance.put(`${this.resourceEndpoint}/${id}`, {
            title: request.title,
            content: request.content
        })
            .then(response => response.data)
            .catch(error => {
                console.error('Error updating recommendation template:', error);
                throw error;
            });
    }

    /**
     * Delete a recommendation template
     * @param {number} id - Template ID
     * @returns {Promise<void>} Promise indicating success
     */
    delete(id) {
        return httpInstance.delete(`${this.resourceEndpoint}/${id}`)
            .catch(error => {
                console.error('Error deleting recommendation template:', error);
                throw error;
            });
    }
}