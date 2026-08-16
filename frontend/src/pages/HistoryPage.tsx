import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { ReportSummaryItem } from '../types';
import { MedicalDisclaimerBanner } from '../components/MedicalDisclaimerBanner';
import {
  FileText,
  Search,
  Trash2,
  Eye,
  Calendar,
  Layers,
  AlertTriangle,
  UploadCloud,
  ArrowRight,
  Activity,
  CheckCircle2,
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<ReportSummaryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const data = await api.listReports();
      setReports(data);
    } catch {
      // History fetch error
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to permanently delete this report?')) return;
    try {
      await api.deleteReport(id);
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      alert(err.message || 'Could not delete report.');
    }
  };

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.report_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.original_filename.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      filterType === 'all' ||
      (filterType === 'abnormal' && r.abnormal_count > 0) ||
      r.report_type.toLowerCase().includes(filterType.toLowerCase());
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Disclaimer */}
      <MedicalDisclaimerBanner compact />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Report History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse and manage all previously uploaded and simplified medical reports
          </p>
        </div>

        <Link
          to="/upload"
          className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-semibold shadow-soft flex items-center gap-2 self-start sm:self-auto"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Report</span>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-card">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search report titles, tests, or filenames..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Report Types</option>
            <option value="abnormal">Outside Range Only</option>
            <option value="blood">Blood & Hematology</option>
            <option value="metabolic">Metabolic</option>
            <option value="lipid">Lipid & Heart</option>
            <option value="radiology">Imaging & MRI</option>
          </select>
        </div>
      </div>

      {/* Reports Grid / List */}
      {isLoading ? (
        <div className="py-24 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <Activity className="w-4 h-4 animate-spin text-sky-600" />
          <span>Loading history...</span>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <FileText className="w-8 h-8 text-slate-400 mx-auto" />
          <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
            No matching medical reports found
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery ? 'Try clearing your search query or filters.' : 'Upload your first medical report to begin.'}
          </p>
          {!searchQuery && (
            <Link
              to="/upload"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-semibold"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Document</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((r) => (
            <div
              key={r.id}
              onClick={() => navigate(`/reports/${r.id}`)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-600 rounded-2xl p-5 shadow-card hover:shadow-soft cursor-pointer transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                    {r.report_type}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1">
                  {r.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                  File: {r.original_filename}
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs">
                  <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                    {r.terms_count} terms
                  </span>
                  {r.abnormal_count > 0 ? (
                    <span className="px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-semibold border border-amber-200/80 dark:border-amber-800">
                      {r.abnormal_count} outside range
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Normal
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => navigate(`/reports/${r.id}`)}
                  className="text-xs font-semibold text-sky-600 dark:text-sky-400 flex items-center gap-1 group-hover:underline"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(r.id);
                  }}
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
  );
};
