import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  MessageCircle,
  AlertCircle,
  CornerDownLeft,
  Mic,
  MicOff,
} from 'lucide-react';
import { ChatMessage } from '../types';
import { api } from '../services/api';

interface ChatInterfaceProps {
  reportId: number;
  reportTitle: string;
}

const SAMPLE_QUESTIONS = [
  'Which values are outside the reference ranges?',
  'What does this test mean in simple terms?',
  'What questions could I ask my doctor about this report?',
  'What is this abbreviation in my report?',
];

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ reportId, reportTitle }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    loadChatHistory();
    // Setup Speech Recognition if available
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      const rec = new SpeechRec();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsListening(false);
      };

      rec.onerror = () => {
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, [reportId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const loadChatHistory = async () => {
    try {
      const history = await api.getChatHistory(reportId);
      setMessages(history);
    } catch {
      // Ignore initial history error
    }
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Voice recognition is not supported in this browser. Please use Google Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    setInputText('');
    setError(null);

    const tempUserMsg: ChatMessage = {
      id: Date.now(),
      report_id: reportId,
      role: 'user',
      content: query,
      citations: [],
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setIsLoading(true);

    try {
      const response = await api.sendMessage(reportId, query);
      setMessages((prev) => [...prev.filter((m) => m.id !== tempUserMsg.id), tempUserMsg, response]);
    } catch (err: any) {
      setError(err.message || 'Failed to get answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-soft flex flex-col h-[650px] overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-sky-50 to-teal-50 dark:from-sky-950/40 dark:to-teal-950/40 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sky-600 text-white shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Ask About This Report
              <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-300">
                Grounded AI
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Answering strictly from <span className="font-semibold text-slate-700 dark:text-slate-300">{reportTitle}</span>
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1 rounded-lg border border-amber-200/60 dark:border-amber-800">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Educational Only</span>
        </div>
      </div>

      {/* Chat Messages List */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="p-3.5 bg-sky-50 dark:bg-sky-950/50 rounded-2xl text-sky-600 dark:text-sky-400">
              <MessageCircle className="w-8 h-8" />
            </div>
            <div className="max-w-md">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                Have questions about your report?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Ask me by typing or using voice questions to explain abbreviations, analyze out-of-range values, or suggest questions to discuss with your doctor.
              </p>
            </div>

            {/* Suggestions */}
            <div className="w-full max-w-md grid grid-cols-1 gap-2 pt-2">
              {SAMPLE_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="text-left px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-sky-50/50 text-xs text-slate-700 dark:text-slate-300 font-medium transition-all flex items-center justify-between group"
                >
                  <span>{q}</span>
                  <CornerDownLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`p-2 rounded-xl text-xs flex-shrink-0 ${
                  isUser
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-sky-600 text-white rounded-tr-none'
                    : 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>

                {!isUser && m.citations && m.citations.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="font-semibold">Context Grounding:</span>
                    {m.citations.map((c, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex-shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-2xl rounded-tl-none p-4 text-xs flex items-center gap-2 text-slate-500">
              <div className="w-2 h-2 rounded-full bg-sky-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-sky-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-sky-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              <span className="ml-1 font-medium">Checking report details...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      {messages.length > 0 && (
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950/30 border-t border-slate-100 dark:border-slate-800/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 flex-shrink-0">
            <Sparkles className="w-3 h-3 text-sky-500" /> Suggestions:
          </span>
          {SAMPLE_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              disabled={isLoading}
              className="text-[11px] px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-sky-400 whitespace-nowrap transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input Box with Voice & Send Button */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2"
      >
        <button
          type="button"
          onClick={toggleVoiceInput}
          title={isListening ? 'Stop listening' : 'Ask using your voice (Speech-to-Text)'}
          className={`p-2.5 rounded-xl border transition-all ${
            isListening
              ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
          }`}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isListening ? 'Listening to your voice...' : "Ask a question about this report (e.g. 'What does my LDL mean?')..."}
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Ask</span>
        </button>
      </form>
    </div>
  );
};
