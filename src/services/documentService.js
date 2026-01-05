import axios from "axios";
import { getToken } from "../utils/auth";

const API_URL = "http://127.0.0.1:8000/api";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to include token
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getDocuments = async (params = {}) => {
  const queryParams = new URLSearchParams();
  
  if (params.status) {
    queryParams.append("status", params.status);
  }
  if (params.search) {
    queryParams.append("q", params.search);
  }
  if (params.start_date) {
    queryParams.append("start_date", params.start_date);
  }
  if (params.end_date) {
    queryParams.append("end_date", params.end_date);
  }
  if (params.page) {
    queryParams.append("page", params.page);
  }
  if (params.page_size) {
    queryParams.append("page_size", params.page_size);
  }

  const queryString = queryParams.toString();
  const url = `/documents/${queryString ? `?${queryString}` : ""}`;
  
  return apiClient.get(url);
};

export const getDocumentById = async (documentId) => {
  return apiClient.get(`/documents/${documentId}/`);
};

