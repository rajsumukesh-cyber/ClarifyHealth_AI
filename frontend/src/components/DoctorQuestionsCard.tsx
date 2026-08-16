import React, { useState } from 'react';
import { HelpCircle, Copy, Check, Plus, MessageSquare, Printer } from 'lucide-react';

interface DoctorQuestionsCardProps {
  questions: string[];
}

export const DoctorQuestionsCard: React.FC<DoctorQuestionsCardProps> = ({ questions }) => {
  const [checkedList, setCheckedList] = useState<Record<number, boolean>>({});
  const [customQuestions, setCustomQuestions] = useState<string[]>([]);
  const [newQuestionInput, setNewQuestionInput] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const allQuestions = [...questions, ...customQuestions];

  const toggleCheck = (idx: number) => {
    setCheckedList((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionInput.trim()) return;
    setCustomQuestions((prev) => [...prev, newQuestionInput.trim()]);
    setNewQuestionInput('');
  };

  const handleCopyAll = () => {
    const textToCopy = allQuestions
      .map((q, i) => `${i + 1}. ${q}`)
      .join('\n\n');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-soft transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Questions to Ask Your Doctor
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalized discussion points to bring to your next healthcare appointment
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyAll}
            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Questions'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* Questions Checklist */}
      <div className="mt-5 space-y-3">
        {allQuestions.map((q, idx) => {
          const isChecked = !!checkedList[idx];
          return (
            <div
              key={idx}
              onClick={() => toggleCheck(idx)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                isChecked
                  ? 'bg-slate-50 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800 opacity-60 line-through'
                  : 'bg-teal-50/30 dark:bg-teal-950/10 border-teal-100 dark:border-teal-900/40 hover:border-teal-300'
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => {}}
                className="mt-1 w-4 h-4 rounded text-teal-600 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 pointer-events-none"
              />
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                {q}
              </span>
            </div>
          );
        })}
      </div>

      {/* Add Custom Question */}
      <form onSubmit={handleAddQuestion} className="mt-5 flex gap-2">
        <input
          type="text"
          value={newQuestionInput}
          onChange={(e) => setNewQuestionInput(e.target.value)}
          placeholder="Add your own custom question for your doctor..."
          className="flex-1 px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!newQuestionInput.trim()}
          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </form>
    </div>
  );
};
