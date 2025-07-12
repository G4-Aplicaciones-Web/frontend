import httpInstance from "@/shared/services/http.instance.js";

export class ActivityLevelService {
    get resourceEndpoint() {
        return import.meta.env.VITE_ACTIVITY_LEVEL_ENDPOINT_PATH;
    }

    getAll(){
        return httpInstance.get(this.resourceEndpoint)
            .then(response => {
                console.log('Objectives response:', response.data);
                return response.data;
            })
            .catch(error => {
                console.error('Error fetching activity levels:', error);
                throw error;
            })
    }

    getById(id){
        return httpInstance.get(`${this.resourceEndpoint}/${id}`)
            .then(response => response.data);
    }

    create(resource){
        return httpInstance.post(this.resourceEndpoint, resource)
            .then(response => response.data);
    }
}