import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ReportSummaryItem, ReportDetails } from '../types';
import { SampleReportPicker } from '../components/SampleReportPicker';
import { MedicalDisclaimerBanner } from '../components/MedicalDisclaimerBanner';
import {
  FileText,
  UploadCloud,
  Layers,
  Activity,
  AlertTriangle,
  Clock,
  ArrowRight,
  Trash2,
  Eye,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState<ReportSummaryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setIsLoading(true);
    try {
      const list = await api.listReports();
      setReports(list);
    } catch (err: any) {
      setError(err.message || 'Failed to load report history.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to permanently delete this report?')) return;
    try {
      await api.deleteReport(id);
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      alert(err.message || 'Could not delete report.');
    }
  };

  const handleSelectSample = (report: ReportDetails) => {
    navigate(`/reports/${report.id}`);
  };

  // Metrics
  const totalReports = reports.length;
  const totalBiomarkers = reports.reduce((acc, r) => acc + (r.terms_count || 0), 0);
  const totalAbnormal = reports.reduce((acc, r) => acc + (r.abnormal_count || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Disclaimer */}
      <MedicalDisclaimerBanner compact />

      {/* Header & Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Patient Health Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Welcome back, <strong className="text-slate-700 dark:text-slate-200">{user?.full_name || user?.email}</strong>. Track and simplify your clinical health reports.
          </p>
        </div>

        <Link
          to="/upload"
          className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs sm:text-sm shadow-soft transition-all flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload New Report</span>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-card flex items-center gap-4">
          <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Simplified Reports</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{totalReports}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-card flex items-center gap-4">
          <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Biomarkers & Terms</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{totalBiomarkers}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-card flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Values to Review</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{totalAbnormal}</p>
          </div>
        </div>
      </div>

      {/* 1-Click Sample Reports Shelf */}
      <div className="bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-soft">
        <SampleReportPicker onSelectReport={handleSelectSample} />
      </div>

      {/* Recent Reports List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Your Medical Reports
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Access your previous reports, structured parameters, and doctor questions
            </p>
          </div>
          {reports.length > 0 && (
            <Link to="/history" className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline">
              View All History ({reports.length})
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
            <Activity className="w-4 h-4 animate-spin text-sky-600" />
            <span>Loading reports...</span>
          </div>
        ) : reports.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl inline-block text-slate-400">
              <FileText className="w-8 h-8" />
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No medical reports analyzed yet
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Upload your own health report or click on any of the sample tests above to get started.
            </p>
            <Link
              to="/upload"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-colors mt-2"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload a Report</span>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {reports.slice(0, 5).map((r) => (
              <div
                key={r.id}
                onClick={() => navigate(`/reports/${r.id}`)}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 p-3 rounded-xl cursor-pointer transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 mt-0.5">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {r.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span>{r.report_type}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(r.created_at).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>{r.terms_count} terms</span>
                      {r.abnormal_count > 0 && (
                        <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold text-[10px]">
                          {r.abnormal_count} outside range
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => navigate(`/reports/${r.id}`)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-sky-50 hover:text-sky-600 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Analysis</span>
                  </button>
                  <button
                    onClick={(e) => handleDelete(r.id, e)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Delete report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
