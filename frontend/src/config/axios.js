import axios from 'axios';

export const axiosi = axios.create({
    withCredentials: true,
    baseURL: process.env.REACT_APP_BASE_URL || 'http://localhost:8000'
});

// Interceptor to guarantee error.response exists for all API calls
axiosi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            error.response = {
                data: {
                    message: error.message || 'Unable to connect to backend server. Please verify the server is running on port 8000.'
                },
                status: 503
            };
        }
        return Promise.reject(error);
    }
);