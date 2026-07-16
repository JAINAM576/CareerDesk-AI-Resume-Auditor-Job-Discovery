import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, Sparkles, Check } from "lucide-react";
import { supabase } from "../../api/supabase";

export default function Login({ onLogin, onNavigateToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      setValidationError("Please enter a valid email address.");
      return;
    }

    if (!password || password.length < 6) {
      setValidationError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (error) {
        throw new Error(error.message);
      }

      onLogin({
        email: data.user.email,
        fullName: data.user.user_metadata?.full_name || data.user.email.split("@")[0]
      });
    } catch (err) {
      setValidationError(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card fade-in-up w-full max-w-[1140px] mx-auto my-6 p-0 rounded-3xl overflow-hidden flex flex-col md:flex-row min-h-[580px] border border-white/60 shadow-lg">
      
      {/* Left panel: Info & branding */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600/10 via-blue-500/5 to-cyan-500/5 p-10 flex-col justify-between border-r border-slate-200/20 text-left">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-600">
            <Sparkles className="fill-blue-500/10" size={24} />
            <span className="text-lg font-black tracking-tight">CareerDesk</span>
          </div>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
            AI Resume Sandbox
          </p>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-extrabold text-slate-900 leading-tight">
            Accelerate your job search insights.
          </h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-600 flex-shrink-0 mt-0.5">
                <Check size={12} />
              </div>
              <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                Scan resume headers, sections, and formats.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-600 flex-shrink-0 mt-0.5">
                <Check size={12} />
              </div>
              <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                Identify key role-specific missing skill gaps.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-600 flex-shrink-0 mt-0.5">
                <Check size={12} />
              </div>
              <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                Unlock automated active job recommendations.
              </p>
            </li>
          </ul>
        </div>

        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Join 10k+ candidates optimizing profiles
        </div>
      </div>

      {/* Right panel: Login form */}
      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white/10 relative">
        <div className="flex flex-col items-center mb-6">
          <div className="w-10 h-10 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-600 mb-3 border border-blue-500/10">
            <LogIn size={20} />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Sign in to access your scanner dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <Mail size={16} />
              </span>
              <input
                type="email"
                id="login-email"
                className="form-input !pl-11"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <div className="flex justify-between items-center mb-1.5">
              <label className="form-label m-0" htmlFor="login-password">
                Password
              </label>
              <button
                type="button"
                className="text-[10px] text-blue-600 hover:text-blue-700 font-bold transition-colors uppercase tracking-wider"
                onClick={() => alert("Password reset is not configured for this demo.")}
                disabled={isLoading}
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <Lock size={16} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                id="login-password"
                className="form-input !pl-11 !pr-11"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

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
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-slate-200/40 text-center">
          <p className="text-xs text-slate-600">
            Don't have an account?{" "}
            <button
              type="button"
              className="text-blue-600 hover:text-blue-700 font-bold transition-colors"
              onClick={onNavigateToRegister}
              disabled={isLoading}
            >
              Sign up free
            </button>
          </p>
        </div>
      </div>

    </div>
  );
}
