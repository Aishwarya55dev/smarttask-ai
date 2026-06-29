import axios from "axios";
import API_BASE from "../config";

const API = `${API_BASE}/api/auth`;

export const registerUser = async (name, email, password) => {
  const res = await axios.post(`${API}/register`, { name, email, password });
  return res.data;
};

export const loginUser = async (email, password) => {
  const res = await axios.post(`${API}/login`, { email, password });
  return res.data;
};

export const saveAuth = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const getAuth = () => {
  try {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    return { token, user };
  } catch (error) {
    localStorage.clear();
    return { token: null, user: null };
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};