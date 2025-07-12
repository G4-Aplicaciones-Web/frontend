// http.instance.js
import axios from 'axios';

const httpInstance = axios.create({
    baseURL: 'http://localhost:5037/api/v1',
});

httpInstance.interceptors.request.use(config => {
    const token = localStorage.getItem('token'); // O como lo guardes
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default httpInstance;