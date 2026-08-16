import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SampleReportPicker } from '../components/SampleReportPicker';
import { MedicalDisclaimerBanner } from '../components/MedicalDisclaimerBanner';
import {
  Activity,
  Sparkles,
  UploadCloud,
  FileText,
  MessageSquare,
  ShieldCheck,
  Volume2,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Lock,
  Search,
  Eye,
} from 'lucide-react';
import { ReportDetails } from '../types';

export const LandingPage: React.FC = () => {
  const { isAuthenticated, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleStartDemo = async () => {
    await demoLogin();
    navigate('/upload');
  };

  const handleSelectSample = async (report: ReportDetails) => {
    if (!isAuthenticated) {
      await demoLogin();
    }
    navigate(`/reports/${report.id}`);
  };

  const faqs = [
    {
      q: 'How does ClarifyHealth simplify medical terminology?',
      a: 'ClarifyHealth uses a multi-layered AI engine and clinical knowledge graph to extract medical terms, laboratory values, and abbreviations from your uploaded records. It translates technical jargon into plain, 5th-grade reading level explanations, highlighting reference ranges and providing cautious educational context.',
    },
    {
      q: 'Is this tool a substitute for my doctor or medical provider?',
      a: 'No. ClarifyHealth is strictly an educational tool to help you understand your health information and prepare informed questions for your physician. It never provides medical diagnoses, prescribes drugs, or recommends dosage changes.',
    },
    {
      q: 'What file types can I upload?',
      a: 'You can upload laboratory and diagnostic reports in PDF, Microsoft Word (DOCX), and high-resolution image formats (PNG, JPG, JPEG) up to 25MB.',
    },
    {
      q: 'Is my medical information kept secure and private?',
      a: 'Yes. All data transmissions are encrypted, uploaded files are strictly isolated to your authenticated account, and no public URLs or unauthenticated access pathways exist. You can permanently delete any uploaded report with one click.',
    },
    {
      q: 'Can I test this right now without creating an account?',
      a: 'Yes! Click on any of the synthetic sample reports below or the "1-Click Demo" button to instantly experience the full interactive simplification pipeline.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-16 pb-6 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200/80 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-xs font-semibold shadow-sm animate-in fade-in slide-in-from-bottom-2">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>AI-Powered Clinical Health Literacy Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-[1.15]">
            Medical Reports Translated Into{' '}
            <span className="bg-gradient-to-r from-sky-600 via-teal-500 to-emerald-600 bg-clip-text text-transparent">
              Plain English
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Understand your blood tests, lab values, and diagnostic findings in seconds. Empathetic, plain-language explanations with interactive AI chat and doctor discussion questions.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={handleStartDemo}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-soft hover:shadow-elevated transition-all flex items-center justify-center gap-2 group"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Your Report</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={handleStartDemo}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-teal-500" />
              <span>Try 1-Click Interactive Demo</span>
            </button>
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500 pt-1">
            Free • No credit card required • Instant Synthetic Samples Available
          </p>
        </div>
      </section>

      {/* Global Disclaimer Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <MedicalDisclaimerBanner />
      </section>

      {/* Instant 1-Click Sample Showcase */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-soft">
          <SampleReportPicker onSelectReport={handleSelectSample} />
        </div>
      </section>

      {/* How It Works 4-Step Pipeline */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            How The Simplification Pipeline Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            From raw technical medical PDF/Image to clear, patient-empowered understanding
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Secure Upload',
              desc: 'Drag & drop your PDF, Word document, or clear photo of your lab test.',
              icon: UploadCloud,
              color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/60',
            },
            {
              step: '02',
              title: 'OCR & Parsing',
              desc: 'High-accuracy text extraction normalizes tables, values, and reference intervals.',
              icon: FileText,
              color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/60',
            },
            {
              step: '03',
              title: 'AI Translation',
              desc: 'Medical language is converted into simple words with cautious educational context.',
              icon: Sparkles,
              color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60',
            },
            {
              step: '04',
              title: 'Interactive Care',
              desc: 'Explore color-coded values, listen via audio, and ask questions to prepare for your doctor.',
              icon: MessageSquare,
              color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-card relative overflow-hidden group hover:border-sky-300 transition-colors"
            >
              <span className="text-4xl font-extrabold text-slate-100 dark:text-slate-800/60 absolute top-3 right-4 select-none">
                {item.step}
              </span>
              <div className={`p-3 rounded-xl ${item.color} inline-block mb-4`}>
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Engineered for Clarity & Patient Safety
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            Every feature is designed to reduce health anxiety while maintaining strict medical safety
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-3">
            <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 inline-block">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              "Explain Like I'm New" Mode
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Toggle instant ultra-simple explanations that strip away intimidating clinical jargon so anyone can understand.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-3">
            <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 inline-block">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Grounded "Ask AI" Assistant
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Chat interactively about your report with answers grounded strictly in your document. Refuses to invent facts.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-3">
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 inline-block">
              <Volume2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Audio Text-to-Speech Narrator
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Listen to high-quality spoken explanations of your report summary and terms for optimal accessibility.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-3">
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 inline-block">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Doctor Question Builder
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Automatically compiles personalized questions to print or copy for your next clinical doctor visit.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 inline-block">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Side-by-Side Dual Viewer
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Inspect the raw extracted document text right next to the simplified plain-language breakdown.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-card space-y-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 inline-block">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Account Isolation & Privacy
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Your health data is locked to your account with zero public endpoints and instant 1-click permanent deletion.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Learn more about responsible AI medical report simplification
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="text-slate-400 text-lg">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-sky-600 via-teal-600 to-sky-700 rounded-3xl p-8 sm:p-12 text-center text-white space-y-5 shadow-elevated">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Take Control of Your Health Literacy Today
          </h2>
          <p className="max-w-xl mx-auto text-xs sm:text-sm text-sky-100 leading-relaxed">
            Upload your medical report and transform confusing clinical jargon into reassuring, actionable knowledge.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleStartDemo}
              className="px-6 py-3 rounded-xl bg-white text-slate-900 hover:bg-sky-50 font-bold text-sm shadow-md transition-colors"
            >
              Get Started Free
            </button>
            <Link
              to="/privacy"
              className="px-6 py-3 rounded-xl bg-sky-700/60 hover:bg-sky-700 text-white font-medium text-sm transition-colors"
            >
              Learn About Security
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
