import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api"; // backend URL

export const loginUser = async (data) => {
  return axios.post(`${API_URL}/login/`, data);
};

export const signupUser = async (data) => {
  return axios.post(`${API_URL}/signup/`, data);
};
