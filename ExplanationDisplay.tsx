import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Share2, ThumbsUp, Copy, Check, Languages, ArrowRight, RefreshCw, Bookmark } from 'lucide-react';
import { TRANSLATION_LANGUAGES } from '../constants';
import { translateText } from '../services/geminiService';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';

interface ExplanationDisplayProps {
  content: string;
  topic: string;
}

const ExplanationDisplay: React.FC<ExplanationDisplayProps> = ({ content, topic }) => {
  const { t, language } = useThemeLanguage();
  const [copied, setCopied] = useState(false);
  const [displayedContent, setDisplayedContent] = useState(content);
  const [targetLang, setTargetLang] = useState('');
  const [translating, setTranslating] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false);

  useEffect(() => {
    setDisplayedContent(content);
    setIsTranslated(false);
    
    if (language !== 'en-IN') {
      setTargetLang(language);
    } else {
      setTargetLang('');
    }
  }, [content, language]);

  const handleCopy = () => {
    navigator.clipboard.writeText(displayedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTranslate = async (langCode: string) => {
    if (!langCode) return;
    setTranslating(true);
    try {
      const translated = await translateText(content, langCode);
      setDisplayedContent(translated);
      setIsTranslated(true);
    } catch (error) {
      console.error("Translation failed", error);
      alert("Failed to translate. Please try again.");
    } finally {
      setTranslating(false);
    }
  };

  const handleResetTranslation = () => {
    setDisplayedContent(content);
    setIsTranslated(false);
  };

  return (
    <div className="glass-panel bg-white/80 dark:bg-slate-900/80 sepia:bg-sepia-50/80 rounded-3xl shadow-2xl border border-white/50 dark:border-slate-700 sepia:border-sepia-200 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 backdrop-blur-xl">
      
      {/* Result Header */}
      <div className="bg-gradient-to-r from-gray-50/80 to-white/80 dark:from-slate-800/80 dark:to-slate-900/80 sepia:from-sepia-50/80 sepia:to-sepia-100/80 px-8 py-5 border-b border-gray-100 dark:border-slate-700 sepia:border-sepia-200 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-india-orange/10 dark:bg-orange-900/20 flex items-center justify-center text-2xl animate-bounce">
                🇮🇳
            </div>
            <div>
                <h2 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    {isTranslated ? t('translated_result_title') : t('result_title')}
                </h2>
                <h3 className="text-xl font-extrabold text-india-blue dark:text-blue-300 leading-none mt-0.5">
                    {topic}
                </h3>
            </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {/* Translation Controls */}
          <div className="flex items-center bg-white/50 dark:bg-slate-950/50 sepia:bg-sepia-50/50 border border-gray-200 dark:border-slate-700 sepia:border-sepia-200 rounded-xl p-1.5 shadow-sm transition-all hover:shadow-md">
             <Languages className="w-4 h-4 text-gray-400 ml-2" />
             <select
               value={targetLang}
               onChange={(e) => setTargetLang(e.target.value)}
               disabled={translating}
               className="bg-transparent border-none text-sm font-medium text-gray-700 dark:text-gray-300 sepia:text-sepia-900 focus:ring-0 cursor-pointer py-1 pl-2 pr-8 outline-none w-32"
             >
               <option value="">Translate...</option>
               {TRANSLATION_LANGUAGES.map(lang => (
                 <option key={lang.code} value={lang.code}>{lang.label}</option>
               ))}
             </select>
             {isTranslated ? (
                <button
                  onClick={handleResetTranslation}
                  className="p-1.5 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-lg text-gray-700 dark:text-gray-200 transition-colors ml-1"
                  title="Show Original"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
             ) : (
                <button
                  onClick={() => handleTranslate(targetLang)}
                  disabled={!targetLang || translating}
                  className="p-1.5 bg-india-orange hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg transition-colors ml-1 shadow-sm"
                  title="Translate"
                >
                  {translating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                </button>
             )}
          </div>

          <div className="h-8 w-px bg-gray-200 dark:bg-slate-700 mx-2 hidden md:block"></div>

          <button 
            onClick={handleCopy}
            className="group p-2.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-500 dark:text-gray-400 transition-all active:scale-95"
            title="Copy to clipboard"
          >
            {copied ? <Check className="w-5 h-5 text-green-600 animate-in zoom-in" /> : <Copy className="w-5 h-5 group-hover:text-india-blue" />}
          </button>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-8 md:p-10">
        <div className="prose prose-lg prose-orange dark:prose-invert sepia:prose-sepia max-w-none text-gray-700 dark:text-gray-300 sepia:text-sepia-800 leading-relaxed font-sans">
          <ReactMarkdown
            components={{
              h1: ({node, ...props}) => <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 mb-6 pb-4 border-b-2 border-orange-100 dark:border-slate-800" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-india-blue dark:text-blue-300 mt-8 mb-4 flex items-center gap-2" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-6 mb-3" {...props} />,
              ul: ({node, ...props}) => <ul className="list-none space-y-3 my-6 pl-0" {...props} />,
              li: ({node, ...props}) => (
                <li className="relative pl-6 before:content-['•'] before:absolute before:left-0 before:text-india-orange before:font-bold before:text-xl" {...props} />
              ),
              strong: ({node, ...props}) => <strong className="font-bold text-gray-900 dark:text-white bg-orange-50 dark:bg-orange-900/20 px-1 rounded" {...props} />,
              blockquote: ({node, ...props}) => (
                <blockquote className="border-l-4 border-india-orange bg-gradient-to-r from-orange-50 to-transparent dark:from-orange-900/10 dark:to-transparent p-5 my-6 rounded-r-xl italic shadow-sm" {...props} />
              ),
              p: ({node, ...props}) => <p className="mb-5 leading-8" {...props} />,
              a: ({node, ...props}) => <a className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-2 decoration-blue-200 hover:decoration-blue-500 transition-all" {...props} />,
            }}
          >
            {displayedContent}
          </ReactMarkdown>
        </div>
      </div>

      {/* Footer / Disclaimer Area */}
      <div className="bg-gray-50/50 dark:bg-slate-900/50 sepia:bg-sepia-50/50 px-8 py-5 border-t border-gray-100 dark:border-slate-800 sepia:border-sepia-200 text-xs text-gray-500 dark:text-gray-400 sepia:text-sepia-700 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="flex-1 text-center sm:text-left flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></span>
          {t('disclaimer')}
        </p>
        <div className="flex items-center gap-2 opacity-70">
            <span className="font-handwriting text-xl text-india-orange transform -rotate-3 hover:rotate-0 transition-transform cursor-default">
                BharatExplain
            </span>
        </div>
      </div>
    </div>
  );
};

export default ExplanationDisplay;