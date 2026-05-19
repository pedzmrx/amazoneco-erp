import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://special-happiness-wr5pvrqr5v75h555j-3000.app.github.dev', 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@amazon-eco:token');
  
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});