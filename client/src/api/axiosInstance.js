import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const tokenString = sessionStorage.getItem("accessToken");
    let accessToken = "";
    
    if (tokenString && tokenString !== "undefined" && tokenString !== "null") {
      try {
        accessToken = JSON.parse(tokenString) || "";
      } catch (error) {
        accessToken = tokenString; // If JSON.parse fails, use the raw string
      }
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (err) => Promise.reject(err)
);

export default axiosInstance;
