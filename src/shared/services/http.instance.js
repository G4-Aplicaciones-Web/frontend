import axios from "axios";

const httpInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // Usará http://localhost:3000
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 10000 // 10 segundos de timeout
});

// Interceptor de solicitudes
httpInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor de respuestas
httpInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    console.error('No autorizado - Redirigiendo a login');
                    window.location.href = '/sign-in';
                    break;
                case 404:
                    console.error('Endpoint no encontrado:', error.config.url);
                    break;
                case 500:
                    console.error('Error del servidor:', error.response.data);
                    break;
                default:
                    console.error('Error HTTP:', error.response.status);
            }
        } else if (error.request) {
            console.error('No se recibió respuesta del servidor');
        } else {
            console.error('Error al configurar la solicitud:', error.message);
        }
        return Promise.reject(error);
    }
);

export default httpInstance;