import axios from "axios";

const BASE_URL = "https://phim.nguonc.com/api";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for handling common request functionality
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth tokens or other request modifications here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for handling common response functionality
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle error responses (e.g., 401, 404, 500, etc.)
    return Promise.reject(error);
  }
);