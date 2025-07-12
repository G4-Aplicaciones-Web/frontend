import httpInstance from "@/shared/services/http.instance.js";

export class ObjectiveService {
    get resourceEndpoint() {
        return import.meta.env.VITE_OBJECTIVE_ENDPOINT_PATH;
    }

    getAll(){
        return httpInstance.get(this.resourceEndpoint)
            .then(response => {
                console.log('Objectives response:', response.data);
                return response.data;
            })
            .catch(error => {
                console.error('Error fetching objectives:', error);
                throw error;
            })
    }

    getById(id){
        return httpInstance.get(`${this.resourceEndpoint}/${id}`)
            .then(response => response.data);
    }

    create(resource){
        return httpInstance.post(this.resourceEndpoint, resource)
    }
}