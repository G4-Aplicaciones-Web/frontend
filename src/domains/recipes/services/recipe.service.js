import httpInstance from "@/shared/services/http.instance.js";

export class RecipeService {
    /**
     * @returns {string} The complete API endpoint for recipes
     */
    get resourceEndpoint() {
        return import.meta.env.VITE_RECIPES_ENDPOINT_PATH;
    }

    getAll() {
        return httpInstance.get(this.resourceEndpoint)
            .then(response => response.data)
            .catch(error => {
                console.error('Error fetching recipes:', error);
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

}