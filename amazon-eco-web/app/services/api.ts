import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://cautious-carnival-975r67g755x62977v-3333.app.github.dev',
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