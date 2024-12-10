import axios from 'axios';
import { getToken, deleteToken } from './ManageToken';

const postLoginUserInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL_USER,
    headers: {
        'Content-Type': 'application/json',
    },
});

const postLoginAdminInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Function to configure interceptors
const configureInterceptors = (instance: any) => {
    // Request interceptor to set the Authorization token
    instance.interceptors.request.use((config: any) => {
        config.headers.Authorization = `Bearer ${getToken()}`;
        return config;
    });

    // Response interceptor to handle 401 errors (token expiration)
    instance.interceptors.response.use(
        (response: any) => response,
        (error: any) => {
            if (error.response && error.response.status === 401) {
                deleteToken();
                window.location.href = '/';
            }
            return Promise.reject(error);
        }
    );
};

// Apply interceptors to both instances
configureInterceptors(postLoginUserInstance);
configureInterceptors(postLoginAdminInstance);

export { postLoginUserInstance, postLoginAdminInstance };
