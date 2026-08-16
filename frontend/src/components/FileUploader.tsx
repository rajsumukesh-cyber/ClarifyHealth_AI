import React, { useState, useRef } from 'react';
import { UploadCloud, File, FileText, Image as ImageIcon, CheckCircle, AlertCircle, X, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { ReportDetails } from '../types';

interface FileUploaderProps {
  onUploadSuccess: (report: ReportDetails) => void;
}

const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.jpg', '.jpeg', '.png'];
const MAX_FILE_SIZE_MB = 25;

export const FileUploader: React.FC<FileUploaderProps> = ({ onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customTitle, setCustomTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = (file: File) => {
    setError(null);
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setError(`Invalid file type. Supported formats: ${ALLOWED_EXTENSIONS.join(', ')}`);
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File is too large. Maximum allowed size is ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    setSelectedFile(file);
    if (!customTitle) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setCustomTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setError(null);
    setUploadProgress(15);

    // Simulate progressive upload & analysis milestones
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 85) {
          clearInterval(interval);
          return 90;
        }
        return prev + 15;
      });
    }, 400);

    try {
      const report = await api.uploadReport(selectedFile, customTitle);
      setUploadProgress(100);
      setTimeout(() => {
        clearInterval(interval);
        onUploadSuccess(report);
      }, 500);
    } catch (err: any) {
      clearInterval(interval);
      setIsUploading(false);
      setUploadProgress(0);
      setError(err.message || 'We could not read this document clearly. Please upload a clearer image or PDF.');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <FileText className="w-8 h-8 text-rose-500" />;
    if (['jpg', 'jpeg', 'png'].includes(ext || '')) return <ImageIcon className="w-8 h-8 text-sky-500" />;
    return <File className="w-8 h-8 text-teal-500" />;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-card transition-colors">
      <div className="text-center max-w-xl mx-auto mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
          Upload Your Medical Report
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Upload a lab test, blood work, or radiology report in PDF, DOCX, JPG, or PNG format
        </p>
      </div>

      {/* Drag & Drop Zone */}
      {!selectedFile ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3.5 ${
            dragActive
              ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/30 scale-[1.01]'
              : 'border-slate-300 dark:border-slate-700 hover:border-sky-400 bg-slate-50/50 dark:bg-slate-800/30'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="p-4 rounded-2xl bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400">
            <UploadCloud className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Drag & drop your medical report here, or <span className="text-sky-600 dark:text-sky-400 hover:underline">browse files</span>
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Supports PDF, DOCX, PNG, JPG (up to 25MB)
            </p>
          </div>
        </div>
      ) : (
        /* Selected File Card */
        <div className="space-y-5">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3.5">
              {getFileIcon(selectedFile.name)}
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate max-w-xs sm:max-w-md">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formatFileSize(selectedFile.size)} • Ready for AI extraction
                </p>
              </div>
            </div>

            {!isUploading && (
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setError(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Optional Title Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Report Title (Optional)
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="e.g. Annual Blood Work 2026, Fasting Glucose Check"
              disabled={isUploading}
              className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Progress Indicator */}
          {isUploading && (
            <div className="space-y-2 bg-sky-50/70 dark:bg-sky-950/40 p-4 rounded-xl border border-sky-100 dark:border-sky-900/50">
              <div className="flex items-center justify-between text-xs font-semibold text-sky-900 dark:text-sky-200">
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
                  Your report is being analyzed. This may take a few moments.
                </span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-sky-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Action Button */}
          {!isUploading && (
            <button
              onClick={handleUpload}
              className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm shadow-soft transition-all flex items-center justify-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Analyze & Simplify Report</span>
            </button>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs sm:text-sm text-rose-700 dark:text-rose-300 flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
