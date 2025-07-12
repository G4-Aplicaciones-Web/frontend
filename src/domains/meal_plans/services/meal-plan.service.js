import httpInstance from "@/shared/services/http.instance.js";

export class MealPlanService {

    resourceEndpoint = import.meta.env.VITE_MEAL_PLAN_ENDPOINT_PATH;

    getAllMealPlans(resource) {
        return httpInstance.get(this.resourceEndpoint);
    }

    create(resource) {
        return httpInstance.post(this.resourceEndpoint, resource);
    }

    getByMealPlanId(mealPlanId) {
        return httpInstance.get(`${this.resourceEndpoint}/${mealPlanId}`);
    }

    updateMealPlan(mealPlanId, resource) {
        return httpInstance.put(`${this.resourceEndpoint}/${mealPlanId}`, resource);
    }

    deleteMealPlan(mealPlanId) {
        return httpInstance.delete(`${this.resourceEndpoint}/${mealPlanId}`);
    }

}