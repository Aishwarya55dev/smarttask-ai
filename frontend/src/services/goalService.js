import axios from "axios";
import API_BASE from "../config";

const API = `${API_BASE}/api/goals`;

export const getGoals = async () => {
  const response = await axios.get(API);
  return response.data;
};

export const createGoal = async (goal) => {
  const response = await axios.post(API, goal);
  return response.data;
};

export const updateProgress = async (id, progress) => {
  const response = await axios.patch(`${API}/${id}`, {
    progress,
  });
  return response.data;
};

export const deleteGoal = async (id) => {
  await axios.delete(`${API}/${id}`);
};