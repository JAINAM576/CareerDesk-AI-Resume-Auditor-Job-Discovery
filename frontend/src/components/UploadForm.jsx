import React, { useState, useRef } from "react";
import { UploadCloud, FileText, X, AlertCircle, FileSpreadsheet, ListChecks, CheckCircle } from "lucide-react";
import LocationSelector from "./common/LocationSelector";

export default function UploadForm({ onSubmit, isLoading }) {
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState("");
  const [location, setLocation] = useState("");
  const [jobMode, setJobMode] = useState("any");
  const [dragActive, setDragActive] = useState(false);
  const [validationError, setValidationError] = useState("");
  
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setValidationError("");
    const name = selectedFile.name.toLowerCase();
    const isAllowed = name.endsWith(".pdf") || name.endsWith(".docx");
    
    if (!isAllowed) {
      setValidationError("Only PDF and DOCX files are allowed.");
      return;
    }
    
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (selectedFile.size > maxSize) {
      setValidationError("File size exceeds 5MB limit.");
      return;
    }

    setFile(selectedFile);
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setValidationError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setValidationError("");

    if (!file) {
      setValidationError("Please upload your resume.");
      return;
    }
    if (!targetRole.trim()) {
      setValidationError("Please enter your desired role.");
      return;
    }
    if (!location.trim()) {
      setValidationError("Please enter your target location.");
      return;
    }

    onSubmit({
      file,
      targetRole: targetRole.trim(),
      location: location.trim(),
      jobMode
    });
  };

  return (
    <div className="glass-card fade-in-up w-full max-w-[1140px] mx-auto my-6 p-0 rounded-3xl overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-white/60 shadow-lg">
      
      {/* Left Panel: Resume Tips & Guidelines */}
      <div className="hidden md:flex md:w-2/5 bg-gradient-to-br from-blue-600/10 via-blue-500/5 to-cyan-500/5 p-8 flex-col justify-between border-r border-slate-200/20 text-left">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-blue-600">
            <ListChecks size={22} />
            <span className="text-sm font-extrabold uppercase tracking-wider">
              ATS Tips
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
            Structure your resume for machine compliance.
          </h3>
          <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
            Applicant Tracking Systems use indexing parsers. Follow these rules to get the best scoring index.
          </p>
        </div>

        <div className="space-y-4 my-6 text-xs text-slate-700 font-semibold leading-relaxed">
          <div className="flex items-start gap-2.5">
            <CheckCircle size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
            <span>Use standard section titles: *Experience*, *Education*, *Skills*.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
            <span>Avoid embedding text inside images, graphs, or visual tables.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
            <span>Focus details around keyword matching for the target job title.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
            <span>Stick to clean PDF or DOCX file formats.</span>
          </div>
        </div>

        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          Upload limit: 5MB per document
        </div>
      </div>

      {/* Right Panel: Onboarding Form */}
      <div className="w-full md:w-3/5 p-6 sm:p-8 md:p-10 flex flex-col justify-center bg-white/10 relative">
        <div className="text-left mb-6">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mb-1">
            Analyze Resume
          </h2>
          <p className="text-xs text-slate-500">
            Set your target preferences and upload your resume profile.
          </p>
        </div>

        <form onSubmit={handleFormSubmit} onDragEnter={handleDrag} className="space-y-5">
          {/* Drag & Drop Zone */}
          <div className="form-group">
            <input
              ref={fileInputRef}
              type="file"
              id="resume-upload"
              accept=".pdf,.docx"
              className="hidden"
              onChange={handleChange}
            />
            
            <div
              className={`upload-zone flex flex-col items-center justify-center min-h-[140px] py-4 ${dragActive ? "active" : ""}`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
            >
              {!file ? (
                <div className="flex flex-col items-center">
                  <UploadCloud size={32} className="text-blue-600 mb-2" />
                  <p className="text-xs font-bold text-slate-800 mb-0.5">
                    Drag & drop your resume here
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Supports PDF, DOCX (Max 5MB)
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full p-2 bg-blue-500/5 rounded-xl border border-blue-500/15">
                  <div className="flex items-center gap-3 text-left">
                    <div className="p-2 bg-blue-600/10 rounded-xl text-blue-600 border border-blue-500/10">
                      <FileText size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 max-w-[200px] truncate">
                        {file.name}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Form details in rows */}
          <div className="space-y-5">
            <div className="form-group m-0 text-left">
              <label className="form-label font-bold" htmlFor="role">Desired Role</label>
              <input
                type="text"
                id="role"
                className="form-input text-xs"
                placeholder="e.g. Frontend Developer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="form-group m-0 text-left">
              <label className="form-label font-bold">Target Location</label>
              <LocationSelector
                value={location}
                onChange={setLocation}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label font-bold" htmlFor="mode">Job Mode Preference</label>
            <select
              id="mode"
              className="form-select text-xs"
              value={jobMode}
              onChange={(e) => setJobMode(e.target.value)}
              disabled={isLoading}
            >
              <option value="any">Any Mode</option>
              <option value="remote">Remote Only</option>
              <option value="hybrid">Hybrid</option>
              <option value="on-site">On-site</option>
            </select>
          </div>

          {/* Validation Errors */}
          {validationError && (
            <div className="flex gap-2 items-center bg-red-500/10 border border-red-500/20 rounded-xl p-3">
              <AlertCircle size={16} className="text-red-600 flex-shrink-0" />
              <p className="text-[11px] text-red-700 text-left font-semibold">
                {validationError}
              </p>
            </div>
          )}

          <button
            type="submit"
            className="btn-primary flex items-center justify-center gap-2 mt-4"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Processing Resume Analysis...
              </>
            ) : (
              "Analyze Profile & Find Jobs"
            )}
          </button>
        </form>
      </div>

    </div>
  );
}
