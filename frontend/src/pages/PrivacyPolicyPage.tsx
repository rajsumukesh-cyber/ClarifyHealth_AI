import React from 'react';
import { Shield, Lock, Trash2, Database, EyeOff, FileText, CheckCircle2 } from 'lucide-react';
import { MedicalDisclaimerBanner } from '../components/MedicalDisclaimerBanner';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Disclaimer */}
      <MedicalDisclaimerBanner compact />

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="p-3 bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 rounded-2xl inline-block">
          <Shield className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Privacy & Security Standards
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Medical records contain deeply sensitive personal information. Here is our architectural blueprint for how we protect and isolate your data.
        </p>
      </div>

      {/* Security Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-card space-y-2.5">
          <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 inline-block">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Account Isolation & Zero Public URLs
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Uploaded files and extracted text are restricted exclusively to your authenticated user account via cryptographically signed JWT tokens. No public share links or open endpoints exist.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-card space-y-2.5">
          <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 inline-block">
            <Trash2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Permanent 1-Click Data Deletion
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            When you delete a report from your dashboard, all physical uploaded files, extracted database records, terms, and conversational logs are immediately and permanently erased.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-card space-y-2.5">
          <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 inline-block">
            <EyeOff className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            No Third-Party Advertising or Selling
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Your medical documents are never sold, rented, or utilized for commercial ad targeting. Information is processed strictly to provide you with plain-language educational simplifications.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-card space-y-2.5">
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 inline-block">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Encrypted In-Transit & At-Rest
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            All API communications use TLS 1.3 encryption. Passwords are securely hashed with salted bcrypt algorithms preventing plain text retrieval.
          </p>
        </div>
      </div>

      {/* Data Disclosure Details */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-card space-y-5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          What We Store & Why
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
            <div>
              <strong>User Account Credentials:</strong> Stored to maintain your authenticated session across visits.
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Report Documents & Extracted Text:</strong> Stored to provide your report summary cards, term explanations, and grounded Q&A chat.
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Chat History:</strong> Retained locally on your account so you can continue previous inquiries on a specific report.
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
          <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">
            Hackathon Demonstration Note
          </h4>
          <p className="text-slate-600 dark:text-slate-300">
            For demonstration and hackathon evaluation purposes, we encourage using the built-in synthetic test reports (CBC, Lipid Panel, MRI Spine). ClarifyHealth is designed following HIPAA and GDPR security design principles.
          </p>
        </div>
      </div>
    </div>
  );
};
