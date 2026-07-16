import { useState } from "react";
import apiClient from "../api/client";

export default function useJobSearch() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchJobs = async (role, location, mode = "any") => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await apiClient.get("/jobs/search", {
        params: {
          role,
          location,
          mode,
        },
      });
      setData(response.data);
      return response.data;
    } catch (err) {
      console.error("Job search error:", err);
      const errMsg = err.response?.data?.detail?.error?.message || err.message || "Failed to search job listings.";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    setData,
    jobs: data?.results ?? [],
    isLoading,
    error,
    searchJobs,
  };
}
