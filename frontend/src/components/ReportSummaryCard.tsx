import React, { useState } from 'react';
import { ReportDetails } from '../types';
import { FileText, Calendar, Layers, CheckCircle2, Sparkles, Volume2, VolumeX, AlertTriangle } from 'lucide-react';
import { ttsService } from '../services/ttsService';

interface ReportSummaryCardProps {
  report: ReportDetails;
  simplifiedMode: boolean;
  onToggleSimplifiedMode: () => void;
}

export const ReportSummaryCard: React.FC<ReportSummaryCardProps> = ({
  report,
  simplifiedMode,
  onToggleSimplifiedMode,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const abnormalCount = (report.terms_data || []).filter(
    (t) => t.status === 'high' || t.status === 'low' || t.status === 'needs_attention'
  ).length;

  const currentSummary = simplifiedMode
    ? report.simplified_mode_text || report.simple_summary || 'No simplified summary available.'
    : report.simple_summary || 'No summary available.';

  const toggleAudio = () => {
    if (isPlaying) {
      ttsService.stop();
      setIsPlaying(false);
    } else {
      ttsService.setListener((speaking) => setIsPlaying(speaking));
      ttsService.speak(currentSummary);
      setIsPlaying(true);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-soft mb-8 transition-colors">
      {/* Top Header & Metadata */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
              {report.report_type}
            </span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Analysis Completed
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {report.title}
          </h1>
        </div>

        {/* Quick Stats Pills */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Date: <strong>{report.report_date || 'Recent'}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
            <Layers className="w-4 h-4 text-slate-400" />
            <span>Pages: <strong>{report.page_count}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
            <FileText className="w-4 h-4 text-slate-400" />
            <span>Terms Identified: <strong>{report.terms_data?.length || 0}</strong></span>
          </div>
          {abnormalCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Outside Range: <strong>{abnormalCount}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Summary Box */}
      <div className="mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {simplifiedMode ? 'Ultra-Simple Breakdown (5th Grade Level)' : 'Plain-Language Educational Summary'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Mode Switcher */}
            <button
              onClick={onToggleSimplifiedMode}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                simplifiedMode
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explain Like I'm New</span>
            </button>

            {/* Audio Readout */}
            <button
              onClick={toggleAudio}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                isPlaying
                  ? 'bg-emerald-600 text-white animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              title={isPlaying ? 'Stop narration' : 'Listen to summary readout'}
            >
              {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause Audio' : 'Listen'}</span>
            </button>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-5 border border-slate-100 dark:border-slate-800/80 text-slate-700 dark:text-slate-200 leading-relaxed text-sm sm:text-base">
          {currentSummary}
        </div>
      </div>
    </div>
  );
};
