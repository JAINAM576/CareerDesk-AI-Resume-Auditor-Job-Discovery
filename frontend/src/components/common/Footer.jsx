import React from "react";
import { Sparkles, Heart } from "lucide-react";

export default function Footer({ setViewState, user, onShowHelp, onShowTerms, onShowDocs }) {
  const handleNavClick = (view) => {
    if (view === "upload" && !user) {
      setViewState("login");
    } else {
      setViewState(view);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer-glass mt-12 py-8 px-6 md:py-12 md:px-12 text-left">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavClick(user ? "upload" : "landing")}>
              <Sparkles className="text-blue-600 fill-blue-500/20" size={24} />
              <span className="text-lg font-extrabold text-slate-900 tracking-tight">
                CareerDesk
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unlocking career opportunities using advanced AI optimization, automated resume auditing, and real-time job synchronization.
            </p>
          </div>

          {/* Column 2: Platform links */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 font-semibold">
              <li>
                <button onClick={() => handleNavClick("landing")} className="hover:text-blue-600 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick(user ? "upload" : "login")} className="hover:text-blue-600 transition-colors">
                  ATS Scanner
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    handleNavClick("landing");
                    setTimeout(() => {
                      document.getElementById("features-section")?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }} 
                  className="hover:text-blue-600 transition-colors"
                >
                  Features
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 font-semibold">
              <li>
                <button 
                  onClick={onShowDocs} 
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left w-full"
                >
                  API Docs
                </button>
              </li>
              <li>
                <button 
                  onClick={onShowHelp} 
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left w-full"
                >
                  Help Center
                </button>
              </li>
              <li>
                <button 
                  onClick={onShowTerms} 
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left w-full"
                >
                  Terms of Use
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact/Info */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
              Contact
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              If you have questions or feedback, please visit our Help Center or documentation.
            </p>
          </div>
        </div>

        <hr className="border-slate-200/40 mb-6" />

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
          <p>© {new Date().getFullYear()} CareerDesk. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart size={10} className="text-red-500 fill-red-500" /> for job seekers everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}
