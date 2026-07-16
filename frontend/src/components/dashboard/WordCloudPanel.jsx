import React, { useState, useEffect, useMemo } from "react";
import { Tag, Sparkles, HelpCircle } from "lucide-react";

// Standard stop words to filter out common grammar words
const STOP_WORDS = new Set([
  "the", "and", "a", "for", "with", "to", "in", "on", "at", "of", "from", "by", "an", "is", "are", "was", "were", 
  "be", "been", "have", "has", "had", "do", "does", "did", "this", "that", "these", "those", "i", "we", "you", 
  "he", "she", "it", "they", "me", "us", "him", "her", "them", "my", "our", "your", "his", "its", "their", 
  "but", "or", "as", "if", "when", "can", "will", "would", "should", "could", "about", "more", "than", "so", 
  "up", "out", "into", "over", "some", "any", "no", "not", "only", "other", "new", "using", "work", "worked", 
  "experience", "skills", "system", "systems", "project", "projects", "management", "team", "development", 
  "developer", "engineering", "engineer", "software", "applications", "application", "technology", "technologies", 
  "key", "role", "use", "using", "used", "responsible", "focused", "involved", "built", "implemented", "managed", 
  "designed", "created", "led", "developed", "various", "including", "across", "within", "high", "through", 
  "well", "both", "all", "each", "first", "details", "results", "analysis", "audit", "job", "career", "support", 
  "highly", "successfully", "efficient", "professional", "working"
]);

export default function WordCloudPanel({ text, matchedSkills }) {
  const [hoveredWord, setHoveredWord] = useState(null);

  // Compute keyword densities
  const keywords = useMemo(() => {
    if (!text) return [];

    // Clean text: lowercase, replace punctuation/digits with spaces
    const cleanText = text
      .toLowerCase()
      .replace(/[^a-zA-Z\s\-#+]/g, " ") // Keep standard letters, hyphens, C#, C++
      .replace(/\s+/g, " ");

    const words = cleanText.split(" ");
    const freqMap = {};

    words.forEach((w) => {
      const word = w.trim();
      // Only keep words that are > 2 chars, are not stop words, do not consist only of hyphens, and do not contain pure numbers
      if (word.length > 2 && !STOP_WORDS.has(word) && !/^-+$/.test(word) && !/^\d+$/.test(word)) {
        freqMap[word] = (freqMap[word] || 0) + 1;
      }
    });

    // Convert to array and sort by frequency
    const sorted = Object.entries(freqMap)
      .map(([word, freq]) => ({ word, freq }))
      .sort((a, b) => b.freq - a.freq)
      .slice(0, 30); // Take top 30 keywords

    return sorted;
  }, [text]);

  const maxFreq = useMemo(() => {
    if (keywords.length === 0) return 1;
    return Math.max(...keywords.map((k) => k.freq));
  }, [keywords]);

  // Check if a keyword matches any of our target skills
  const isTargetSkill = (word) => {
    const wordLower = word.toLowerCase();
    return matchedSkills.some(
      (s) => s.toLowerCase() === wordLower || s.toLowerCase().includes(wordLower)
    );
  };

  return (
    <div className="glass-card flex flex-col h-[550px] border border-white/60 p-6 md:p-8 overflow-hidden text-left shadow-premium">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-600/10 rounded-lg text-blue-600 border border-blue-500/10">
            <Tag size={16} />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900 tracking-wide">
            Keyword Density Map
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold bg-slate-100 py-1 px-2.5 rounded-lg">
          <Sparkles size={11} className="text-blue-600" />
          Top 30 Terms
        </div>
      </div>

      <p className="text-[11px] font-semibold text-slate-500 mb-6 leading-relaxed">
        ATS filters scan and index keywords from your resume. Below is the density map of terms parsed from your document. Green highlights represent keywords aligning with your matched technical skills.
      </p>

      {/* Main Grid: Split between Cloud and Table */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 flex-grow min-h-0 overflow-hidden">
        {/* Left Side: Cloud Container */}
        <div className="md:col-span-3 flex items-center justify-center p-6 bg-slate-900/[0.02] border border-slate-200/10 rounded-2xl h-full max-h-[350px] overflow-y-auto select-none relative">
          {keywords.length === 0 ? (
            <span className="text-xs font-semibold text-slate-400">No keywords parsed from document.</span>
          ) : (
            <div className="flex flex-wrap gap-x-4 gap-y-3 justify-center items-center max-w-full">
              {keywords.map(({ word, freq }) => {
                // Calculate font size relative to frequency (range: 11px to 26px)
                const size = 11 + (freq / maxFreq) * 15;
                const isSkill = isTargetSkill(word);
                
                let textColor = "text-slate-600 hover:text-slate-800";
                let bgStyle = "bg-slate-100/50 hover:bg-slate-100";
                
                if (isSkill) {
                  textColor = "text-emerald-700 hover:text-emerald-800 font-bold";
                  bgStyle = "bg-emerald-500/5 border border-emerald-500/15 hover:bg-emerald-500/10";
                } else if (freq / maxFreq > 0.6) {
                  textColor = "text-blue-600 hover:text-blue-700 font-extrabold";
                  bgStyle = "bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10";
                }

                return (
                  <span
                    key={word}
                    style={{ fontSize: `${size}px` }}
                    className={`inline-block py-1.5 px-3 rounded-xl transition-all duration-200 cursor-pointer ${textColor} ${bgStyle} transform hover:scale-105`}
                    onMouseEnter={() => setHoveredWord({ word, freq, isSkill })}
                    onMouseLeave={() => setHoveredWord(null)}
                  >
                    {word}
                  </span>
                );
              })}
            </div>
          )}

          {/* Inline Hover Tooltip */}
          {hoveredWord && (
            <div className="absolute bottom-3 left-3 right-3 bg-slate-900 text-white rounded-xl p-2 text-center text-[10px] font-bold shadow-premium border border-slate-800 animate-fadeInUp">
              Keyword: <span className="text-cyan-400 font-extrabold">"{hoveredWord.word}"</span> — Mentions: <span className="text-blue-400 font-extrabold">{hoveredWord.freq}</span> {hoveredWord.isSkill && <span className="text-emerald-400 font-extrabold ml-1.5">(Matched Skill)</span>}
            </div>
          )}
        </div>

        {/* Right Side: List Table */}
        <div className="md:col-span-2 flex flex-col min-h-0 overflow-hidden">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
            Keyword Density Ranks
          </span>
          <div className="flex-grow overflow-y-auto pr-1 space-y-2">
            {keywords.slice(0, 10).map(({ word, freq }, index) => {
              const isSkill = isTargetSkill(word);
              return (
                <div
                  key={word}
                  className="flex items-center justify-between p-2.5 bg-white/40 border border-white/60 rounded-xl text-xs hover:border-blue-500/20 transition-colors"
                >
                  <div className="flex items-center gap-2 text-left">
                    <span className="text-[10px] font-extrabold text-slate-400 w-4">
                      #{index + 1}
                    </span>
                    <span className={`font-bold ${isSkill ? "text-emerald-600" : "text-slate-800"}`}>
                      {word}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isSkill && (
                      <span className="text-[8px] bg-emerald-500/10 text-emerald-600 font-extrabold py-0.5 px-1.5 rounded uppercase">
                        Skill
                      </span>
                    )}
                    <span className="badge badge-muted font-bold py-0.5 px-2 text-[10px]">
                      {freq} hits
                    </span>
                  </div>
                </div>
              );
            })}
            {keywords.length === 0 && (
              <p className="text-xs text-slate-400">No density ranks available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
