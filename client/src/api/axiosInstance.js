import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = JSON.parse(
      sessionStorage.getItem("accessToken") || "null"
    );
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

export default axiosInstance;
