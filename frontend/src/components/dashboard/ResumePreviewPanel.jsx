import React, { useState, useEffect } from "react";
import { FileText, Eye, AlertCircle, Download, FileSpreadsheet } from "lucide-react";

export default function ResumePreviewPanel({ file, resumeUrl }) {
  const [fileUrl, setFileUrl] = useState(null);
  const [isPdf, setIsPdf] = useState(false);

  useEffect(() => {
    if (!file && !resumeUrl) {
      setFileUrl(null);
      setIsPdf(false);
      return;
    }

    if (file) {
      const name = file.name.toLowerCase();
      const pdfCheck = name.endsWith(".pdf");
      setIsPdf(pdfCheck);

      const url = URL.createObjectURL(file);
      setFileUrl(url);

      return () => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      };
    } else if (resumeUrl) {
      const isPdfUrl = resumeUrl.toLowerCase().includes(".pdf") || !resumeUrl.toLowerCase().includes(".docx");
      setIsPdf(isPdfUrl);
      setFileUrl(resumeUrl);
    }
  }, [file, resumeUrl]);

  return (
    <div className="glass-card flex flex-col h-[650px] border border-white/60 p-0 overflow-hidden shadow-premium">
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-900/[0.03] border-b border-slate-200/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-600/10 rounded-lg text-blue-600 border border-blue-500/10">
            <FileText size={16} />
          </div>
          <span className="text-xs font-bold text-slate-800 tracking-wide uppercase">
            Resume Preview
          </span>
        </div>
        {(file || resumeUrl) && (
          <span className="text-[10px] bg-slate-200/50 text-slate-600 font-bold px-2 py-0.5 rounded-md uppercase">
            {isPdf ? "PDF Document" : "Word Document"}
          </span>
        )}
      </div>

      {/* Preview Content Area */}
      <div className="flex-grow relative bg-slate-950/5 flex items-center justify-center p-0">
        {!file && !resumeUrl ? (
          /* Case A: No file loaded (Restored from history) */
          <div className="p-8 text-center max-w-sm space-y-4">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/10 shadow-sm">
              <AlertCircle size={24} />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-800 mb-1">
                Visual Preview Unavailable
              </h4>
              <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                You are viewing a restored report from your history. To view your PDF document side-by-side with the suggestions, please re-upload your resume.
              </p>
            </div>
          </div>
        ) : isPdf && fileUrl ? (
          /* Case B: PDF File loaded (Render native viewer iframe) */
          <iframe
            src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=1`}
            title="Resume PDF Preview"
            className="w-full h-full border-0 bg-white"
          />
        ) : (
          /* Case C: DOCX File loaded (Render placeholder) */
          <div className="p-8 text-center max-w-sm space-y-4">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-600 border border-blue-500/10 shadow-sm">
              <FileSpreadsheet size={24} />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-800 mb-1">
                Word Resume (.docx)
              </h4>
              <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mb-4">
                Interactive previews are optimized for PDF documents. You can download and review your Word resume details below.
              </p>
              <a
                href={fileUrl}
                download={file ? file.name : "resume.docx"}
                className="btn-secondary inline-flex items-center gap-2 text-xs font-bold py-2 px-4 shadow-sm w-fit"
              >
                <Download size={14} />
                Download Document
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
