import React, { useState } from 'react';
import { BookOpen, Search, X, Volume2 } from 'lucide-react';
import { ttsService } from '../services/ttsService';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GLOSSARY_ITEMS = [
  { term: 'Hemoglobin (Hgb)', meaning: 'Iron-rich protein in red blood cells that transports oxygen from your lungs throughout your entire body.' },
  { term: 'Hematocrit (Hct)', meaning: 'The percentage of your total blood volume that consists of red blood cells.' },
  { term: 'WBC (White Blood Cells)', meaning: 'Infection-fighting cells of your immune system that defend against bacteria and viruses.' },
  { term: 'RBC (Red Blood Cells)', meaning: 'The oxygen-delivering cells that nourish all vital bodily organs.' },
  { term: 'Platelets (PLT)', meaning: 'Tiny cell fragments that clump together to form clots and stop bleeding after injuries.' },
  { term: 'MCV (Mean Corpuscular Volume)', meaning: 'A measurement of the average physical size of your red blood cells.' },
  { term: 'RDW (Red Cell Distribution Width)', meaning: 'A score showing the amount of variation in size among your red blood cells.' },
  { term: 'Glucose (Fasting)', meaning: 'The primary sugar in your blood that provides energy for cells and the brain.' },
  { term: 'Total Cholesterol', meaning: 'The overall amount of cholesterol compounds (HDL, LDL, triglycerides) circulating in your blood.' },
  { term: 'LDL Cholesterol', meaning: 'Often called "bad cholesterol" because high levels can deposit in arterial walls.' },
  { term: 'HDL Cholesterol', meaning: 'Known as "good cholesterol" because it carries excess cholesterol back to the liver for recycling.' },
  { term: 'Triglycerides', meaning: 'The most common type of fat stored in your blood, formed from excess calories.' },
  { term: 'eGFR (Glomerular Filtration Rate)', meaning: 'An estimate of how many milliliters of blood your kidneys clean per minute.' },
  { term: 'Creatinine', meaning: 'A natural muscle breakdown waste product filtered out by healthy kidneys.' },
  { term: 'BUN (Blood Urea Nitrogen)', meaning: 'A waste byproduct of dietary protein digestion that reflects kidney clearance.' },
  { term: 'ALT (Alanine Aminotransferase)', meaning: 'An enzyme found mainly in liver cells; elevated levels can signal liver inflammation.' },
  { term: 'AST (Aspartate Aminotransferase)', meaning: 'An enzyme in liver and muscle tissue measured alongside ALT.' },
  { term: 'TSH (Thyroid Stimulating Hormone)', meaning: 'A hormone from the brain that controls your thyroid gland and body metabolism.' },
  { term: 'Reference Range', meaning: 'The set of values that 95% of healthy individuals fall into for a specific laboratory test.' },
  { term: 'Normocytic', meaning: 'Red blood cells that have a normal, healthy average physical size.' },
  { term: 'Microcytic', meaning: 'Red blood cells that are smaller than average, frequently seen with low iron levels.' },
  { term: 'Stenosis', meaning: 'The medical term for narrowing of a channel, blood vessel, or spinal nerve exit space.' },
  { term: 'Disc Protrusion', meaning: 'When the soft disc cushion between spinal bones bulges slightly beyond its perimeter.' },
];

export const MedicalGlossaryModal: React.FC<GlossaryModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredItems = GLOSSARY_ITEMS.filter(
    (item) =>
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSpeak = (text: string) => {
    ttsService.speak(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] shadow-elevated flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Medical Abbreviations & Term Glossary
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Quick dictionary of common clinical terms, tests, and ranges
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search medical terms (e.g. Hemoglobin, TSH, eGFR)..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              autoFocus
            />
          </div>
        </div>

        {/* Terms List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {filteredItems.length === 0 ? (
            <p className="text-center text-xs text-slate-500 py-8">
              No matching medical terms found for "{searchTerm}".
            </p>
          ) : (
            filteredItems.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {item.term}
                  </h4>
                  <button
                    onClick={() => handleSpeak(`${item.term}. ${item.meaning}`)}
                    className="p-1 rounded-md text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                    title="Listen"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.meaning}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800 text-center text-[11px] text-slate-500">
          Tip: You can also ask the AI assistant about any term directly in your report view.
        </div>
      </div>
    </div>
  );
};
