import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ReportSummaryItem, ReportDetails } from '../types';
import { MedicalDisclaimerBanner } from '../components/MedicalDisclaimerBanner';
import {
  GitCompare,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Activity,
  AlertCircle,
  FileText,
} from 'lucide-react';

export const ComparePage: React.FC = () => {
  const [reportsList, setReportsList] = useState<ReportSummaryItem[]>([]);
  const [reportAId, setReportAId] = useState<number | null>(null);
  const [reportBId, setReportBId] = useState<number | null>(null);
  const [reportA, setReportA] = useState<ReportDetails | null>(null);
  const [reportB, setReportB] = useState<ReportDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadList() {
      try {
        const list = await api.listReports();
        setReportsList(list);
        if (list.length >= 2) {
          setReportAId(list[1].id);
          setReportBId(list[0].id);
        } else if (list.length === 1) {
          setReportAId(list[0].id);
        }
      } catch {}
    }
    loadList();
  }, []);

  useEffect(() => {
    async function fetchBoth() {
      if (!reportAId || !reportBId) return;
      setIsLoading(true);
      try {
        const [a, b] = await Promise.all([api.getReport(reportAId), api.getReport(reportBId)]);
        setReportA(a);
        setReportB(b);
      } catch {}
      finally {
        setIsLoading(false);
      }
    }
    fetchBoth();
  }, [reportAId, reportBId]);

  // Combine matching terms
  const termsA = reportA?.terms_data || [];
  const termsB = reportB?.terms_data || [];

  const matchedTerms = termsA.map((ta) => {
    const cleanNameA = ta.term.toLowerCase().split('(')[0].trim();
    const tb = termsB.find((b) => b.term.toLowerCase().includes(cleanNameA) || cleanNameA.includes(b.term.toLowerCase().split('(')[0].trim()));
    return {
      termName: ta.term,
      category: ta.category,
      valA: ta.reported_value || 'Present',
      statusA: ta.status,
      valB: tb ? tb.reported_value || 'Present' : 'Not measured in report 2',
      statusB: tb ? tb.status : 'N/A',
      explanation: ta.simple_explanation,
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Disclaimer */}
      <MedicalDisclaimerBanner compact />

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
          <GitCompare className="w-6 h-6 text-sky-600 dark:text-sky-400" />
          Report Comparison Over Time
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Track changes in your laboratory parameters and biomarkers across different dates.
        </p>
      </div>

      {/* Responsible Comparison Guidance */}
      <div className="p-4 bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 rounded-2xl text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-sky-600 dark:text-sky-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong>Responsible Tracking Notice:</strong> Biological measurements fluctuate naturally based on hydration, fasting time, exercise, and laboratory analytical instruments. Changes in values are presented for comparison and should always be reviewed with your doctor rather than interpreted as a self-diagnosis.
        </div>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-card">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Baseline / Earlier Report (A)
          </label>
          <select
            value={reportAId || ''}
            onChange={(e) => setReportAId(Number(e.target.value))}
            className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
          >
            {reportsList.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title} ({new Date(r.created_at).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Recent / Follow-up Report (B)
          </label>
          <select
            value={reportBId || ''}
            onChange={(e) => setReportBId(Number(e.target.value))}
            className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
          >
            {reportsList.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title} ({new Date(r.created_at).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Table */}
      {isLoading ? (
        <div className="py-24 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <Activity className="w-5 h-5 animate-spin text-sky-600" />
          <span>Comparing biomarker timelines...</span>
        </div>
      ) : (!reportA || !reportB) ? (
        <div className="py-16 text-center text-xs text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
          Please upload or select two reports above to generate a side-by-side parameter timeline.
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-card overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Side-by-Side Parameter Evolution
            </h3>
            <span className="text-xs text-slate-500">
              {matchedTerms.length} comparison points
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                <tr>
                  <th className="p-4">Biomarker / Test Name</th>
                  <th className="p-4">Report A ({reportA.report_date || 'Date A'})</th>
                  <th className="p-4">Report B ({reportB.report_date || 'Date B'})</th>
                  <th className="p-4">Educational Meaning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {matchedTerms.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-slate-900 dark:text-slate-100">
                      {row.termName}
                      <span className="block text-[11px] font-normal text-slate-400">
                        {row.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold">{row.valA}</span>
                      <span className="block text-[11px] text-slate-500 capitalize">{row.statusA.replace('_', ' ')}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-sky-600 dark:text-sky-400">{row.valB}</span>
                      <span className="block text-[11px] text-slate-500 capitalize">{row.statusB.replace('_', ' ')}</span>
                    </td>
                    <td className="p-4 text-xs text-slate-600 dark:text-slate-300 max-w-xs leading-relaxed">
                      {row.explanation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
