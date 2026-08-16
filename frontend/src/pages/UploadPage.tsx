import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUploader } from '../components/FileUploader';
import { SampleReportPicker } from '../components/SampleReportPicker';
import { MedicalDisclaimerBanner } from '../components/MedicalDisclaimerBanner';
import { ReportDetails } from '../types';
import { UploadCloud, Sparkles, ShieldCheck, FileCheck } from 'lucide-react';

export const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'upload' | 'sample'>('upload');

  const handleUploadSuccess = (report: ReportDetails) => {
    navigate(`/reports/${report.id}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Disclaimer */}
      <MedicalDisclaimerBanner compact />

      {/* Tabs */}
      <div className="flex items-center justify-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'upload'
              ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload File (PDF / Image)</span>
        </button>
        <button
          onClick={() => setActiveTab('sample')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'sample'
              ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Use Sample Report</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'upload' ? (
        <div className="space-y-6">
          <FileUploader onUploadSuccess={handleUploadSuccess} />

          {/* Tips Box */}
          <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 text-xs text-slate-600 dark:text-slate-400 space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 text-sm">
              <FileCheck className="w-4 h-4 text-sky-500" />
              Tips for Best Extraction Quality
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 list-disc list-inside">
              <li>Upload original digital PDFs rather than camera photos when available.</li>
              <li>For photos or scans, ensure adequate lighting and high document contrast.</li>
              <li>Keep tables and lab value columns aligned and legible.</li>
              <li>Multiple pages in single PDFs are fully supported and extracted.</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-soft">
          <SampleReportPicker onSelectReport={handleUploadSuccess} />
        </div>
      )}
    </div>
  );
};
