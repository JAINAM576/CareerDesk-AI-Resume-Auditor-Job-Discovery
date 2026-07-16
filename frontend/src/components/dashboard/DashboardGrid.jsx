import React, { useState } from "react";
import AtsScorePanel from "./AtsScorePanel";
import SkillGapPanel from "./SkillGapPanel";
import JobListingsPanel from "./JobListingsPanel";
import ResumePreviewPanel from "./ResumePreviewPanel";
import WordCloudPanel from "./WordCloudPanel";
import Loader from "../common/Loader";
import ErrorState from "../common/ErrorState";
import { Briefcase, MapPin, Clock, FileText, Tag, Award, Heart } from "lucide-react";

export default function DashboardGrid({
  atsState,
  skillsState,
  jobsState,
  targetPreferences,
  uploadedFile
}) {
  const [activeTab, setActiveTab] = useState("ats");

  return (
    <div className="fade-in-up space-y-6">
      {/* Target Info Bar */}
      <div className="glass-card flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-6 md:px-8 border border-white/60">
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-600 border border-blue-500/10 shadow-sm">
            <Briefcase size={22} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600/80 block mb-0.5">
              Target Profile
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
              {targetPreferences.targetRole}
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 md:gap-10 text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
              <MapPin size={16} />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block font-semibold uppercase tracking-wider">
                Location
              </span>
              <span className="text-sm font-semibold text-slate-800">
                {targetPreferences.location}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
              <Clock size={16} />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block font-semibold uppercase tracking-wider">
                Job Mode
              </span>
              <span className="text-sm font-semibold text-slate-800 capitalize">
                {targetPreferences.jobMode}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modern 2-Column Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side Column: Resume Preview */}
        <div className="lg:col-span-5 h-full">
          <ResumePreviewPanel file={uploadedFile} resumeUrl={atsState.data?.resume_url} />
        </div>

        {/* Right Side Column: Feedback Workspace */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Glassmorphic Tabs Selection Bar */}
          <div className="flex gap-1.5 p-1 bg-white/40 border border-white/60 rounded-2xl shadow-sm overflow-x-auto">
            {/* ATS Review Tab */}
            <button
              onClick={() => setActiveTab("ats")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "ats"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
              }`}
            >
              <FileText size={14} />
              ATS Audit
            </button>

            {/* Keyword Density Tab */}
            <button
              onClick={() => setActiveTab("keywords")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "keywords"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
              }`}
            >
              <Tag size={14} />
              Keyword Map
            </button>

            {/* Skill Gaps Tab */}
            <button
              onClick={() => setActiveTab("skills")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "skills"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
              }`}
            >
              <Award size={14} />
              Skill Gaps
            </button>

            {/* Matching Jobs Tab */}
            <button
              onClick={() => setActiveTab("jobs")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "jobs"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
              }`}
            >
              <Briefcase size={14} />
              Job Matches
            </button>
          </div>

          {/* Active Panel Content Container */}
          <div className="flex-grow min-h-[550px]">
            {activeTab === "ats" && (
              <div className="h-full">
                {atsState.isLoading ? (
                  <div className="glass-card h-[550px] flex items-center justify-center p-6 border border-white/60">
                    <Loader title="Evaluating resume formatting and parsing section headers..." />
                  </div>
                ) : atsState.error ? (
                  <div className="glass-card h-[550px] flex items-center justify-center p-6 border border-white/60">
                    <ErrorState message={atsState.error} onRetry={atsState.onRetry} />
                  </div>
                ) : (
                  <AtsScorePanel
                    score={atsState.data?.ats_score}
                    issues={atsState.data?.issues || []}
                    parsedSections={atsState.data?.parsed_sections || []}
                    summary={atsState.data?.summary}
                  />
                )}
              </div>
            )}

            {activeTab === "keywords" && (
              <div className="h-full">
                {atsState.isLoading ? (
                  <div className="glass-card h-[550px] flex items-center justify-center p-6 border border-white/60">
                    <Loader title="Parsing keyword density from document..." />
                  </div>
                ) : atsState.error ? (
                  <div className="glass-card h-[550px] flex items-center justify-center p-6 border border-white/60">
                    <ErrorState message={atsState.error} onRetry={atsState.onRetry} />
                  </div>
                ) : (
                  <WordCloudPanel
                    text={atsState.data?.extracted_text}
                    matchedSkills={skillsState.data?.matched_skills || []}
                  />
                )}
              </div>
            )}

            {activeTab === "skills" && (
              <div className="h-full">
                {skillsState.isLoading ? (
                  <div className="glass-card h-[550px] flex items-center justify-center p-6 border border-white/60">
                    <Loader title="Analyzing skill gaps & formulating project recommendations..." />
                  </div>
                ) : skillsState.error ? (
                  <div className="glass-card h-[550px] flex items-center justify-center p-6 border border-white/60">
                    <ErrorState message={skillsState.error} onRetry={skillsState.onRetry} />
                  </div>
                ) : (
                  <SkillGapPanel
                    matchedSkills={skillsState.data?.matched_skills || []}
                    missingSkills={skillsState.data?.missing_skills || []}
                    projectSuggestions={skillsState.data?.project_suggestions || []}
                  />
                )}
              </div>
            )}

            {activeTab === "jobs" && (
              <div className="h-full">
                {jobsState.isLoading ? (
                  <div className="glass-card h-[550px] flex items-center justify-center p-6 border border-white/60">
                    <Loader title="Aggregating live job vacancy listings..." />
                  </div>
                ) : jobsState.error ? (
                  <div className="glass-card h-[550px] flex items-center justify-center p-6 border border-white/60">
                    <ErrorState message={jobsState.error} onRetry={jobsState.onRetry} />
                  </div>
                ) : (
                  <div className="glass-card min-h-[550px] border border-white/60 p-6 md:p-8 flex flex-col justify-between">
                    <JobListingsPanel jobs={jobsState.data?.results || []} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
