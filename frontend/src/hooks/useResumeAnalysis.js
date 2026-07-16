import { useState } from "react";
import apiClient from "../api/client";

export default function useResumeAnalysis() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeResume = async (file, targetRole) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("target_role", targetRole);

    try {
      const response = await apiClient.post("/resume/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setData(response.data);
      return response.data;
    } catch (err) {
      console.error("Resume analysis error:", err);
      const errMsg = err.response?.data?.detail?.error?.message || err.message || "Failed to analyze resume.";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    setData,
    atsScore: data?.ats_score ?? null,
    issues: data?.issues ?? [],
    parsedSections: data?.parsed_sections ?? [],
    isLoading,
    error,
    analyzeResume,
  };
}
