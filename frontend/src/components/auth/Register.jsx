import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, UserPlus, AlertCircle, Sparkles, Check } from "lucide-react";
import { supabase } from "../../api/supabase";
import LocationSelector from "../common/LocationSelector";

export default function Register({ onRegister, onNavigateToLogin }) {
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");

    if (!fullName.trim()) {
      setValidationError("Please enter your full name.");
      return;
    }

    if (!gender) {
      setValidationError("Please select your gender.");
      return;
    }

    if (!currentLocation) {
      setValidationError("Please select your current location.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      setValidationError("Please enter a valid email address.");
      return;
    }

    if (!password || password.length < 6) {
      setValidationError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            full_name: fullName.trim(),
            gender: gender,
            current_location: currentLocation
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      onRegister({
        email: data.user.email,
        fullName: data.user.user_metadata?.full_name || fullName.trim(),
        gender: data.user.user_metadata?.gender || gender,
        currentLocation: data.user.user_metadata?.current_location || currentLocation
      });
    } catch (err) {
      setValidationError(err.message || "Failed to sign up. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card fade-in-up w-full max-w-[1140px] mx-auto my-6 p-0 rounded-3xl overflow-hidden flex flex-col md:flex-row min-h-[620px] border border-white/60 shadow-lg">
      
      {/* Left panel: Info & branding */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600/10 via-blue-500/5 to-cyan-500/5 p-10 flex-col justify-between border-r border-slate-200/20 text-left">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-600">
            <Sparkles className="fill-blue-500/10" size={24} />
            <span className="text-lg font-black tracking-tight">CareerDesk</span>
          </div>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
            Create Account
          </p>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-extrabold text-slate-900 leading-tight">
            Unlock your full professional potential.
          </h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-600 flex-shrink-0 mt-0.5">
                <Check size={12} />
              </div>
              <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                Receive visual ATS score indicator breakdowns.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-600 flex-shrink-0 mt-0.5">
                <Check size={12} />
              </div>
              <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                Step-by-step project blueprints to build skill sets.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-600 flex-shrink-0 mt-0.5">
                <Check size={12} />
              </div>
              <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                Filtered, location-based target job matching.
              </p>
            </li>
          </ul>
        </div>

        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Takes less than 10 seconds to begin
        </div>
      </div>

      {/* Right panel: Signup form */}
      <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-white/10 relative">
        <div className="flex flex-col items-center mb-5">
          <div className="w-10 h-10 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-600 mb-2.5 border border-blue-500/10">
            <UserPlus size={20} />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Get Started
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Sign up to scan and audit your resume
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group m-0 text-left">
              <label className="form-label font-bold" htmlFor="register-name">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  id="register-name"
                  className="form-input !pl-11"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-group m-0 text-left">
              <label className="form-label font-bold" htmlFor="register-gender">
                Gender
              </label>
              <select
                id="register-gender"
                className="form-select text-xs !py-2.5"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                disabled={isLoading}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="form-group text-left">
            <label className="form-label font-bold" htmlFor="register-email">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <Mail size={16} />
              </span>
              <input
                type="email"
                id="register-email"
                className="form-input !pl-11"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group text-left">
            <LocationSelector
              value={currentLocation}
              onChange={setCurrentLocation}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-password">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <Lock size={16} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                id="register-password"
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

          <div className="form-group">
            <label className="form-label" htmlFor="register-confirm-password">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <Lock size={16} />
              </span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="register-confirm-password"
                className="form-input !pl-11 !pr-11"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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
                Creating account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-slate-200/40 text-center">
          <p className="text-xs text-slate-600">
            Already have an account?{" "}
            <button
              type="button"
              className="text-blue-600 hover:text-blue-700 font-bold transition-colors"
              onClick={onNavigateToLogin}
              disabled={isLoading}
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>

    </div>
  );
}
