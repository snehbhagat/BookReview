import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/", // adjust if your backend uses a different port or prefix
  withCredentials: true,
});

export default api;