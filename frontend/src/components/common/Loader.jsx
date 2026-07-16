import React from "react";

export default function Loader({ title = "Loading analysis..." }) {
  return (
    <div className="glass-card fade-in-up min-h-[350px] flex flex-col justify-between p-6 md:p-8 border border-white/60">
      <div className="text-left">
        <div className="flex items-center gap-3 mb-5">
          <div className="shimmer animate-pulse w-6 h-6 rounded-full"></div>
          <div className="shimmer w-28 h-5"></div>
        </div>
        <p className="animate-pulse text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="shimmer w-full h-10 rounded-xl"></div>
        <div className="shimmer w-[85%] h-5 rounded-md"></div>
        <div className="shimmer w-[95%] h-5 rounded-md"></div>
        <div className="shimmer w-[60%] h-5 rounded-md"></div>
      </div>
    </div>
  );
}
