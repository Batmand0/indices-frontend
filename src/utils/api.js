import axios from 'axios';
import Cookies from 'js-cookie';
const token = Cookies.get('access_token');
const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Accept-Language': 'es',
    'Authorization': `Bearer ${token}`,
  },
});

API.interceptors.request.use(function(config) {
  const token  = Cookies.get('access_token');
  config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});
export default API;