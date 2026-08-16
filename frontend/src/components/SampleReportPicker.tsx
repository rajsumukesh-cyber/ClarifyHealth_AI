import React, { useState, useEffect } from 'react';
import { SampleReportPreset, ReportDetails } from '../types';
import { api } from '../services/api';
import { TestTube, Heart, Dna, FileCheck, ArrowRight, Loader2, Sparkles } from 'lucide-react';

interface SampleReportPickerProps {
  onSelectReport: (report: ReportDetails) => void;
}

export const SampleReportPicker: React.FC<SampleReportPickerProps> = ({ onSelectReport }) => {
  const [presets, setPresets] = useState<SampleReportPreset[]>([]);
  const [loadingPresetId, setLoadingPresetId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPresets() {
      try {
        const list = await api.listPresets();
        setPresets(list);
      } catch {
        // Fallback static list if network error
      }
    }
    fetchPresets();
  }, []);

  const handleLoad = async (presetId: string) => {
    setLoadingPresetId(presetId);
    setError(null);
    try {
      const report = await api.loadPreset(presetId);
      onSelectReport(report);
    } catch (err: any) {
      setError(err.message || 'Failed to load sample report.');
      setLoadingPresetId(null);
    }
  };

  const getPresetIcon = (id: string) => {
    if (id.includes('cbc')) return <TestTube className="w-5 h-5 text-rose-500" />;
    if (id.includes('lipid')) return <Heart className="w-5 h-5 text-amber-500" />;
    if (id.includes('cmp') || id.includes('metabolic')) return <Dna className="w-5 h-5 text-teal-500" />;
    return <FileCheck className="w-5 h-5 text-sky-500" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            Try with Sample Medical Reports (1-Click Demo)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Test the AI simplifier immediately using synthetic, clinically accurate health records
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {presets.map((p) => {
          const isLoading = loadingPresetId === p.preset_id;
          return (
            <div
              key={p.preset_id}
              onClick={() => !isLoading && handleLoad(p.preset_id)}
              className={`p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-sky-400 dark:hover:border-sky-600 hover:shadow-card cursor-pointer transition-all duration-200 flex flex-col justify-between group ${
                isLoading ? 'opacity-70 pointer-events-none' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                    {getPresetIcon(p.preset_id)}
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    Synthetic
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1">
                  {p.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                  {p.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-sky-600 dark:text-sky-400">
                <span>{isLoading ? 'Analyzing...' : 'Load & Simplify'}</span>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
