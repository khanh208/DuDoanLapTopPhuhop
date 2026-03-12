import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Thay đổi theo port backend của bạn

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

export const getFormOptions = () => api.get('/form-options');
export const runRecommendation = (data) => api.post('/recommendations/run', data);
export const getDashboard = (key) => api.get(`/recommendations/${key}/dashboard`);
export const getLaptops = () => api.get('/laptops');
// Admin APIs
export const uploadLaptopData = (formData) => api.post('/admin/imports/laptop-data', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export default api;