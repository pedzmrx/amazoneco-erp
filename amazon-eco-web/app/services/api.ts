import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://wet-wasp-18.loca.lt', 
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