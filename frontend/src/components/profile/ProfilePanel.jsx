import React, { useState } from "react";
import { User, Mail, Shield, MapPin, Briefcase, Clock, AlertCircle, Save, CheckCircle } from "lucide-react";
import LocationSelector from "../common/LocationSelector";

export default function ProfilePanel({ user, onUpdateUser, history }) {
  // Local states for inputs
  const [fullName, setFullName] = useState(user.fullName || "John Doe");
  const [defaultRole, setDefaultRole] = useState(user.defaultRole || "");
  const [defaultLocation, setDefaultLocation] = useState(user.defaultLocation || "");
  const [defaultJobMode, setDefaultJobMode] = useState(user.defaultJobMode || "any");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [prefMessage, setPrefMessage] = useState("");
  const [prefError, setPrefError] = useState("");
  const [secMessage, setSecMessage] = useState("");
  const [secError, setSecError] = useState("");

  // Statistics
  const totalScans = history.length;
  const highestScore = totalScans > 0 ? Math.max(...history.map(item => item.atsScore)) : 0;

  const handleUpdatePreferences = (e) => {
    e.preventDefault();
    setPrefError("");
    setPrefMessage("");

    if (!fullName.trim()) {
      setPrefError("Full name is required.");
      return;
    }

    // Call update handler
    onUpdateUser({
      ...user,
      fullName: fullName.trim(),
      defaultRole: defaultRole.trim(),
      defaultLocation: defaultLocation.trim(),
      defaultJobMode
    });

    setPrefMessage("Preferences updated successfully!");
    setTimeout(() => setPrefMessage(""), 3000);
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    setSecError("");
    setSecMessage("");

    if (!currentPassword) {
      setSecError("Please enter your current password.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setSecError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setSecError("Passwords do not match.");
      return;
    }

    setSecMessage("Password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setSecMessage(""), 3000);
  };

  // Get initials for profile placeholder
  const getInitials = (name) => {
    const parts = name.split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="fade-in-up grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
      
      {/* Left Column: Profile Card & Stats */}
      <div className="lg:col-span-1 space-y-6">
        <div className="glass-card p-6 border border-white/60 text-center flex flex-col items-center shadow-sm">
          {/* Avatar circle */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-extrabold text-2xl mb-4 border-2 border-white shadow-md select-none">
            {getInitials(fullName)}
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
            {fullName}
          </h3>
          <p className="text-xs text-slate-500 font-semibold mb-6 flex items-center gap-1.5 justify-center">
            <Mail size={12} className="text-slate-400" />
            {user.email}
          </p>

          <hr className="w-full border-slate-200/40 mb-6" />

          {/* Stats blocks */}
          <div className="w-full space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-semibold">Resumes Scanned</span>
              <span className="font-extrabold text-slate-800 bg-slate-100 py-0.5 px-2.5 rounded-lg border border-slate-200/20">{totalScans}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-semibold">Peak ATS Score</span>
              <span className="font-extrabold text-slate-800 bg-slate-100 py-0.5 px-2.5 rounded-lg border border-slate-200/20">{highestScore}/100</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-semibold">Member Since</span>
              <span className="font-extrabold text-slate-800 bg-slate-100 py-0.5 px-2.5 rounded-lg border border-slate-200/20">July 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Preferences & Security Forms */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Profile Settings */}
        <div className="glass-card p-6 md:p-8 border border-white/60 shadow-sm space-y-5">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <User size={18} className="text-blue-600" />
              Profile Preferences
            </h3>
            <p className="text-xs text-slate-500">
              Configure default filters and values for onboarding forms.
            </p>
          </div>

          <form onSubmit={handleUpdatePreferences} className="space-y-4">
            <div className="form-group m-0 text-left">
              <label className="form-label" htmlFor="prof-name">Full Name</label>
              <input
                type="text"
                id="prof-name"
                className="form-input text-xs"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div className="form-group m-0">
                <label className="form-label" htmlFor="prof-role">Default Target Role</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Briefcase size={14} />
                  </span>
                  <input
                    type="text"
                    id="prof-role"
                    className="form-input !pl-10 text-xs"
                    placeholder="e.g. Frontend Developer"
                    value={defaultRole}
                    onChange={(e) => setDefaultRole(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group m-0">
                <label className="form-label" htmlFor="prof-mode">Default Job Mode</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Clock size={14} />
                  </span>
                  <select
                    id="prof-mode"
                    className="form-select !pl-10 text-xs"
                    value={defaultJobMode}
                    onChange={(e) => setDefaultJobMode(e.target.value)}
                  >
                    <option value="any">Any Mode</option>
                    <option value="remote">Remote Only</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="on-site">On-site</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-group m-0 text-left">
              <label className="form-label">Default Target Location</label>
              <LocationSelector
                value={defaultLocation}
                onChange={setDefaultLocation}
              />
            </div>

            {/* Notifications */}
            {prefError && (
              <div className="flex gap-2 items-center bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                <AlertCircle size={16} className="text-red-600 flex-shrink-0" />
                <p className="text-[11px] text-red-700 font-semibold">{prefError}</p>
              </div>
            )}
            {prefMessage && (
              <div className="flex gap-2 items-center bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                <CheckCircle size={16} className="text-emerald-600 flex-shrink-0" />
                <p className="text-[11px] text-emerald-700 font-semibold">{prefMessage}</p>
              </div>
            )}

            <button
              type="submit"
              className="btn-primary flex items-center justify-center gap-2 py-2 px-5 text-xs font-bold sm:w-auto shadow-sm"
            >
              <Save size={14} />
              Save Preferences
            </button>
          </form>
        </div>

        {/* Security Settings */}
        <div className="glass-card p-6 md:p-8 border border-white/60 shadow-sm space-y-5">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Shield size={18} className="text-blue-600" />
              Security Settings
            </h3>
            <p className="text-xs text-slate-500">
              Update password credentials for account protection.
            </p>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="form-group m-0">
                <label className="form-label" htmlFor="sec-curr">Current Password</label>
                <input
                  type="password"
                  id="sec-curr"
                  className="form-input text-xs"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="form-group m-0">
                <label className="form-label" htmlFor="sec-new">New Password</label>
                <input
                  type="password"
                  id="sec-new"
                  className="form-input text-xs"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="form-group m-0">
                <label className="form-label" htmlFor="sec-conf">Confirm Password</label>
                <input
                  type="password"
                  id="sec-conf"
                  className="form-input text-xs"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Notifications */}
            {secError && (
              <div className="flex gap-2 items-center bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                <AlertCircle size={16} className="text-red-600 flex-shrink-0" />
                <p className="text-[11px] text-red-700 font-semibold">{secError}</p>
              </div>
            )}
            {secMessage && (
              <div className="flex gap-2 items-center bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                <CheckCircle size={16} className="text-emerald-600 flex-shrink-0" />
                <p className="text-[11px] text-emerald-700 font-semibold">{secMessage}</p>
              </div>
            )}

            <button
              type="submit"
              className="btn-primary flex items-center justify-center gap-2 py-2 px-5 text-xs font-bold sm:w-auto shadow-sm"
            >
              <Save size={14} />
              Change Password
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
