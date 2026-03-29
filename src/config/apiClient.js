import axios from "axios";
import { API_URL } from "./api";

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API Error:", err);
    return Promise.reject(err);
  }
);

export default apiClient;
