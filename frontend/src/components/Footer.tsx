import React from 'react';
import { Activity, ShieldCheck, Lock, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-white">
              <div className="p-1.5 rounded-lg bg-sky-600">
                <Activity className="w-4 h-4" />
              </div>
              <span className="font-bold text-base tracking-tight">
                Clarify<span className="text-sky-400">Health</span> AI
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Empowering patients with clear, compassionate, educational translations of complex medical records and laboratory biomarkers.
            </p>
            <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-2">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-teal-400" />
                Zero Public URLs
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                User Isolated Data
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-3">
              Application
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/upload" className="hover:text-white transition-colors">
                  Upload Report
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-white transition-colors">
                  Report History
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy & Data Retention
                </Link>
              </li>
            </ul>
          </div>

          {/* Safety & Compliance */}
          <div>
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] mb-3">
              Responsible AI
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5 text-slate-300">
                <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
                <span>Patient-First Design</span>
              </li>
              <li>No Automated Prescriptions</li>
              <li>Strict Document Grounding</li>
              <li>Deterministic Fallback Engine</li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 text-center md:text-left">
          <p>
            <strong>Medical Disclaimer:</strong> ClarifyHealth is strictly an educational tool designed to help patients understand medical terminology. It does not offer medical diagnoses or personalized treatment advice. Always seek the advice of your physician.
          </p>
          <p className="flex-shrink-0">
            © 2026 ClarifyHealth AI. Built for Accessible Healthcare.
          </p>
        </div>
      </div>
    </footer>
  );
};
