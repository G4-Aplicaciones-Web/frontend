import httpInstance from "@/shared/services/http.instance.js";

export class MealPlanService {

    resourceEndpoint = import.meta.env.VITE_MEAL_PLAN_ENDPOINT_PATH;


    getAll() {
        return httpInstance.get(this.resourceEndpoint);
    }

    getById(id) {
        return httpInstance.get(`${this.resourceEndpoint}/${id}`);
    }

    create(resource) {
        return httpInstance.post(this.resourceEndpoint, resource);
    }

    update(id, resource) {
        return httpInstance.put(`${this.resourceEndpoint}/${id}`, resource);
    }

    delete(id) {
        return httpInstance.delete(`${this.resourceEndpoint}/${id}`);
    }

    getByName(profile_id) {
        return httpInstance.get(`${this.resourceEndpoint}?user_id=${profile_id}`);
    }



}