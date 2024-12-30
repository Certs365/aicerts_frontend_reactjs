import axios from 'axios';

// Instance for pre-login user-related requests
const preLoginUserInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL_USER,
});

// Instance for post-login user-related requests
const preLoginAdminInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});


export { preLoginUserInstance, preLoginAdminInstance };
