import React, { useState, useEffect } from 'react';
import { Eye, ZoomIn, ZoomOut, Type, Sparkles, X } from 'lucide-react';

export const AccessibilityToolbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [dyslexicFont, setDyslexicFont] = useState(false);

  useEffect(() => {
    // Font scale
    document.documentElement.classList.remove('text-scale-large', 'text-scale-xlarge');
    if (fontSize === 'large') document.documentElement.classList.add('text-scale-large');
    if (fontSize === 'xlarge') document.documentElement.classList.add('text-scale-xlarge');

    // High contrast
    if (highContrast) {
      document.documentElement.classList.add('high-contrast-mode');
    } else {
      document.documentElement.classList.remove('high-contrast-mode');
    }

    // Dyslexic font
    if (dyslexicFont) {
      document.body.style.fontFamily = "'OpenDyslexic', 'Comic Sans MS', sans-serif";
    } else {
      document.body.style.fontFamily = "";
    }
  }, [fontSize, highContrast, dyslexicFont]);

  return (
    <div className="fixed bottom-20 right-6 z-30">
      {isOpen ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-elevated w-72 space-y-3.5 animate-in fade-in slide-in-from-bottom-2 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-sky-600" />
              Accessibility Tools
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Text Sizing */}
          <div>
            <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Text Scaling
            </span>
            <div className="grid grid-cols-3 gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setFontSize('normal')}
                className={`py-1 rounded-lg font-semibold transition-all ${
                  fontSize === 'normal'
                    ? 'bg-white dark:bg-slate-900 text-sky-600 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                100%
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`py-1 rounded-lg font-semibold transition-all ${
                  fontSize === 'large'
                    ? 'bg-white dark:bg-slate-900 text-sky-600 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                115%
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`py-1 rounded-lg font-semibold transition-all ${
                  fontSize === 'xlarge'
                    ? 'bg-white dark:bg-slate-900 text-sky-600 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                130%
              </button>
            </div>
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between pt-1">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              High Contrast Borders
            </span>
            <input
              type="checkbox"
              checked={highContrast}
              onChange={(e) => setHighContrast(e.target.checked)}
              className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
            />
          </div>

          {/* Dyslexia Friendly */}
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Dyslexia-Friendly Font
            </span>
            <input
              type="checkbox"
              checked={dyslexicFont}
              onChange={(e) => setDyslexicFont(e.target.checked)}
              className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
            />
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="p-3 rounded-full bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white font-semibold shadow-elevated transition-all flex items-center gap-1.5 hover:scale-105"
          title="Open Accessibility Controls"
        >
          <Eye className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
