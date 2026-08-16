import React, { useState } from 'react';
import { TermItem } from '../types';
import { StatusBadge } from './StatusBadge';
import { Volume2, VolumeX, ChevronDown, ChevronUp, Info, HelpCircle, Activity } from 'lucide-react';
import { ttsService } from '../services/ttsService';

interface TermCardProps {
  term: TermItem;
  simplifiedMode?: boolean;
}

export const TermCard: React.FC<TermCardProps> = ({ term, simplifiedMode = false }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const toggleSpeech = () => {
    if (isPlaying) {
      ttsService.stop();
      setIsPlaying(false);
    } else {
      const speechText = `${term.term}. Your reported value is ${term.reported_value || 'not specified'}. ${term.simple_explanation} ${term.what_it_means}`;
      ttsService.setListener((speaking) => setIsPlaying(speaking));
      ttsService.speak(speechText);
      setIsPlaying(true);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-card hover:shadow-soft transition-all duration-200 overflow-hidden group">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 mt-0.5">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {term.term}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                  {term.category}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Clinical Biomarker & Parameter
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={toggleSpeech}
              title={isPlaying ? 'Stop voice readout' : 'Listen to audio explanation'}
              className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                isPlaying
                  ? 'bg-sky-600 text-white animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-sky-50 hover:text-sky-600 dark:hover:bg-slate-700'
              }`}
            >
              {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{isPlaying ? 'Playing' : 'Listen'}</span>
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle details"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Reported Value & Status Strip */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50/80 dark:bg-slate-800/40 rounded-lg p-3 border border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 dark:text-slate-400 block font-medium">Your Reported Value</span>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {term.reported_value || 'Present in document'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block font-medium">Reference Interval</span>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {term.reference_range || 'Standard lab target'}
            </span>
          </div>
          <div className="sm:text-right flex sm:block items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 block font-medium mb-1">Status Assessment</span>
            <StatusBadge status={term.status} size="sm" />
          </div>
        </div>
      </div>

      {/* Expanded Explanations */}
      {isExpanded && (
        <div className="p-5 space-y-4 text-sm bg-gradient-to-b from-transparent to-slate-50/50 dark:to-slate-950/20">
          {/* Simple Meaning */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-400">
              <Info className="w-3.5 h-3.5" />
              <span>Simple Meaning (In Plain English)</span>
            </div>
            <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
              {term.simple_explanation}
            </p>
          </div>

          {/* What It May Mean */}
          <div className="space-y-1.5 bg-sky-50/50 dark:bg-sky-950/20 p-3 rounded-lg border border-sky-100/80 dark:border-sky-900/30">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              <HelpCircle className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>What This Value May Mean</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
              {term.what_it_means}
            </p>
          </div>

          {/* Why It Matters */}
          {!simplifiedMode && (
            <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <strong className="text-slate-700 dark:text-slate-300">Why Doctors Check This:</strong> {term.why_it_matters}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
