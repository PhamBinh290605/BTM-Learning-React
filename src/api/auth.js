import axios from 'axios';

// Lấy URL từ file .env
const API_URL = import.meta.env.VITE_API_URL;

export const loginApi = (email, password) => {
    return axios.post(`${API_URL}/auth/log-in`, { email, password });
};

export const registerApi = async (userData) => {
    return await axios.post(`${API_URL}/auth/register`, userData);
};

export const googleLoginUrl = `${import.meta.env.VITE_API_URL.replace('/api/v1', '')}/oauth2/authorization/google`;