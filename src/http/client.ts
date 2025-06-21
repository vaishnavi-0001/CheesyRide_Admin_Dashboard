import axios from 'axios';

console.log('🔥 BACKEND URL:', import.meta.env.VITE_BACKEND_API_URL);
export const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});