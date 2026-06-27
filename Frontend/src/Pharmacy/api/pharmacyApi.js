import axios from "axios";
import store from "../../redux/store";

const pharmacyApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api`,
  timeout: 15000,
});

pharmacyApi.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

pharmacyApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default pharmacyApi;
