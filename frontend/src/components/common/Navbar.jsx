import React from "react";
import { Sparkles, LogOut, User as UserIcon, Menu, X } from "lucide-react";

export default function Navbar({ user, viewState, setViewState, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleNavClick = (view) => {
    setMobileMenuOpen(false);
    if (view === "upload" && !user) {
      setViewState("login");
    } else {
      setViewState(view);
    }
  };

  return (
    <nav className="navbar-sticky py-4 px-6 md:px-12 flex justify-between items-center shadow-sm">
      {/* Brand Logo */}
      <div 
        className="flex items-center gap-2 cursor-pointer select-none text-left" 
        onClick={() => handleNavClick(user ? "upload" : "landing")}
      >
        <Sparkles className="text-blue-600 fill-blue-500/20" size={26} />
        <span className="text-xl font-extrabold text-slate-900 tracking-tight">
          CareerDesk
        </span>
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
        {!user ? (
          <>
            <button 
              onClick={() => handleNavClick("landing")} 
              className={`hover:text-blue-600 transition-colors ${viewState === "landing" ? "text-blue-600" : ""}`}
            >
              Home
            </button>
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
            <button 
              onClick={() => handleNavClick("login")} 
              className="hover:text-blue-600 transition-colors"
            >
              ATS Scanner
            </button>
            <button 
              onClick={() => {
                handleNavClick("landing");
                setTimeout(() => {
                  document.getElementById("about-section")?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }} 
              className="hover:text-blue-600 transition-colors"
            >
              About
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={() => handleNavClick("upload")} 
              className={`hover:text-blue-600 transition-colors ${viewState === "upload" || viewState === "dashboard" ? "text-blue-600" : ""}`}
            >
              ATS Scanner
            </button>
            <button 
              onClick={() => handleNavClick("history")} 
              className={`hover:text-blue-600 transition-colors ${viewState === "history" ? "text-blue-600" : ""}`}
            >
              History Log
            </button>
            <button 
              onClick={() => handleNavClick("profile")} 
              className={`hover:text-blue-600 transition-colors ${viewState === "profile" ? "text-blue-600" : ""}`}
            >
              Profile Settings
            </button>
          </>
        )}
      </div>

      {/* Desktop Action Buttons */}
      <div className="hidden md:flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <div 
              className="flex items-center gap-2 text-slate-700 bg-white/40 border border-white/50 py-1.5 px-3 rounded-xl cursor-pointer hover:border-blue-500/30 transition-all"
              onClick={() => handleNavClick("profile")}
            >
              <UserIcon size={14} className="text-blue-600" />
              <span className="text-xs font-semibold max-w-[120px] truncate">
                {user.fullName || user.email}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 py-1.5 px-3 rounded-xl transition-all"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handleNavClick("login")}
              className="text-xs font-bold text-slate-700 hover:text-blue-600 py-2 px-4 transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => handleNavClick("register")}
              className="btn-primary text-xs font-bold py-2 px-4 shadow-sm"
              style={{ width: "auto" }}
            >
              Get Started
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <button 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100/50 transition-colors"
      >
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 glass-card p-6 border border-white/60 flex flex-col gap-4 text-left shadow-lg md:hidden animate-fadeInDown z-50">
          {!user ? (
            <>
              <button 
                onClick={() => handleNavClick("landing")} 
                className="text-sm font-semibold text-slate-700 hover:text-blue-600 py-1 transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => {
                  handleNavClick("landing");
                  setTimeout(() => {
                    document.getElementById("features-section")?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }} 
                className="text-sm font-semibold text-slate-700 hover:text-blue-600 py-1 transition-colors"
              >
                Features
              </button>
              <button 
                onClick={() => handleNavClick("login")} 
                className="text-sm font-semibold text-slate-700 hover:text-blue-600 py-1 transition-colors"
              >
                ATS Scanner
              </button>
              <button 
                onClick={() => {
                  handleNavClick("landing");
                  setTimeout(() => {
                    document.getElementById("about-section")?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }} 
                className="text-sm font-semibold text-slate-700 hover:text-blue-600 py-1 transition-colors"
              >
                About
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => handleNavClick("upload")} 
                className="text-sm font-semibold text-slate-700 hover:text-blue-600 py-1 transition-colors"
              >
                ATS Scanner
              </button>
              <button 
                onClick={() => handleNavClick("history")} 
                className="text-sm font-semibold text-slate-700 hover:text-blue-600 py-1 transition-colors"
              >
                History Log
              </button>
              <button 
                onClick={() => handleNavClick("profile")} 
                className="text-sm font-semibold text-slate-700 hover:text-blue-600 py-1 transition-colors"
              >
                Profile Settings
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
