import httpInstance from "@/shared/services/http.instance.js";

export class ProfileService {
    get resourceEndpoint() {
        return import.meta.env.VITE_PROFILES_ENDPOINT_PATH;
    }

    getAll() {
        return httpInstance.get(this.resourceEndpoint)
            .then(response => response.data)
            .catch(error => {
                console.error('Error fetching profiles:', error);
                throw error;
            });
    }

    getById(id) {
        return httpInstance.get(`${this.resourceEndpoint}/${id}`)
            .then(response => response.data);
    }

    getByUserId(userId) {
        return httpInstance.get(`${this.resourceEndpoint}/by-user/${userId}`)
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

    addAllergy(profileId, allergyName) {
        return httpInstance.post(`${this.resourceEndpoint}/${profileId}/allergies`, {
            allergyName: allergyName
        })
            .then(response => response.data)
            .catch(error => {
                console.error('Error adding allergy:', error);
                throw error;
            });
    }

    removeAllergy(profileId, allergyName) {
        return httpInstance.delete(`${this.resourceEndpoint}/${profileId}/allergies`, {
            data: { allergyName: allergyName }
        })
            .then(response => response.data)
            .catch(error => {
                console.error('Error removing allergy:', error);
                throw error;
            });
    }
}
