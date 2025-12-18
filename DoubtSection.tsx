import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, User, Bot, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { DoubtItem } from '../types';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';

interface DoubtSectionProps {
  doubts: DoubtItem[];
  onAskDoubt: (doubt: string) => void;
  isLoading: boolean;
}

const DoubtSection: React.FC<DoubtSectionProps> = ({ doubts, onAskDoubt, isLoading }) => {
  const { t } = useThemeLanguage();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [doubts, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onAskDoubt(input);
    setInput('');
  };

  return (
    <div className="mt-10 glass-panel bg-white/80 dark:bg-slate-900/80 sepia:bg-sepia-100/80 rounded-3xl shadow-xl border border-white/50 dark:border-slate-800 sepia:border-sepia-200 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 backdrop-blur-md">
      <div className="bg-indigo-50/80 dark:bg-indigo-950/30 sepia:bg-sepia-200/80 px-8 py-5 border-b border-indigo-100 dark:border-indigo-900/50 sepia:border-sepia-300 flex items-center gap-3">
        <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-xl">
          <MessageCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 sepia:text-sepia-900">{t('doubt_title')}</h3>
      </div>

      <div className="p-6 md:p-8">
        {/* History */}
        {doubts.length > 0 && (
          <div className="space-y-8 mb-10">
            {doubts.map((item, index) => (
              <div key={index} className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* User Question */}
                <div className="flex gap-4 justify-end items-end group">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-800 dark:to-slate-900 sepia:from-sepia-50 sepia:to-sepia-100 text-gray-800 dark:text-gray-200 sepia:text-sepia-900 px-5 py-3.5 rounded-2xl rounded-tr-sm max-w-[85%] text-sm sm:text-base border border-gray-200 dark:border-slate-700 sepia:border-sepia-200 shadow-sm transition-transform hover:scale-[1.01]">
                    <p className="font-medium">{item.question}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 border-2 border-white dark:border-slate-600 shadow-sm overflow-hidden">
                    <User className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                  </div>
                </div>

                {/* AI Answer */}
                <div className="flex gap-4 justify-start items-start">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center flex-shrink-0 border-2 border-white dark:border-indigo-800 shadow-sm mt-1">
                    <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="bg-white/50 dark:bg-indigo-900/10 sepia:bg-sepia-50/50 text-gray-800 dark:text-gray-200 sepia:text-sepia-900 px-6 py-5 rounded-2xl rounded-tl-none max-w-[90%] text-sm sm:text-base prose prose-sm prose-indigo dark:prose-invert shadow-sm border border-indigo-100 dark:border-indigo-900/30 sepia:border-sepia-200 backdrop-blur-sm">
                     <ReactMarkdown>{item.answer}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('doubt_placeholder')}
            disabled={isLoading}
            className="w-full pl-6 pr-16 py-4 bg-gray-50/80 dark:bg-slate-800/80 sepia:bg-sepia-50/80 border-2 border-gray-200 dark:border-slate-700 sepia:border-sepia-200 rounded-2xl focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-gray-100 sepia:text-sepia-900 shadow-inner"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-indigo-200 dark:hover:shadow-none hover:scale-105 active:scale-95"
          >
            {isLoading ? (
               <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoubtSection;