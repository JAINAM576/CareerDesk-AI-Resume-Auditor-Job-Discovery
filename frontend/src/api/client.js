import axios from "axios";

// Read API base URL from Vite environment variables (fallback to localhost:8000)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 45000, // CrewAI agents can take some time to run
});

export default apiClient;
