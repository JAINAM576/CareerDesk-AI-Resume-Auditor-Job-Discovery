import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="glass-card fade-in-up min-h-[350px] flex flex-col justify-center items-center text-center p-8 md:p-10 border border-white/60">
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-5 shadow-sm text-red-600">
        <AlertCircle size={32} />
      </div>
      <h3 className="text-base font-extrabold text-slate-900 mb-2 tracking-tight">
        Analysis Failed
      </h3>
      <p className="text-slate-600 text-xs leading-relaxed max-w-[280px] mb-6">
        {message || "We encountered an issue loading this panel. Please check your network and try again."}
      </p>
      {onRetry && (
        <button 
          className="btn-secondary text-xs font-semibold py-2.5 px-4 flex items-center gap-2"
          onClick={onRetry} 
        >
          <RotateCcw size={14} />
          Retry Section
        </button>
      )}
    </div>
  );
}
