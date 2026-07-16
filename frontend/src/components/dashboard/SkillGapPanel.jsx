import React from "react";
import { Check, AlertTriangle, Code } from "lucide-react";

export default function SkillGapPanel({ matchedSkills, missingSkills, projectSuggestions }) {
  return (
    <div className="glass-card fade-in-up h-full flex flex-col p-6 md:p-8 border border-white/60">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
          Role Fit & Skill Gap
        </h3>
        <span className="badge badge-muted font-bold">
          Analysis Complete
        </span>
      </div>

      {/* Matched Skills */}
      <div className="mb-5 text-left">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
          Matched Skills ({matchedSkills.length})
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {matchedSkills.map((skill, idx) => (
            <span key={idx} className="badge badge-success text-xs font-medium py-1 px-3 m-0 flex items-center gap-1">
              <Check size={12} className="text-emerald-600 flex-shrink-0" />
              {skill}
            </span>
          ))}
          {matchedSkills.length === 0 && (
            <p className="text-slate-500 text-xs italic">
              No matching role-specific skills parsed.
            </p>
          )}
        </div>
      </div>

      {/* Skills to Develop */}
      <div className="mb-6 text-left">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
          Skills to Develop ({missingSkills.length})
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {missingSkills.map((skill, idx) => (
            <span key={idx} className="badge badge-warning text-xs font-medium py-1 px-3 m-0 flex items-center gap-1">
              <AlertTriangle size={12} className="text-amber-600 flex-shrink-0" />
              {skill}
            </span>
          ))}
          {missingSkills.length === 0 && (
            <p className="text-emerald-700 text-xs font-semibold">
              Excellent! You have no obvious skill gaps for this target role.
            </p>
          )}
        </div>
      </div>

      <hr className="border-slate-200/40 mb-5" />

      {/* Recommended Projects list */}
      <div className="flex-grow flex flex-col min-h-0 overflow-hidden text-left">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Code size={15} className="text-blue-600" />
          Recommended Projects to Close the Gap
        </h4>

        <div className="overflow-y-auto max-h-[300px] pr-1 space-y-3">
          {projectSuggestions.map((project, idx) => (
            <div 
              key={idx} 
              className="p-4 bg-white/40 border border-white/60 rounded-2xl flex gap-3 shadow-sm hover:border-blue-500/30 transition-colors"
            >
              <span className="inline-flex justify-center items-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex-shrink-0 mt-0.5 shadow-sm">
                {idx + 1}
              </span>
              <div>
                <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                  {project}
                </p>
              </div>
            </div>
          ))}
          {projectSuggestions.length === 0 && (
            <p className="text-slate-500 text-xs italic">
              No custom project suggestions available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
