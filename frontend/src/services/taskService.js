import axios from "axios";
import API_BASE from "../config";

const API = `${API_BASE}/api/tasks`;

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getTasks = async () => {
  const response = await axios.get(API, authHeader());
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await axios.post(API, taskData, authHeader());
  return response.data;
};

export const deleteTask = async (id) => {
  await axios.delete(`${API}/${id}`, authHeader());
};

export const toggleTaskStatus = async (id) => {
  const response = await axios.patch(`${API}/${id}/toggle`, {}, authHeader());
  return response.data;
};