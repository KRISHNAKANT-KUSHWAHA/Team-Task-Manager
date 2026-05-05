import axios from "axios";

const api = axios.create({
  // baseURL: import.meta.env.VITE_API_URL || "https://team-task-manager-8wdc.onrender.com"
  baseURL: "https://team-task-manager-8wdc.onrender.com/api"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
