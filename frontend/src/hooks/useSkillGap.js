import { useState } from "react";
import apiClient from "../api/client";

export default function useSkillGap() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSkillGap = async (resumeText, targetRole) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await apiClient.post("/skills/gap", {
        resume_text: resumeText,
        target_role: targetRole,
      });
      setData(response.data);
      return response.data;
    } catch (err) {
      console.error("Skill gap analysis error:", err);
      const errMsg = err.response?.data?.detail?.error?.message || err.message || "Failed to fetch skill gap analysis.";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    setData,
    matchedSkills: data?.matched_skills ?? [],
    missingSkills: data?.missing_skills ?? [],
    projectSuggestions: data?.project_suggestions ?? [],
    isLoading,
    error,
    fetchSkillGap,
  };
}
