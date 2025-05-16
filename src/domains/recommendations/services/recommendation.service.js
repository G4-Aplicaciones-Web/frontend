import httpInstance from "@/shared/services/http.instance.js";

export class RecommendationService {
    /**
     * @returns {string} The complete API endpoint for recommendations
     */
    get resourceEndpoint() {
        return import.meta.env.VITE_RECOMMENDATIONS_ENDPOINT_PATH;
    }

    getAll() {
        return httpInstance.get(this.resourceEndpoint)
            .then(response => response.data)
            .catch(error => {
                console.error('Error fetching recommendations:', error);
                throw error;
            });
    }

    getById(id) {
        return httpInstance.get(`${this.resourceEndpoint}/${id}`)
            .then(response => response.data);
    }

    create(resource) {
        return httpInstance.post(this.resourceEndpoint, resource)
            .then(response => response.data);
    }

    update(id, resource) {
        return httpInstance.put(`${this.resourceEndpoint}/${id}`, resource)
            .then(response => response.data);
    }

    delete(id) {
        return httpInstance.delete(`${this.resourceEndpoint}/${id}`);
    }

    getByReason(reason) {
        return httpInstance.get(`${this.resourceEndpoint}?reason=${encodeURIComponent(reason)}`)
            .then(response => response.data);
    }
}