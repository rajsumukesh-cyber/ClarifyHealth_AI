import React, { useState } from 'react';
import { FileText, Sparkles, Search, Copy, Check } from 'lucide-react';
import { TermItem } from '../types';

interface SideBySideViewerProps {
  originalText: string;
  terms: TermItem[];
  simplifiedSummary: string;
}

export const SideBySideViewer: React.FC<SideBySideViewerProps> = ({
  originalText,
  terms,
  simplifiedSummary,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [copiedSimplified, setCopiedSimplified] = useState(false);

  const filteredTerms = terms.filter(
    (t) =>
      t.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.simple_explanation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyOriginal = () => {
    navigator.clipboard.writeText(originalText);
    setCopiedOriginal(true);
    setTimeout(() => setCopiedOriginal(false), 2000);
  };

  const handleCopySimplified = () => {
    const simplifiedFull = `${simplifiedSummary}\n\n` +
      filteredTerms
        .map(
          (t) =>
            `• ${t.term}: ${t.reported_value || ''} (${t.status.replace('_', ' ')})\n  Explanation: ${t.simple_explanation}\n  Meaning: ${t.what_it_means}`
        )
        .join('\n\n');
    navigator.clipboard.writeText(simplifiedFull);
    setCopiedSimplified(true);
    setTimeout(() => setCopiedSimplified(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-soft">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Side-by-Side Comparison
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Compare the raw technical document with the patient-friendly simplified translation
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search terms..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Left: Original Technical Text */}
        <div className="flex flex-col h-[520px] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-900 text-slate-200 font-mono text-xs">
          <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-300 font-sans font-semibold">
              <FileText className="w-4 h-4 text-sky-400" />
              <span>Original Extracted Text (Technical)</span>
            </div>
            <button
              onClick={handleCopyOriginal}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 transition-colors font-sans"
            >
              {copiedOriginal ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedOriginal ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="p-4 overflow-y-auto whitespace-pre-wrap leading-relaxed flex-1 selection:bg-sky-500 selection:text-white">
            {originalText || '[No raw text available]'}
          </div>
        </div>

        {/* Right: Simplified Translation */}
        <div className="flex flex-col h-[520px] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50/50 dark:bg-slate-950/40">
          <div className="px-4 py-2.5 bg-sky-50/80 dark:bg-sky-950/60 border-b border-sky-100 dark:border-sky-900/40 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sky-900 dark:text-sky-200 font-sans font-semibold text-xs">
              <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Plain Language Translation</span>
            </div>
            <button
              onClick={handleCopySimplified}
              className="px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-[11px] flex items-center gap-1 transition-colors"
            >
              {copiedSimplified ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copiedSimplified ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="p-4 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-slate-100 block mb-1 text-xs uppercase tracking-wider font-bold text-sky-700 dark:text-sky-400">
                Summary
              </strong>
              {simplifiedSummary}
            </div>

            <div className="space-y-3">
              {filteredTerms.map((t, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{t.term}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {t.reported_value || 'Present'}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-xs">{t.simple_explanation}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] italic bg-slate-50 dark:bg-slate-800/40 p-2 rounded">
                    {t.what_it_means}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
