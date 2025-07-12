import httpInstance from "@/shared/services/http.instance.js";

export class IngredientService {
    getAll() {
        return httpInstance.get(import.meta.env.VITE_INGREDIENTS_ENDPOINT_PATH)
            .then(res => res.data);
    }
}
