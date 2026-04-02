import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api';

const instance = axios.create({ baseURL });

instance.interceptors.request.use(
  (cfg) => {
    const token = localStorage.getItem('token');
    if (token && cfg.headers) {
      cfg.headers.Authorization = `Bearer ${token}`;
    }
    return cfg;
  },
  (err) => Promise.reject(err),
);

export default instance;
