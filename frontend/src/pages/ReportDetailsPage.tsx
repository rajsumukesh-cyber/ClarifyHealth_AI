import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ReportDetails, TermItem } from '../types';
import { MedicalDisclaimerBanner } from '../components/MedicalDisclaimerBanner';
import { ReportSummaryCard } from '../components/ReportSummaryCard';
import { TermCard } from '../components/TermCard';
import { DoctorQuestionsCard } from '../components/DoctorQuestionsCard';
import { SideBySideViewer } from '../components/SideBySideViewer';
import { ChatInterface } from '../components/ChatInterface';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../services/translator';
import {
  Activity,
  ArrowLeft,
  RefreshCw,
  Trash2,
  Printer,
  Sparkles,
  Layers,
  MessageSquare,
  FileText,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Filter,
  Search,
  Globe,
  Download,
} from 'lucide-react';

export const ReportDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<ReportDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isResimplifying, setIsResimplifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [simplifiedMode, setSimplifiedMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('en');

  // Tabs: 'terms' | 'chat' | 'questions' | 'sidebyside' | 'abbreviations'
  const [activeTab, setActiveTab] = useState<'terms' | 'chat' | 'questions' | 'sidebyside' | 'abbreviations'>('terms');

  // Filter terms by status
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [termSearch, setTermSearch] = useState<string>('');

  useEffect(() => {
    if (id) {
      loadReportDetails(parseInt(id, 10));
    }
  }, [id]);

  const loadReportDetails = async (reportId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getReport(reportId);
      setReport(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load report details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResimplify = async () => {
    if (!report) return;
    setIsResimplifying(true);
    try {
      const updated = await api.resimplifyReport(report.id);
      setReport(updated);
    } catch (err: any) {
      alert(err.message || 'Failed to re-simplify report.');
    } finally {
      setIsResimplifying(false);
    }
  };

  const handleDelete = async () => {
    if (!report) return;
    if (!window.confirm('Are you sure you want to permanently delete this report?')) return;
    try {
      await api.deleteReport(report.id);
      navigate('/dashboard');
    } catch (err: any) {
      alert(err.message || 'Failed to delete report.');
    }
  };

  const handleDownloadSummary = () => {
    if (!report) return;
    const content = `CLARIFYHEALTH PATIENT MEDICAL SUMMARY
==================================================
Report Title: ${report.title}
Report Type: ${report.report_type}
Date: ${report.report_date || 'Recent'}
Original File: ${report.original_filename}

IMPORTANT MEDICAL DISCLAIMER:
This summary is for educational purposes only and is not a medical diagnosis or replacement for a doctor. Discuss all results with your healthcare provider.

EXECUTIVE SUMMARY:
${report.simple_summary || 'N/A'}

IDENTIFIED MEDICAL PARAMETERS & BIOMARKERS:
--------------------------------------------------
${(report.terms_data || [])
  .map(
    (t, i) =>
      `${i + 1}. ${t.term} (${t.category})\n   Your Value: ${t.reported_value || 'Present'}\n   Reference Interval: ${t.reference_range || 'Standard'}\n   Status: ${t.status.replace('_', ' ').toUpperCase()}\n   Simple Meaning: ${t.simple_explanation}\n   What It Means: ${t.what_it_means}\n   Why It Matters: ${t.why_it_matters}\n`
  )
  .join('\n')}

QUESTIONS TO ASK YOUR DOCTOR:
--------------------------------------------------
${(report.doctor_questions || []).map((q, i) => `${i + 1}. ${q}`).join('\n')}
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ClarifyHealth_Summary_${report.title.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24 text-center space-y-4">
        <Activity className="w-8 h-8 animate-spin text-sky-600 mx-auto" />
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Loading report analysis...
        </p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl inline-block">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          {error || 'Report not found'}
        </h3>
        <p className="text-xs text-slate-500">
          The requested medical report could not be loaded or may have been deleted.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-semibold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Filtered terms
  const termsList = report.terms_data || [];
  const filteredTerms = termsList.filter((t) => {
    const matchesFilter =
      statusFilter === 'all' ||
      (statusFilter === 'abnormal' && ['high', 'low', 'needs_attention'].includes(t.status)) ||
      t.status === statusFilter;
    const matchesSearch =
      t.term.toLowerCase().includes(termSearch.toLowerCase()) ||
      t.simple_explanation.toLowerCase().includes(termSearch.toLowerCase()) ||
      t.category.toLowerCase().includes(termSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const abnormalCount = termsList.filter((t) =>
    ['high', 'low', 'needs_attention'].includes(t.status)
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-sky-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
          {/* Multi-language Selector */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl text-xs">
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as SupportedLanguage)}
              className="bg-transparent text-slate-700 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-white dark:bg-slate-900">
                  {lang.flag} {lang.nativeName}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleDownloadSummary}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Download formatted patient summary text file"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Summary</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleResimplify}
            disabled={isResimplifying}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Re-run AI simplification"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isResimplifying ? 'animate-spin' : ''}`} />
            <span>{isResimplifying ? 'Simplifying...' : 'Re-Simplify'}</span>
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Permanently delete report"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Global Safety Disclaimer Banner */}
      <MedicalDisclaimerBanner />

      {/* Report Summary Card */}
      <ReportSummaryCard
        report={report}
        simplifiedMode={simplifiedMode}
        onToggleSimplifiedMode={() => setSimplifiedMode(!simplifiedMode)}
      />

      {/* Unclear Sections Notice (if any) */}
      {report.unclear_sections && report.unclear_sections.length > 0 && (
        <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-4 text-xs text-amber-800 dark:text-amber-300 space-y-1.5">
          <div className="flex items-center gap-2 font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Extraction Confidence Notices</span>
          </div>
          <p className="leading-relaxed">
            The following portions of your document required estimated parsing due to scan quality or non-standard formatting:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-1 text-[11px]">
            {report.unclear_sections.map((sec, idx) => (
              <li key={idx}>{sec}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Navigation View Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-px">
          {[
            { id: 'terms', label: `Medical Terms & Values (${termsList.length})`, icon: Layers },
            { id: 'chat', label: 'Ask About This Report (Voice & Text)', icon: MessageSquare },
            { id: 'questions', label: `Doctor Questions (${report.doctor_questions?.length || 0})`, icon: Sparkles },
            { id: 'sidebyside', label: 'Side-by-Side Dual View', icon: FileText },
            { id: 'abbreviations', label: `Abbreviations (${report.abbreviations_data?.length || 0})`, icon: BookOpen },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap flex items-center gap-2 transition-all ${
                activeTab === tab.id
                  ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: Terms & Lab Values */}
      {activeTab === 'terms' && (
        <div className="space-y-6">
          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/70 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </span>
              {[
                { id: 'all', label: 'All Values' },
                { id: 'abnormal', label: `Outside Range (${abnormalCount})` },
                { id: 'within_range', label: 'Within Range' },
                { id: 'high', label: 'High' },
                { id: 'low', label: 'Low' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setStatusFilter(filter.id)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                    statusFilter === filter.id
                      ? 'bg-sky-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={termSearch}
                onChange={(e) => setTermSearch(e.target.value)}
                placeholder="Search biomarker or term..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Terms Grid */}
          {filteredTerms.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-500">
              No medical terms matched the selected filter or search term.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTerms.map((term, idx) => (
                <TermCard
                  key={idx}
                  term={term}
                  simplifiedMode={simplifiedMode}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Grounded Q&A Chat */}
      {activeTab === 'chat' && (
        <ChatInterface reportId={report.id} reportTitle={report.title} />
      )}

      {/* TAB 3: Questions for Doctor */}
      {activeTab === 'questions' && (
        <DoctorQuestionsCard questions={report.doctor_questions || []} />
      )}

      {/* TAB 4: Side-by-Side Dual View */}
      {activeTab === 'sidebyside' && (
        <SideBySideViewer
          originalText={report.extracted_text || ''}
          terms={report.terms_data || []}
          simplifiedSummary={report.simple_summary || ''}
        />
      )}

      {/* TAB 5: Abbreviations */}
      {activeTab === 'abbreviations' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-soft space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Identified Medical Abbreviations
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Short clinical acronyms detected in your report and what they mean in full
            </p>
          </div>

          {(!report.abbreviations_data || report.abbreviations_data.length === 0) ? (
            <p className="text-xs text-slate-500 py-6 text-center">
              No medical abbreviations were identified in this report.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {report.abbreviations_data.map((abbr, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300">
                      {abbr.abbreviation}
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {abbr.full_term}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 pt-1 leading-relaxed">
                    {abbr.simple_meaning}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
