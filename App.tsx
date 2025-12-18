import React, { useState } from 'react';
import Header from './components/Header';
import ExplanationForm from './components/ExplanationForm';
import ExplanationDisplay from './components/ExplanationDisplay';
import DoubtSection from './components/DoubtSection';
import Footer from './components/Footer';
import { generateExplanation, resolveDoubt } from './services/geminiService';
import { ExplanationRequest, DoubtItem } from './types';
import { AlertCircle } from 'lucide-react';
import { useThemeLanguage } from './contexts/ThemeLanguageContext';

interface ErrorState {
  title: string;
  message: string;
  suggestion: string;
}

const App: React.FC = () => {
  const { t } = useThemeLanguage();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [currentTopic, setCurrentTopic] = useState<string>('');
  const [error, setError] = useState<ErrorState | null>(null);
  
  // Doubt State
  const [doubts, setDoubts] = useState<DoubtItem[]>([]);
  const [doubtLoading, setDoubtLoading] = useState(false);

  const getFriendlyError = (err: any): ErrorState => {
    const msg = (err?.message || err?.toString() || "").toLowerCase();
    
    if (msg.includes("429") || msg.includes("quota") || msg.includes("exhausted")) {
      return {
        title: "High Traffic",
        message: "We are currently experiencing high demand.",
        suggestion: "Please wait a minute and try again."
      };
    }
    
    if (msg.includes("safety") || msg.includes("blocked") || msg.includes("policy")) {
      return {
        title: "Content Policy",
        message: "This topic couldn't be processed due to safety guidelines.",
        suggestion: "Try rephrasing your topic to be more specific or neutral."
      };
    }

    if (msg.includes("network") || msg.includes("fetch") || msg.includes("internet")) {
      return {
        title: "Connection Error",
        message: "We couldn't reach our servers.",
        suggestion: "Please check your internet connection."
      };
    }

    if (msg.includes("location") || msg.includes("geolocation")) {
      return {
        title: "Location Error",
        message: "We couldn't access your location.",
        suggestion: "Please enable location services or try a different category."
      };
    }

    return {
      title: "Something went wrong",
      message: "We encountered an unexpected error.",
      suggestion: "Please try searching for the topic again."
    };
  };

  const handleExplanationRequest = async (request: ExplanationRequest) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setDoubts([]); // Clear previous doubts when new topic is asked
    setCurrentTopic(request.topic);

    try {
      const explanation = await generateExplanation(request);
      setResult(explanation);
    } catch (err: any) {
      setError(getFriendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDoubtRequest = async (question: string) => {
    if (!result || !currentTopic) return;
    
    setDoubtLoading(true);
    setError(null); // Clear any previous errors to avoid confusion

    try {
      const answer = await resolveDoubt(question, currentTopic, result, doubts);
      const newDoubt: DoubtItem = { question, answer };
      setDoubts(prev => [...prev, newDoubt]);
    } catch (err: any) {
      // For doubts, we set the main error state as well so it's visible
      setError(getFriendlyError(err));
    } finally {
      setDoubtLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 sepia:bg-sepia-50 flex flex-col font-sans transition-colors duration-500 overflow-x-hidden relative">
      
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-40 dark:opacity-20 sepia:opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <Header />

      <main className="flex-grow container mx-auto px-4 pt-28 pb-12 max-w-5xl z-10 relative">
        {/* Intro Text */}
        {!result && !loading && !error && (
          <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white sepia:text-sepia-900 mb-6 leading-tight tracking-tight">
              {t('welcome_title')} <br className="hidden sm:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-india-orange via-orange-500 to-red-600 animate-gradient-x">{t('welcome_subtitle')}</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 sepia:text-sepia-800 max-w-2xl mx-auto font-medium">
              {t('search_label')}
            </p>
          </div>
        )}

        <ExplanationForm 
          isLoading={loading} 
          onSubmit={handleExplanationRequest} 
        />

        {error && (
          <div className="bg-red-50/90 backdrop-blur-sm dark:bg-red-900/30 border-l-4 border-red-500 p-6 mb-8 rounded-r-xl shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-start">
              <div className="bg-red-100 dark:bg-red-900/50 p-2 rounded-full mr-4">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-red-900 dark:text-red-200 font-bold text-lg mb-1">{error.title}</h3>
                <p className="text-red-800 dark:text-red-300 text-base mb-3">{error.message}</p>
                <p className="text-red-700 dark:text-red-400 text-sm font-semibold bg-red-100/50 dark:bg-red-900/20 inline-block px-3 py-1.5 rounded-md border border-red-200 dark:border-red-800/50">
                  💡 Tip: {error.suggestion}
                </p>
              </div>
            </div>
          </div>
        )}

        {result && (
          <>
            <ExplanationDisplay 
              content={result} 
              topic={currentTopic} 
            />
            
            <DoubtSection 
              doubts={doubts}
              onAskDoubt={handleDoubtRequest}
              isLoading={doubtLoading}
            />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;