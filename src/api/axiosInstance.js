import axios from 'axios';
import { baseURL } from '../config/apiConfig'; // Import baseURL from apiConfig

const axiosInstance = axios.create({
    baseURL, // Use the imported baseURL
    timeout: 10000, // Optional: Set a timeout for requests
    headers: {
        'Content-Type': 'application/json',
        // Add any other headers you need
    },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance; 