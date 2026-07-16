import React, { useState } from "react";
import { AlertOctagon, AlertTriangle, Lightbulb, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

export default function AtsScorePanel({ score, issues, parsedSections, summary }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState("all");

  // SVG parameters for circle progress
  const radius = 55;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const normalizedScore = Math.max(0, Math.min(100, score || 0));
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  // Filter issues by severity
  const criticalIssues = issues.filter(i => i.severity.toLowerCase() === "critical");
  const warningIssues = issues.filter(i => i.severity.toLowerCase() === "warning");
  const suggestionIssues = issues.filter(i => i.severity.toLowerCase() === "suggestion");

  // Sort issues: Critical -> Warning -> Suggestion
  const sortedIssues = [...issues].sort((a, b) => {
    const severityOrder = { critical: 1, warning: 2, suggestion: 3 };
    const orderA = severityOrder[a.severity.toLowerCase()] || 4;
    const orderB = severityOrder[b.severity.toLowerCase()] || 4;
    return orderA - orderB;
  });

  const filteredIssues = sortedIssues.filter(issue => {
    if (filterSeverity === "all") return true;
    return issue.severity.toLowerCase() === filterSeverity;
  });

  const getScoreColorClass = (val) => {
    if (val >= 80) return "url(#scoreGradSuccess)";
    if (val >= 60) return "url(#scoreGradWarning)";
    return "url(#scoreGradError)";
  };

  const getScoreTextColor = (val) => {
    if (val >= 80) return "text-emerald-600";
    if (val >= 60) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="glass-card fade-in-up h-full flex flex-col p-6 md:p-8 border border-white/60">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
          Resume ATS Score
        </h3>
        <span className="badge badge-muted font-bold">
          Score: {normalizedScore}/100
        </span>
      </div>

      {/* SVG Progress Circle and Status Text */}
      <div className="text-center mb-6">
        <div className="circle-progress-container relative">
          <svg width="140" height="140">
            <defs>
              <linearGradient id="scoreGradSuccess" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
              <linearGradient id="scoreGradWarning" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
              <linearGradient id="scoreGradError" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#b91c1c" />
              </linearGradient>
            </defs>
            <circle
              className="circle-progress-bg"
              cx="70"
              cy="70"
              r={radius}
            />
            <circle
              className="circle-progress-bar"
              cx="70"
              cy="70"
              r={radius}
              stroke={getScoreColorClass(normalizedScore)}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 70 70)"
            />
          </svg>
          <div className={`circle-progress-text ${getScoreTextColor(normalizedScore)}`}>
            {normalizedScore}
          </div>
        </div>

        <p className="text-slate-800 text-sm font-semibold mt-2">
          {normalizedScore >= 80 ? "Great job! Your resume is highly ATS-optimized." :
           normalizedScore >= 60 ? "Good start, but some critical improvements are needed." :
           "Warning: Your resume may be filtered out by ATS parsers."}
        </p>
      </div>

      {/* Severity Filter Controls */}
      <div className="mb-6 flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setFilterSeverity("all")}
          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer border ${
            filterSeverity === "all"
              ? "bg-slate-800 text-white border-slate-800 shadow-sm"
              : "bg-white/20 text-slate-600 border-slate-200/60 hover:bg-white/60"
          }`}
        >
          All ({issues.length})
        </button>
        
        <button
          onClick={() => setFilterSeverity("critical")}
          disabled={criticalIssues.length === 0}
          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer border ${
            criticalIssues.length === 0 ? "opacity-35 cursor-not-allowed" : ""
          } ${
            filterSeverity === "critical"
              ? "bg-red-600 text-white border-red-600 shadow-sm"
              : "bg-red-500/5 text-red-600 border-red-500/15 hover:bg-red-500/10"
          }`}
        >
          Critical ({criticalIssues.length})
        </button>

        <button
          onClick={() => setFilterSeverity("warning")}
          disabled={warningIssues.length === 0}
          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer border ${
            warningIssues.length === 0 ? "opacity-35 cursor-not-allowed" : ""
          } ${
            filterSeverity === "warning"
              ? "bg-amber-500 text-white border-amber-500 shadow-sm"
              : "bg-amber-500/5 text-amber-600 border-amber-500/15 hover:bg-amber-500/10"
          }`}
        >
          Warnings ({warningIssues.length})
        </button>

        <button
          onClick={() => setFilterSeverity("suggestion")}
          disabled={suggestionIssues.length === 0}
          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer border ${
            suggestionIssues.length === 0 ? "opacity-35 cursor-not-allowed" : ""
          } ${
            filterSeverity === "suggestion"
              ? "bg-blue-600 text-white border-blue-600 shadow-sm"
              : "bg-blue-500/5 text-blue-600 border-blue-500/15 hover:bg-blue-500/10"
          }`}
        >
          Suggestions ({suggestionIssues.length})
        </button>
      </div>

      {/* Executive Summary Callout */}
      {summary && (
        <div className="mb-6 p-5 bg-blue-500/5 border border-blue-500/15 rounded-2xl text-left shadow-sm">
          <h4 className="text-[10px] font-extrabold text-blue-800 uppercase tracking-wider mb-2 select-none">
            Audit Executive Summary
          </h4>
          <p className="text-xs text-slate-700 font-semibold leading-relaxed">
            {summary}
          </p>
        </div>
      )}

      <hr className="border-slate-200/40 mb-4" />

      {/* Found Sections Dropdown */}
      <div className="flex-grow flex flex-col min-h-0 overflow-hidden">
        <div 
          className="flex justify-between items-center mb-3 cursor-pointer py-1 select-none hover:opacity-85 transition-opacity" 
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Found Sections ({parsedSections.length})
          </span>
          {isExpanded ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
        </div>
        
        {isExpanded && (
          <div className="flex flex-wrap gap-1.5 mb-4 p-3 bg-white/20 rounded-xl border border-white/40 fade-in-up">
            {parsedSections.map((sec, idx) => (
              <span key={idx} className="badge badge-muted text-[10px] font-bold py-1 px-2.5 m-0" style={{ display: "inline-flex", gap: "4px" }}>
                <CheckCircle2 size={10} className="text-emerald-600" />
                {sec}
              </span>
            ))}
          </div>
        )}

        {/* Scrollable Issue List */}
        <div className="overflow-y-auto max-h-[300px] pr-1 space-y-3">
          <ul className="custom-list space-y-3">
            {filteredIssues.length === 0 ? (
              <div className="text-center py-8 text-xs font-semibold text-slate-400">
                No findings match the selected filter.
              </div>
            ) :
              filteredIssues.map((issue, idx) => {
              const isCrit = issue.severity === "critical";
              const isWarn = issue.severity === "warning";
              
              let leftBorderColor = "border-l-blue-500";
              let iconColor = "text-blue-500";
              let titleColor = "text-blue-700";
              let icon = <Lightbulb size={16} />;

              if (isCrit) {
                leftBorderColor = "border-l-red-500";
                iconColor = "text-red-500";
                titleColor = "text-red-700";
                icon = <AlertOctagon size={16} />;
              } else if (isWarn) {
                leftBorderColor = "border-l-amber-500";
                iconColor = "text-amber-500";
                titleColor = "text-amber-700";
                icon = <AlertTriangle size={16} />;
              }
              
              return (
                <li 
                  key={idx} 
                  className={`custom-list-item flex gap-3 p-4 bg-white/40 border border-white/60 rounded-2xl ${leftBorderColor} border-l-[5px] shadow-sm`}
                >
                  <div className={`${iconColor} mt-0.5 flex-shrink-0`}>
                    {icon}
                  </div>
                  <div className="text-xs text-left">
                    <span className={`font-bold uppercase tracking-wide mr-2 ${titleColor}`}>
                      {issue.severity}:
                    </span>
                    <span className="text-slate-800 font-medium leading-relaxed">
                      {issue.message}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
