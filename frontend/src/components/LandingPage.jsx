import React from "react";
import { ShieldCheck, Cpu, Layers, Search, ArrowRight, Sparkles, CheckCircle } from "lucide-react";

export default function LandingPage({ onGetStarted, user }) {
  return (
    <div className="fade-in-up space-y-16 py-6 text-left">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 pt-4">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600/10 border border-blue-500/15 text-blue-600 text-xs font-extrabold tracking-wide uppercase">
            <Sparkles size={12} />
            Revolutionize your job search
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            Audit Your Resume.<br />
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Close Skill Gaps.
            </span><br />
            Land Your Dream Job.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-[540px]">
            Upload your resume to instantly receive an ATS compatibility score, detailed format audits, personalized project recommendations, and real-time job offers matching your preferences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              onClick={onGetStarted}
              className="btn-primary flex items-center justify-center gap-2 py-4 px-6 text-sm font-bold shadow-md sm:w-auto"
            >
              Get Started Free
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => document.getElementById("features-section")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-secondary flex items-center justify-center py-4 px-6 text-sm font-bold sm:w-auto"
            >
              Explore Features
            </button>
          </div>
        </div>

        {/* Visual Mock / Feature Graphic Panel */}
        <div className="flex-1 w-full max-w-[500px] lg:max-w-none">
          <div className="glass-card p-6 md:p-8 border border-white/60 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl" />
            
            <div className="space-y-5 relative z-10">
              <div className="flex items-center justify-between border-b border-slate-200/40 pb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Analysis Demo</span>
                <span className="badge badge-success text-[10px] font-bold py-0.5 px-2">Ready</span>
              </div>

              {/* Progress bar mock */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-600/10 text-emerald-600 border border-emerald-500/10 flex items-center justify-center font-black text-lg">
                  85
                </div>
                <div className="text-left flex-grow">
                  <div className="text-xs font-extrabold text-slate-800">ATS Rating</div>
                  <div className="w-full bg-slate-200/50 h-2 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full w-[85%]" />
                  </div>
                </div>
              </div>

              {/* Bullet checks mock */}
              <div className="space-y-3.5 pt-2 text-xs">
                <div className="flex items-start gap-2.5">
                  <CheckCircle size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium">Found sections: Contact, Experience, Education</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium">Matched Skills: React.js, Tailwind CSS, API Integration</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="inline-block w-3.5 h-3.5 rounded-full bg-amber-500/10 text-amber-600 text-center font-bold text-[9px] mt-0.5">!</span>
                  <span className="text-slate-700 font-medium">Missing target role skills: Next.js, Redux Toolkit</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Row */}
      <section className="glass-card grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 border border-white/60 text-center rounded-2xl shadow-sm">
        <div className="py-2.5">
          <div className="text-3xl font-black text-blue-600">95%</div>
          <div className="text-[11px] uppercase font-bold text-slate-500 tracking-wider mt-1">Average ATS Score Increase</div>
        </div>
        <div className="border-t sm:border-t-0 sm:border-x border-slate-200/40 py-2.5">
          <div className="text-3xl font-black text-slate-900">10k+</div>
          <div className="text-[11px] uppercase font-bold text-slate-500 tracking-wider mt-1">Resumes Audited</div>
        </div>
        <div className="border-t sm:border-t-0 py-2.5">
          <div className="text-3xl font-black text-cyan-600">3x</div>
          <div className="text-[11px] uppercase font-bold text-slate-500 tracking-wider mt-1">Faster Job Offers Matched</div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features-section" className="space-y-8 scroll-mt-6">
        <div className="text-center max-w-[600px] mx-auto space-y-2">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How CareerDesk Works
          </h3>
          <p className="text-sm text-slate-600">
            A comprehensive, multi-layered analyzer built to optimize your visibility in modern HR portals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="glass-card p-6 border border-white/60 hover:border-blue-500/20 transition-all flex flex-col items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600 border border-blue-500/10">
              <ShieldCheck size={20} />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-sm font-extrabold text-slate-900">ATS Structure Scan</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Reviews your document formatting, confirms parsed header sections, checks font choices, and highlights issues that block machine scanners.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-card p-6 border border-white/60 hover:border-blue-500/20 transition-all flex flex-col items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/10 flex items-center justify-center text-cyan-600 border border-cyan-500/10">
              <Cpu size={20} />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-sm font-extrabold text-slate-900">Skill Gap Auditing</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Compares your skills with role expectations, detects missing technologies, and drafts custom project specs to build qualifications.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-card p-6 border border-white/60 hover:border-blue-500/20 transition-all flex flex-col items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-600 border border-indigo-500/10">
              <Search size={20} />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-sm font-extrabold text-slate-900">Live Job Aggregation</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Scours top networks (Adzuna, Arbeitnow, RemoteOK) to return vacancies matching your location and employment preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about-section" className="glass-card p-8 md:p-10 border border-white/60 flex flex-col md:flex-row items-center gap-8 rounded-3xl scroll-mt-6">
        <div className="space-y-4 flex-1">
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Our Mission
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Over 75% of resumes are rejected by Applicant Tracking Systems (ATS) before ever reaching human eyes. We created CareerDesk to democratize resume optimization, giving job hunters the exact automated intelligence insights needed to bypass blockers and stand out.
          </p>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            By combining parsing technology with skill gap tutoring logic and active job searching, CareerDesk offers an end-to-end sandbox tailored to modern recruitment pipelines.
          </p>
        </div>
        <div className="w-full md:w-auto flex-shrink-0 flex justify-center flex-1">
          <div className="bg-blue-600/5 border border-blue-500/10 rounded-2xl p-6 max-w-[280px] text-center">
            <Layers className="text-blue-600 mx-auto mb-3" size={32} />
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1">Built for Seekers</h4>
            <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
              No subscription gates. Upload, diagnose, review matches, and apply directly.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="glass-card bg-gradient-to-r from-blue-600/10 via-cyan-500/5 to-blue-600/5 border border-blue-500/20 p-8 md:p-12 text-center rounded-3xl space-y-6">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight max-w-[500px] mx-auto leading-tight">
          Ready to optimize your career path?
        </h3>
        <p className="text-sm text-slate-600 max-w-[420px] mx-auto">
          Sign up now to scan your resume, isolate skill gaps, and view live active job matches.
        </p>
        <button
          onClick={onGetStarted}
          className="btn-primary flex items-center justify-center gap-2 py-3.5 px-8 text-sm font-bold shadow-md mx-auto sm:w-auto"
        >
          Analyze Resume Now
          <ArrowRight size={16} />
        </button>
      </section>
    </div>
  );
}
