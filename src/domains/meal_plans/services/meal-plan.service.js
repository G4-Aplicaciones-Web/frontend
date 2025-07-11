import httpInstance from "@/shared/services/http.instance.js";

export class MealPlanService {

    resourceEndpoint = import.meta.env.VITE_MEAL_PLAN_ENDPOINT_PATH;


    create(resource) {
        return httpInstance.post(this.resourceEndpoint, resource);
    }


    getByMealPlanId(mealPlanId) {
        return httpInstance.get(`${this.resourceEndpoint}/${mealPlanId}`);
    }



}