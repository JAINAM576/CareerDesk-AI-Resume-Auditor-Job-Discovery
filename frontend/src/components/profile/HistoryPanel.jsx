import React, { useState } from "react";
import { FileText, Eye, Trash2, Search, Calendar, Award, AlertOctagon, TrendingUp } from "lucide-react";

export default function HistoryPanel({ history, onRestore, onDelete }) {
  const [filterText, setFilterText] = useState("");

  const filteredHistory = history.filter(item => 
    item.targetRole.toLowerCase().includes(filterText.toLowerCase()) ||
    item.fileName.toLowerCase().includes(filterText.toLowerCase())
  );

  // Statistics calculations
  const totalScans = history.length;
  const avgScore = totalScans > 0 
    ? Math.round(history.reduce((sum, item) => sum + item.atsScore, 0) / totalScans) 
    : 0;
  const highestScore = totalScans > 0 
    ? Math.max(...history.map(item => item.atsScore)) 
    : 0;

  return (
    <div className="fade-in-up space-y-6 text-left">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Metric 1 */}
        <div className="glass-card p-5 border border-white/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-600 border border-blue-500/10 shadow-sm">
            <TrendingUp size={22} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-0.5">
              Total Audits
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 leading-none">
              {totalScans}
            </h3>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-card p-5 border border-white/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 flex items-center justify-center text-emerald-600 border border-emerald-500/10 shadow-sm">
            <Award size={22} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-0.5">
              Average Score
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 leading-none">
              {avgScore}/100
            </h3>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-card p-5 border border-white/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600 border border-indigo-500/10 shadow-sm">
            <Award size={22} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-0.5">
              Highest Score
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 leading-none">
              {highestScore}/100
            </h3>
          </div>
        </div>
      </div>

      {/* Main Table Panel */}
      <div className="glass-card p-6 border border-white/60 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Audit History Log
            </h3>
            <p className="text-xs text-slate-500">
              Restore details or manage your previously scanned resumes.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Search size={14} />
            </span>
            <input
              type="text"
              className="form-input !pl-10 py-2 text-xs"
              placeholder="Search history..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
        </div>

        {/* Table list */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-semibold text-slate-700">
            <thead>
              <tr className="border-b border-slate-200/40 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 text-left font-bold pb-4">Job Title / File</th>
                <th className="py-3 text-center font-bold pb-4">ATS Score</th>
                <th className="py-3 text-center font-bold pb-4">Issues Found</th>
                <th className="py-3 text-center font-bold pb-4">Audit Date</th>
                <th className="py-3 text-right font-bold pb-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((item) => (
                <tr key={item.id} className="border-b border-slate-200/20 hover:bg-white/20 transition-colors">
                  {/* File & Role Details */}
                  <td className="py-4 text-left">
                    <div className="font-extrabold text-slate-900 mb-1">
                      {item.targetRole}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                      <FileText size={12} className="text-slate-400" />
                      <span className="max-w-[200px] truncate">{item.fileName}</span>
                    </div>
                  </td>

                  {/* ATS Score */}
                  <td className="py-4 text-center">
                    <span 
                      className={`inline-block font-extrabold text-sm ${
                        item.atsScore >= 80 ? "text-emerald-600" :
                        item.atsScore >= 60 ? "text-amber-600" : "text-red-600"
                      }`}
                    >
                      {item.atsScore}
                    </span>
                  </td>

                  {/* Issues Count */}
                  <td className="py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <AlertOctagon size={12} className="text-slate-400" />
                      <span>{item.issuesCount} issues</span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="py-4 text-center text-[10px] text-slate-500 font-medium">
                    <div className="flex items-center justify-center gap-1">
                      <Calendar size={12} className="text-slate-400" />
                      <span>{item.date}</span>
                    </div>
                  </td>

                  {/* Restore / Delete actions */}
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onRestore(item)}
                        className="btn-secondary !py-2 !px-3 text-[10px] font-bold flex items-center gap-1"
                      >
                        <Eye size={12} />
                        View Report
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-500/5 rounded-lg border border-transparent hover:border-red-500/10 transition-all"
                        title="Delete record"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredHistory.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-500 italic">
                    {history.length === 0 
                      ? "No resume audits completed yet. Upload a resume to create your history log." 
                      : "No historical logs match your search term."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
