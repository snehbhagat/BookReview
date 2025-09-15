import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/", // adjust if your backend uses a different port or prefix
  withCredentials: false,
});

api.interceptors.request.use(config => {
  try {
    const raw = localStorage.getItem('auth');
    if (raw) {
      const { token } = JSON.parse(raw);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

export default api;
