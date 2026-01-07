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

// Create / Upload a new document
export const createDocument = async (payload) => {
  const formData = new FormData();

  formData.append("title", payload.title);
  formData.append("category", payload.category);
  formData.append("project_code", payload.project_code);
  formData.append("document_status", payload.document_status);

  if (payload.file) {
    formData.append("file", payload.file);
  }

  return apiClient.post("/documents/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Get active categories with pagination
export const getCategories = async (params = {}) => {
  const queryParams = new URLSearchParams();

  if (params.page) {
    queryParams.append("page", params.page);
  }
  if (params.page_size) {
    queryParams.append("page_size", params.page_size);
  }

  const queryString = queryParams.toString();
  const url = `/category/${queryString ? `?${queryString}` : ""}`;

  return apiClient.get(url);
};

export const createCategory = async (payload) => {
  return apiClient.post("/category/", payload);
};

export const updateCategory = async (categoryId, payload) => {
  return apiClient.put(`/category/${categoryId}/`, payload);
};

export const deleteCategory = async (categoryId) => {
  return apiClient.delete(`/category/${categoryId}/`);
};

// Get active project codes (site codes) with pagination
export const getProjectCodes = async (params = {}) => {
  const queryParams = new URLSearchParams();

  if (params.page) {
    queryParams.append("page", params.page);
  }
  if (params.page_size) {
    queryParams.append("page_size", params.page_size);
  }

  const queryString = queryParams.toString();
  const url = `/project-code/${queryString ? `?${queryString}` : ""}`;

  return apiClient.get(url);
};

export const createProjectCode = async (payload) => {
  return apiClient.post("/project-code/", payload);
};

export const updateProjectCode = async (projectCodeId, payload) => {
  return apiClient.put(`/project-code/${projectCodeId}/`, payload);
};

export const deleteProjectCode = async (projectCodeId) => {
  return apiClient.delete(`/project-code/${projectCodeId}/`);
};

