import React, { useEffect } from "react";
import { X, HelpCircle, FileText, CheckCircle, Code } from "lucide-react";

export default function HelpTermsModal({ isOpen, onClose, type }) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop blur overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white/95 border border-white/60 shadow-2xl rounded-3xl max-w-xl w-full max-h-[85vh] overflow-hidden flex flex-col scale-in-center">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900/[0.02] border-b border-slate-200/10">
          <div className="flex items-center gap-2">
            {type === "help" && (
              <>
                <div className="p-1.5 bg-blue-600/10 rounded-lg text-blue-600 border border-blue-500/10">
                  <HelpCircle size={16} />
                </div>
                <span className="text-xs font-bold text-slate-800 tracking-wide uppercase">
                  Help & Documentation Center
                </span>
              </>
            )}
            {type === "terms" && (
              <>
                <div className="p-1.5 bg-indigo-600/10 rounded-lg text-indigo-600 border border-indigo-500/10">
                  <FileText size={16} />
                </div>
                <span className="text-xs font-bold text-slate-800 tracking-wide uppercase">
                  Terms of Use & Privacy Policies
                </span>
              </>
            )}
            {type === "docs" && (
              <>
                <div className="p-1.5 bg-emerald-600/10 rounded-lg text-emerald-600 border border-emerald-500/10">
                  <Code size={16} />
                </div>
                <span className="text-xs font-bold text-slate-800 tracking-wide uppercase">
                  CareerDesk Integration API Reference
                </span>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-grow p-6 overflow-y-auto text-left text-xs text-slate-600 space-y-6 leading-relaxed font-semibold">
          {type === "help" && (
            <>
              <div>
                <h3 className="text-sm font-extrabold text-slate-800 mb-2 flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-blue-600 flex-shrink-0" />
                  1. How to analyze your resume
                </h3>
                <p className="pl-5">
                  Select your resume in <strong>PDF</strong> or <strong>DOCX</strong> format (maximum size <strong>5MB</strong>). Provide your target job title and location, then click submit. The system extracts and evaluates your resume headers, formats, and keyword density.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-slate-800 mb-2 flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-blue-600 flex-shrink-0" />
                  2. Interpreting Audit Scores
                </h3>
                <p className="pl-5">
                  Your evaluation report is categorized by severity: <strong>Critical</strong> (severe blockages), <strong>Warnings</strong> (important missing sections or keyword gaps), and <strong>Suggestions</strong> (general improvements). You can click on the severity badges in the dashboard to filter findings.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-slate-800 mb-2 flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-blue-600 flex-shrink-0" />
                  3. Skill Gaps & Blueprints
                </h3>
                <p className="pl-5">
                  The skills scanner automatically detects matching skills and highlights key missing requirements. Check the AI-generated project suggestions to build practical skills for your target role.
                </p>
              </div>
            </>
          )}

          {type === "terms" && (
            <>
              <div>
                <h3 className="text-sm font-extrabold text-slate-800 mb-2">
                  1. Profile Optimization Services
                </h3>
                <p>
                  CareerDesk provides an automated resume auditing sandbox. By uploading a file, you authorize the platform to process your document to compile ATS compliance metrics and job recommendations.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-slate-800 mb-2">
                  2. Privacy & Data Storage
                </h3>
                <p>
                  We prioritize your privacy. Uploaded resumes and analyzed results are stored securely in your private scan history and are not shared with unauthorized third parties or used for external model training.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-slate-800 mb-2">
                  3. Recruitment Disclaimer
                </h3>
                <p>
                  The scores and recommendations provided are indicators of document formatting and keyword alignment. CareerDesk does not guarantee job placement or direct hiring outcomes.
                </p>
              </div>
            </>
          )}

          {type === "docs" && (
            <>
              <div className="space-y-4">
                <p className="mb-4">
                  Integrate CareerDesk's core audit services directly into your workflow using our backend endpoints:
                </p>

                <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-4 space-y-3 font-mono text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-600 text-white px-2 py-0.5 rounded font-bold uppercase">POST</span>
                    <span className="text-slate-800 font-bold">/api/resume/analyze</span>
                  </div>
                  <p className="text-slate-500 font-sans">
                    Uploads a resume file (PDF or DOCX) to retrieve ATS compliance evaluations, parsed sections, and key findings.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-4 space-y-3 font-mono text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-600 text-white px-2 py-0.5 rounded font-bold uppercase">POST</span>
                    <span className="text-slate-800 font-bold">/api/jobs/search</span>
                  </div>
                  <p className="text-slate-500 font-sans">
                    Queries active job aggregates matching target job titles, locations, and job modes (remote, hybrid, on-site).
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-4 space-y-3 font-mono text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-600 text-white px-2 py-0.5 rounded font-bold uppercase">GET</span>
                    <span className="text-slate-800 font-bold">/api/location/countries</span>
                  </div>
                  <p className="text-slate-500 font-sans">
                    Retrieves supported countries for geographic profile targeting.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-900/[0.02] border-t border-slate-200/10 flex justify-end">
          <button
            onClick={onClose}
            className="btn-primary py-2 px-5 text-xs font-bold w-fit shadow-md cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
