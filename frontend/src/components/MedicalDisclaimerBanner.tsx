import React from 'react';
import { AlertCircle, ShieldCheck } from 'lucide-react';

export const MedicalDisclaimerBanner: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-lg px-3 py-2 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
        <span>
          <strong>Educational information only:</strong> Not a medical diagnosis or treatment advice. Discuss all findings with a qualified healthcare professional.
        </span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-50 via-sky-50 to-teal-50 dark:from-amber-950/30 dark:via-sky-950/30 dark:to-teal-950/30 border-y sm:border sm:rounded-xl border-amber-200/80 dark:border-amber-800/40 p-4 mb-6 shadow-sm">
      <div className="flex items-start gap-3.5">
        <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg text-amber-700 dark:text-amber-300 flex-shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="text-sm">
          <h4 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            Important Medical Disclaimer
            <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-amber-200/60 dark:bg-amber-800/60 text-amber-900 dark:text-amber-200">
              Responsible AI
            </span>
          </h4>
          <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
            This tool provides <strong>plain-language educational explanations</strong> of health reports to help you prepare for conversations with your doctor. 
            It does <strong>not</strong> provide medical diagnoses, treatment prescriptions, or emergency guidance. Always consult your licensed healthcare provider regarding your health and care plan.
          </p>
        </div>
      </div>
    </div>
  );
};
