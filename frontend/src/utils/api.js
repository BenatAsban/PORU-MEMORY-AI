import axios from 'axios';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}`;

const api = axios.create({
    baseURL: API_URL,
});

// Request interceptor - token add பண்ணும்
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log("🔑 Sending token:", token ? "Yes" : "No"); // Debug
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn("⚠️ No token in localStorage");
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;