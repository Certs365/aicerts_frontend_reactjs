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
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    // Response interceptor to handle 401 errors (token expiration)
    instance.interceptors.response.use(
        (response: any) => {
            // Return the response if successful
            return response;
        },
        (error: any) => {
            if (error.response && error.response.status === 401) {
                deleteToken();
                window.location.href = '/'; // Redirect to login page
            }
            return Promise.reject(error); // Reject the error for further handling
        }
    );
};

// Apply interceptors to both instances
configureInterceptors(postLoginUserInstance);
configureInterceptors(postLoginAdminInstance);

export { postLoginUserInstance, postLoginAdminInstance };
