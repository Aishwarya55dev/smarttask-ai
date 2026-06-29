
import axios from "axios";
import API_BASE from "../config";

const API = `${API_BASE}/api/ai`;

export const getProductivityInsights = async () => {
  const response = await axios.get(`${API}/productivity-insights`);
  return response.data;
};