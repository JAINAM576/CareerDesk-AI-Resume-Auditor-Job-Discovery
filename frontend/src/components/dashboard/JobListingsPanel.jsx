import React, { useState } from "react";
import { Search, Briefcase, ExternalLink, Calendar, MapPin } from "lucide-react";

export default function JobListingsPanel({ jobs }) {
  const [filterText, setFilterText] = useState("");

  // Filter listings based on input
  const filteredJobs = jobs.filter(job => 
    job.company.toLowerCase().includes(filterText.toLowerCase()) ||
    job.title.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="glass-card fade-in-up h-full flex flex-col p-6 md:p-8 border border-white/60">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
          Live Job Opportunities
        </h3>
        <span className="badge badge-muted font-bold m-0">
          {jobs.length} Found
        </span>
      </div>

      {/* Filter Search Input */}
      <div className="relative mb-5 text-left">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <Search size={16} />
        </span>
        <input
          type="text"
          className="form-input !pl-11"
          placeholder="Search by company or job title..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>

      {/* Job Card List container */}
      <div className="flex-grow overflow-y-auto max-h-[420px] pr-1">
        <div className="flex flex-col gap-4">
          {filteredJobs.map((job, idx) => {
            const isRemote = job.mode === "remote";
            const isHybrid = job.mode === "hybrid";

            let modeBadgeClass = "badge-muted";
            if (isRemote) modeBadgeClass = "badge-success";
            else if (isHybrid) modeBadgeClass = "badge-warning";

            return (
              <div 
                key={idx} 
                className="bg-white/40 border border-white/60 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-blue-500/30 transition-all shadow-sm"
              >
                <div className="text-left flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600 border border-blue-500/10 flex-shrink-0 mt-0.5">
                    <Briefcase size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 leading-snug mb-1">
                      {job.title}
                    </h4>
                    <p className="text-xs font-semibold text-slate-600 mb-2.5">
                      {job.company}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <MapPin size={12} className="text-slate-400" />
                        {job.location}
                      </span>
                      {job.posted && (
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-slate-400" />
                          {job.posted}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto gap-3 border-t sm:border-0 border-slate-200/40 pt-3 sm:pt-0">
                  <span className={`badge ${modeBadgeClass} text-[10px] font-bold py-1 px-2.5 m-0 uppercase tracking-wider`}>
                    {job.mode}
                  </span>
                  
                  {job.apply_url && (
                    <a 
                      href={job.apply_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-secondary text-[11px] font-bold py-2 px-4 flex items-center gap-1.5 leading-none"
                    >
                      Apply
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}

          {filteredJobs.length === 0 && (
            <div className="text-center py-12 bg-white/20 border border-dashed border-slate-300 rounded-2xl p-6">
              <p className="text-slate-500 text-sm font-medium">
                {jobs.length === 0 ? "No jobs found for your target criteria." : "No jobs match your filter term."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
