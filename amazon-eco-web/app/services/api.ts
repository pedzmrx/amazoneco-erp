import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://obscure-guide-7v567vjv5p462wqp4-3333.app.github.dev',
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('@AmazonEco:token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});