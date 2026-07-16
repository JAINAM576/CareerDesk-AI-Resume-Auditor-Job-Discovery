import React, { useState, useEffect } from "react";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import LandingPage from "./components/LandingPage";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import UploadForm from "./components/UploadForm";
import DashboardGrid from "./components/dashboard/DashboardGrid";
import HistoryPanel from "./components/profile/HistoryPanel";
import ProfilePanel from "./components/profile/ProfilePanel";
import useResumeAnalysis from "./hooks/useResumeAnalysis";
import useSkillGap from "./hooks/useSkillGap";
import useJobSearch from "./hooks/useJobSearch";
import { ArrowLeft } from "lucide-react";
import { supabase } from "./api/supabase";
import HelpTermsModal from "./components/common/HelpTermsModal";

export default function App() {
  // Routing: 'landing', 'login', 'register', 'upload', 'dashboard', 'history', 'profile'
  const [viewState, setViewState] = useState("landing"); 
  const [user, setUser] = useState(null);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [docsModalOpen, setDocsModalOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [dashboardOrigin, setDashboardOrigin] = useState("upload"); // 'upload' or 'history'
  const [uploadedFile, setUploadedFile] = useState(null);
  const [preferences, setPreferences] = useState({
    targetRole: "",
    location: "",
    jobMode: "any"
  });

  const resumeAnalysis = useResumeAnalysis();
  const skillGap = useSkillGap();
  const jobSearch = useJobSearch();

  // Restore active Supabase session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser({
          email: session.user.email,
          fullName: session.user.user_metadata?.full_name || session.user.email.split("@")[0]
        });
        setViewState("upload");
      }
    };
    checkSession();

    // Subscribe to auth state updates
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser({
          email: session.user.email,
          fullName: session.user.user_metadata?.full_name || session.user.email.split("@")[0]
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load and seed history from Supabase when user logs in
  useEffect(() => {
    const fetchHistoryFromSupabase = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from("scan_history")
            .select("*")
            .eq("user_email", user.email)
            .order("created_at", { ascending: false });

          if (error) throw error;
          
          if (data && data.length > 0) {
            const mapped = data.map(row => ({
              id: row.id,
              fileName: row.file_name,
              targetRole: row.target_role,
              location: row.location,
              jobMode: row.job_mode,
              atsScore: row.ats_score,
              date: new Date(row.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              }),
              atsData: JSON.parse(row.ats_data),
              skillsData: JSON.parse(row.skills_data),
              jobsData: JSON.parse(row.jobs_data),
              resumeUrl: row.resume_url
            }));
            setHistory(mapped);
          } else {
            // Seed a high-quality demo item in Supabase for new accounts
            const mockHistoryItem = {
              user_email: user.email,
              file_name: "resume_lead_engineer.pdf",
              target_role: "Frontend Technical Lead",
              location: "Noida, India",
              job_mode: "remote",
              ats_score: 82,
              ats_data: JSON.stringify({
                ats_score: 82,
                issues: [
                  { severity: "critical", message: "Contact information section is missing target portfolio/GitHub links." },
                  { severity: "warning", message: "Core experience descriptions lack clear metric figures (e.g. % savings or user counts)." },
                  { severity: "suggestion", message: "Use action verbs like 'Architected' or 'Pioneered' at the start of sentence lists." }
                ],
                parsed_sections: ["Contact Info", "Core Skills", "Employment History", "Education Details"]
              }),
              skills_data: JSON.stringify({
                matched_skills: ["React.js", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Git"],
                missing_skills: ["Next.js", "Redux Toolkit", "TypeScript", "Webpack"],
                project_suggestions: [
                  "Build a real-time collaborative Kanban board with Next.js App Router and TypeScript to master typing patterns.",
                  "Create a state management library wrapper in Redux Toolkit integrating caching middleware for API data."
                ]
              }),
              jobs_data: JSON.stringify({
                results: [
                  { title: "Senior React Developer", company: "TechSolutions Ltd", location: "Noida, India", mode: "remote", posted: "1 day ago", apply_url: "#" },
                  { title: "Lead Frontend Engineer", company: "Innovate Corp", location: "Delhi, India", mode: "hybrid", posted: "3 days ago", apply_url: "#" }
                ]
              })
            };

            const { data: inserted, error: insertErr } = await supabase
              .from("scan_history")
              .insert([mockHistoryItem])
              .select();

            if (insertErr) throw insertErr;

            if (inserted && inserted.length > 0) {
              const row = inserted[0];
              setHistory([{
                id: row.id,
                fileName: row.file_name,
                targetRole: row.target_role,
                location: row.location,
                jobMode: row.job_mode,
                atsScore: row.ats_score,
                date: new Date(row.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                }),
                atsData: JSON.parse(row.ats_data),
                skillsData: JSON.parse(row.skills_data),
                jobsData: JSON.parse(row.jobs_data),
                resumeUrl: row.resume_url
              }]);
            }
          }
        } catch (err) {
          console.error("Failed to sync scan history from Supabase:", err);
          setHistory([]);
        }
      } else {
        setHistory([]);
      }
    };
    fetchHistoryFromSupabase();
  }, [user]);

  const handleLogin = (userData) => {
    setUser(userData);
    setViewState("upload");
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setViewState("upload");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setViewState("landing");
    setUploadedFile(null);
    // Clear data states
    resumeAnalysis.setData(null);
    skillGap.setData(null);
    jobSearch.setData(null);
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const handleUploadSubmit = async ({ file, targetRole, location, jobMode }) => {
    setPreferences({ targetRole, location, jobMode });
    setDashboardOrigin("upload");
    setUploadedFile(file);
    setViewState("dashboard");
    
    const analysisPromise = resumeAnalysis.analyzeResume(file, targetRole);
    const jobsPromise = jobSearch.searchJobs(targetRole, location, jobMode);
    
    try {
      const analysisData = await analysisPromise;
      let skillGapData = null;
      if (analysisData && analysisData.extracted_text) {
        skillGapData = await skillGap.fetchSkillGap(analysisData.extracted_text, targetRole);
      }
      const jobsData = await jobsPromise;
      
      // Save item to history
      if (user) {
        const newHistoryDbRecord = {
          user_email: user.email,
          file_name: file.name,
          target_role: targetRole,
          location: location,
          job_mode: jobMode,
          ats_score: analysisData?.ats_score || 0,
          ats_data: JSON.stringify(analysisData),
          skills_data: JSON.stringify(skillGapData),
          jobs_data: JSON.stringify(jobsData),
          resume_url: analysisData?.resume_url
        };

        const { data, error } = await supabase
          .from("scan_history")
          .insert([newHistoryDbRecord])
          .select();

        if (error) throw error;

        if (data && data.length > 0) {
          const row = data[0];
          const newHistoryItem = {
            id: row.id,
            fileName: row.file_name,
            targetRole: row.target_role,
            location: row.location,
            jobMode: row.job_mode,
            atsScore: row.ats_score,
            date: new Date(row.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            }),
            atsData: JSON.parse(row.ats_data),
            skillsData: JSON.parse(row.skills_data),
            jobsData: JSON.parse(row.jobs_data),
            resumeUrl: row.resume_url
          };
          setHistory([newHistoryItem, ...history]);
        }
      }
    } catch (err) {
      console.error("Resume analysis failed during onboarding submission:", err);
    }
  };

  // Restore dashboard state from historical scan
  const handleRestoreHistoryItem = (item) => {
    setPreferences({
      targetRole: item.targetRole,
      location: item.location,
      jobMode: item.jobMode
    });
    setDashboardOrigin("history");
    setUploadedFile(null);
    resumeAnalysis.setData(item.atsData);
    skillGap.setData(item.skillsData);
    jobSearch.setData(item.jobsData);
    setViewState("dashboard");
  };

  // Delete historical scan
  const handleDeleteHistoryItem = async (id) => {
    if (user && window.confirm("Are you sure you want to delete this scan from your history?")) {
      try {
        const { error } = await supabase
          .from("scan_history")
          .delete()
          .eq("id", id);

        if (error) throw error;

        setHistory(history.filter(item => item.id !== id));
      } catch (err) {
        console.error("Failed to delete scan record from Supabase:", err);
      }
    }
  };

  const handleBackToUpload = () => {
    setViewState("upload");
    setUploadedFile(null);
  };

  // Safe retry handlers
  const handleAtsRetry = () => {
    alert("Please re-upload your resume on the main screen to run a fresh analysis.");
    setViewState("upload");
  };

  const handleSkillsRetry = () => {
    if (resumeAnalysis.data?.extracted_text) {
      skillGap.fetchSkillGap(resumeAnalysis.data.extracted_text, preferences.targetRole);
    } else {
      alert("Missing parsed resume text. Please upload your resume again.");
      setViewState("upload");
    }
  };

  const handleJobsRetry = () => {
    jobSearch.searchJobs(preferences.targetRole, preferences.location, preferences.jobMode);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between">
      {/* Liquid Blobs Background */}
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />
      <div className="bg-blob bg-blob-3" />

      {/* Sticky Full-Width Navbar */}
      <Navbar 
        user={user}
        viewState={viewState}
        setViewState={setViewState}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <div className="container relative z-10 flex-grow flex flex-col pt-4">
        
        {/* View Routing */}
        <main className="flex-grow flex flex-col justify-center my-4">
          {viewState === "landing" && (
            <LandingPage
              onGetStarted={() => setViewState(user ? "upload" : "register")}
              user={user}
            />
          )}

          {viewState === "login" && (
            <Login
              onLogin={handleLogin}
              onNavigateToRegister={() => setViewState("register")}
            />
          )}

          {viewState === "register" && (
            <Register
              onRegister={handleRegister}
              onNavigateToLogin={() => setViewState("login")}
            />
          )}

          {viewState === "upload" && (
            <UploadForm 
              onSubmit={handleUploadSubmit} 
              isLoading={resumeAnalysis.isLoading} 
            />
          )}

          {viewState === "history" && user && (
            <HistoryPanel
              history={history}
              onRestore={handleRestoreHistoryItem}
              onDelete={handleDeleteHistoryItem}
            />
          )}

          {viewState === "profile" && user && (
            <ProfilePanel
              user={user}
              onUpdateUser={handleUpdateUser}
              history={history}
            />
          )}

          {viewState === "dashboard" && (
            <div className="fade-in-up text-left">
              {/* Breadcrumbs Navigation */}
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-6 bg-white/30 border border-white/50 px-4 py-2.5 rounded-xl self-start w-fit shadow-sm">
                {dashboardOrigin === "history" ? (
                  <>
                    <button 
                      onClick={() => setViewState("history")} 
                      className="hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      History Log
                    </button>
                    <span className="text-slate-300">/</span>
                    <span className="text-blue-600">Report: {preferences.targetRole}</span>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => setViewState("upload")} 
                      className="hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      ATS Scanner
                    </button>
                    <span className="text-slate-300">/</span>
                    <span className="text-blue-600">Dashboard: {preferences.targetRole}</span>
                  </>
                )}
              </div>

              <DashboardGrid
                targetPreferences={preferences}
                atsState={{
                  isLoading: resumeAnalysis.isLoading,
                  error: resumeAnalysis.error,
                  data: resumeAnalysis.data,
                  onRetry: handleAtsRetry
                }}
                skillsState={{
                  isLoading: skillGap.isLoading,
                  error: skillGap.error,
                  data: skillGap.data,
                  onRetry: handleSkillsRetry
                }}
                jobsState={{
                  isLoading: jobSearch.isLoading,
                  error: jobSearch.error,
                  data: jobSearch.data,
                  onRetry: handleJobsRetry
                }}
                uploadedFile={uploadedFile}
              />
            </div>
          )}
        </main>
      </div>

       {/* Footer Area */}
      <Footer 
        setViewState={setViewState}
        user={user}
        onShowHelp={() => setHelpModalOpen(true)}
        onShowTerms={() => setTermsModalOpen(true)}
        onShowDocs={() => setDocsModalOpen(true)}
      />

      {/* Help, Terms and Docs Modals */}
      <HelpTermsModal 
        isOpen={helpModalOpen} 
        onClose={() => setHelpModalOpen(false)} 
        type="help" 
      />
      <HelpTermsModal 
        isOpen={termsModalOpen} 
        onClose={() => setTermsModalOpen(false)} 
        type="terms" 
      />
      <HelpTermsModal 
        isOpen={docsModalOpen} 
        onClose={() => setDocsModalOpen(false)} 
        type="docs" 
      />
    </div>
  );
}
