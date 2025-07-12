// src/shared/services/http.instance.js
import axios from 'axios';

const httpInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Agrega el token a cada petición si existe
httpInstance.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken'); // O donde guardes el token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default httpInstance;