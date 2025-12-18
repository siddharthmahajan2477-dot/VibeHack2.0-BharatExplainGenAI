import React, { useEffect, useState, useRef } from 'react';
import { Send, Loader2, MapPin, Mic, MicOff, Languages, AlertCircle, Sparkles, Search } from 'lucide-react';
import { CATEGORIES, DIFFICULTIES, POPULAR_TOPICS } from '../constants';
import { TopicCategory, DifficultyLevel, ExplanationRequest } from '../types';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';

interface ExplanationFormProps {
  isLoading: boolean;
  onSubmit: (data: ExplanationRequest) => void;
}

const VOICE_LANGUAGES = [
  { code: 'en-IN', label: 'English (Bharat)' },
  { code: 'hi-IN', label: 'Hindi (हिंदी)' },
  { code: 'bn-IN', label: 'Bengali (বাংলা)' },
  { code: 'te-IN', label: 'Telugu (తెలుగు)' },
  { code: 'mr-IN', label: 'Marathi (मराठी)' },
  { code: 'ta-IN', label: 'Tamil (தமிழ்)' },
  { code: 'gu-IN', label: 'Gujarati (ગુજરાતી)' },
  { code: 'kn-IN', label: 'Kannada (ಕನ್ನಡ)' },
  { code: 'ml-IN', label: 'Malayalam (മലയാളം)' },
  { code: 'pa-IN', label: 'Punjabi (ਪੰਜਾਬੀ)' },
  { code: 'ur-IN', label: 'Urdu (اردو)' },
  { code: 'or-IN', label: 'Odia (ଓଡ଼ିଆ)' },
  { code: 'as-IN', label: 'Assamese (অসমীয়া)' }
];

const ExplanationForm: React.FC<ExplanationFormProps> = ({ isLoading, onSubmit }) => {
  const { t, language } = useThemeLanguage();
  const [topic, setTopic] = React.useState('');
  const [category, setCategory] = React.useState<TopicCategory>(TopicCategory.EXAMS);
  const [difficulty, setDifficulty] = React.useState<DifficultyLevel>(DifficultyLevel.SIMPLE);
  const [location, setLocation] = useState<{ lat: number; lng: number } | undefined>(undefined);
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Auto-suggestion State
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Voice Input State
  const [isListening, setIsListening] = useState(false);
  const [voiceLang, setVoiceLang] = useState(language); 
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (VOICE_LANGUAGES.some(vl => vl.code === language)) {
      setVoiceLang(language);
    }
  }, [language]);

  // Click outside listener for suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch location when Tourism category is selected
  useEffect(() => {
    if (category === TopicCategory.TOURISM) {
      setLocLoading(true);
      setLocError(false);
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
            setLocLoading(false);
          },
          (error) => {
            console.warn("Location access denied or failed", error);
            setLocError(true);
            setLocLoading(false);
          }
        );
      } else {
        setLocError(true);
        setLocLoading(false);
      }
    } else {
      setLocation(undefined);
      setLocLoading(false);
      setLocError(false);
    }
    setValidationError(null);
  }, [category]);

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      
      recognition.lang = voiceLang;
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event);
        setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const newTopic = topic.trim() ? `${topic.trim()} ${transcript}` : transcript;
        handleTopicChange(newTopic);
      };

      recognition.start();
    } else {
      alert("Voice input is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
    }
  };

  const handleTopicChange = (value: string) => {
    setTopic(value);
    setValidationError(null);

    // Filter suggestions
    const currentCategoryTopics = POPULAR_TOPICS[category] || [];
    if (value.trim().length > 0) {
      const filtered = currentCategoryTopics.filter(t => 
        t.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleInputFocus = () => {
    const currentCategoryTopics = POPULAR_TOPICS[category] || [];
    if (topic.trim().length === 0) {
      // Show some default suggestions if empty
      setSuggestions(currentCategoryTopics.slice(0, 5));
      setShowSuggestions(true);
    } else {
      // Show filtered suggestions if user clicks back into field
      const filtered = currentCategoryTopics.filter(t => 
        t.toLowerCase().includes(topic.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setTopic(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
    setValidationError(null);
  };

  const validateInput = (inputTopic: string, selectedCategory: TopicCategory): string | null => {
    // Normalization is handled by regex case-insensitivity, but trimming is good practice
    const t = inputTopic.trim();
    
    // Skip validation for Chatbot as it's general purpose
    if (selectedCategory === TopicCategory.CHATBOT) return null;

    // Define comprehensive rules for detecting categories based on keywords
    // We use a vast list of keywords to catch most Bharat context queries
    const categoryRules: { category: TopicCategory; label: string; keywords: string[] }[] = [
      {
        category: TopicCategory.EXAMS,
        label: 'Exams',
        keywords: [
          'jee', 'neet', 'upsc', 'gate', 'iit', 'exam', 'syllabus', 'cutoff', 'counseling', 
          'cbse', 'icse', 'state board', 'result', 'admit card', 'percentile', 'rank', 'marks',
          'preparation', 'study plan', 'eligibility', 'question paper', 'cat', 'clat', 'nda', 
          'cds', 'ssb', 'ibps', 'ssc', 'rrb', 'bank po', 'clerk', 'ca', 'cs', 'cma', 
          'board exam', 'practical', 'viva', 'hall ticket', 'revaluation', 'compartment', 
          'scholarship', 'fellowship', 'ugc', 'nta', 'net'
        ]
      },
      {
        category: TopicCategory.LAWS,
        label: 'Laws',
        keywords: [
          'article', 'section', 'act', 'ipc', 'bns', 'constitution', 'law', 'supreme court', 
          'high court', 'legal', 'lawyer', 'rights', 'fir', 'bail', 'court', 'police', 
          'arrest', 'crime', 'justice', 'judge', 'advocate', 'tribunal', 'petition',
          'lawsuit', 'litigation', 'affidavit', 'notary', 'warrant', 'summons', 'custody', 
          'divorce', 'alimony', 'property dispute', 'consumer forum', 'rti', 'pil', 
          'fundamental rights', 'directive principles', 'amendment', 'ordinance', 'bill', 
          'parliament', 'lok sabha', 'rajya sabha'
        ]
      },
      {
        category: TopicCategory.POLICIES,
        label: 'Govt Policies',
        keywords: [
          'scheme', 'yojana', 'policy', 'subsidy', 'pension', 'ration', 'aadhaar', 'pan card', 
          'govt', 'government', 'minister', 'budget', 'tax', 'gst', 'welfare', 'beneficiary',
          'housing', 'insurance', 'fund', 'pm kisan', 'ayushman bharat', 'mgnrega', 
          'startup india', 'digital india', 'make in india', 'beti bachao', 'swachh bharat', 
          'smart city', 'passport', 'voter id', 'driving license', 'rc', 'challan', 'fastag', 
          'epf', 'ppf', 'nps', 'sukanya samriddhi', 'mudra loan', 'itr', 'income tax'
        ]
      },
      {
        category: TopicCategory.TECH,
        label: 'Tech',
        keywords: [
          'ai', 'software', 'hardware', 'coding', 'programming', 'computer', 'internet', '5g', 
          'smartphone', 'app', 'crypto', 'blockchain', 'robot', 'technology', 'digital', 'data', 
          'server', 'cloud', 'cyber', 'network', 'wifi', 'machine learning', 'data science', 
          'web development', 'android', 'ios', 'windows', 'linux', 'mac', 'laptop', 'tablet', 
          'gadget', 'bluetooth', 'processor', 'ram', 'gpu', 'cpu', 'motherboard', 'satellite', 
          'isro', 'nasa', 'space', 'telescope', 'drone', 'ev', 'electric vehicle', 'semiconductor'
        ]
      },
      {
        category: TopicCategory.TOURISM,
        label: 'Tourism',
        keywords: [
          'travel', 'visit', 'hotel', 'flight', 'train', 'booking', 'temple', 'fort', 'beach', 
          'hill station', 'museum', 'park', 'tourism', 'tourist', 'best place', 'resort', 
          'vacation', 'trip', 'guide', 'monument', 'waterfall', 'lake', 'darshan', 'pilgrimage',
          'ticket', 'pnr', 'irctc', 'bus', 'taxi', 'cab', 'rental', 'homestay', 'backpacking', 
          'trekking', 'camping', 'safari', 'zoo', 'sanctuary', 'heritage', 'culture', 
          'festival', 'fair', 'mela', 'yatra', 'char dham', 'jyotirlinga'
        ]
      }
    ];

    // Find ALL categories that match the input keywords using Word Boundary Regex
    // This avoids "taxi" matching "tax" or "lawn" matching "law"
    const matchedCategories = categoryRules.filter(rule => 
      rule.keywords.some(k => {
        // Escape special regex characters in keyword
        const escapedKeyword = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Check for whole word match (\b) case-insensitively (i)
        const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'i');
        return regex.test(t);
      })
    );

    // If no keywords matched any category, we assume the input is valid (or unique/unknown) and let it pass.
    if (matchedCategories.length === 0) return null;

    // If the user's selected category is ONE OF the matched categories, it is valid.
    const isValidSelection = matchedCategories.some(match => match.category === selectedCategory);

    if (isValidSelection) {
      return null;
    }

    // If we are here, the input matched some categories, but NOT the one the user selected.
    // Suggest the first matched category.
    const suggested = matchedCategories[0];
    return `It looks like you're asking about ${suggested.label}. Please select the '${suggested.label}' category for the best explanation.`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    const error = validateInput(topic, category);
    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError(null);
    onSubmit({ topic, category, difficulty, location });
  };

  const inputLang = voiceLang.split('-')[0];

  return (
    <div className="glass-panel bg-white/60 dark:bg-slate-900/60 sepia:bg-sepia-50/60 rounded-3xl shadow-2xl border border-white/50 dark:border-slate-800 sepia:border-sepia-200 p-8 mb-12 backdrop-blur-xl transition-all duration-500 hover:shadow-orange-100/50 dark:hover:shadow-blue-900/20">
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Topic Input */}
        <div className="relative group">
          <div className="flex justify-between items-end mb-3">
            <label htmlFor="topic" className="block text-sm font-bold text-gray-700 dark:text-gray-200 sepia:text-sepia-900 uppercase tracking-wide">
              {t('search_label')}
            </label>
            <div className="flex items-center gap-1.5 bg-white/80 dark:bg-slate-800 sepia:bg-sepia-50 rounded-full px-3 py-1 border border-gray-200 dark:border-slate-700 sepia:border-sepia-200 shadow-sm">
              <Languages className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
              <select 
                value={voiceLang}
                onChange={(e) => setVoiceLang(e.target.value)}
                disabled={isListening}
                className="text-xs bg-transparent border-none text-gray-700 dark:text-gray-200 sepia:text-sepia-900 focus:ring-0 cursor-pointer outline-none py-0 pl-1 pr-6 h-5 disabled:opacity-50 font-medium"
                title="Select language for voice input"
              >
                {VOICE_LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="relative transform transition-all duration-300 group-hover:-translate-y-1">
            <input
              id="topic"
              lang={inputLang}
              type="text"
              value={topic}
              onChange={(e) => handleTopicChange(e.target.value)}
              onFocus={handleInputFocus}
              autoComplete="off"
              placeholder={t('search_placeholder')}
              className={`w-full pl-6 pr-14 py-4 rounded-2xl border-2 ${
                validationError 
                  ? 'border-red-300 ring-4 ring-red-50 dark:ring-red-900/30' 
                  : 'border-transparent bg-white dark:bg-slate-950 sepia:bg-sepia-50 shadow-inner focus:border-india-orange focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900/30'
              } transition-all outline-none text-lg text-gray-800 dark:text-gray-100 sepia:text-sepia-900 placeholder-gray-400 dark:placeholder-gray-500 font-medium`}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={toggleListening}
              title={isListening ? "Stop listening" : "Speak to type"}
              disabled={isLoading}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full transition-all duration-300 ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-200' 
                  : 'text-gray-400 hover:text-india-blue hover:bg-blue-50 dark:hover:bg-slate-800 hover:scale-110'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div ref={suggestionsRef} className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-slate-900/95 sepia:bg-sepia-50/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 sepia:border-sepia-200 z-50 overflow-hidden max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => selectSuggestion(suggestion)}
                    className="w-full text-left px-4 py-3 hover:bg-orange-50 dark:hover:bg-slate-800 sepia:hover:bg-sepia-200 text-gray-700 dark:text-gray-200 sepia:text-sepia-900 text-sm border-b last:border-0 border-gray-50 dark:border-slate-800 sepia:border-sepia-200 flex items-center gap-3 transition-colors"
                  >
                    <div className="bg-gray-100 dark:bg-slate-800 sepia:bg-sepia-100 p-1.5 rounded-lg">
                      <Search className="w-3.5 h-3.5 text-gray-400 sepia:text-sepia-600" />
                    </div>
                    <span className="font-medium">{suggestion}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {validationError && (
            <div className="mt-3 flex items-center gap-2 text-red-600 dark:text-red-400 text-sm animate-in fade-in slide-in-from-top-1 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg inline-block">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium">{validationError}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 sepia:text-sepia-900 mb-3 uppercase tracking-wide">
              {t('category_label')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CATEGORIES.map((cat, idx) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => {
                    setCategory(cat.value);
                    setValidationError(null); // Clear error when user corrects category
                  }}
                  disabled={isLoading}
                  style={{ animationDelay: `${idx * 50}ms` }}
                  className={`relative overflow-hidden flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-300 animate-in fade-in zoom-in-50 ${
                    category === cat.value
                      ? 'bg-orange-50/80 dark:bg-orange-900/20 border-india-orange text-india-orange shadow-md transform scale-105'
                      : 'bg-white/50 dark:bg-slate-800/50 sepia:bg-sepia-50/50 border-transparent text-gray-600 dark:text-gray-300 sepia:text-sepia-800 hover:bg-white hover:shadow-lg hover:-translate-y-1'
                  }`}
                >
                   {/* Active Indicator Dot */}
                   {category === cat.value && (
                     <span className="absolute top-2 right-2 w-2 h-2 bg-india-orange rounded-full animate-ping"></span>
                   )}
                  <span className="text-2xl mb-2 filter drop-shadow-sm transition-transform duration-300 group-hover:scale-110">{cat.icon}</span>
                  <span className="text-xs font-bold text-center leading-tight">{cat.label.split('(')[0]}</span>
                </button>
              ))}
            </div>
            
            {category === TopicCategory.TOURISM && (
              <div className="mt-3 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-left-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg inline-block">
                {locLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-india-orange" />
                    <span className="text-gray-600 dark:text-gray-300 font-medium">Locating you...</span>
                  </>
                ) : locError ? (
                  <>
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    <span className="text-red-500 font-medium">Location unavailable</span>
                  </>
                ) : location ? (
                  <>
                    <MapPin className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-green-600 font-bold">Location Active</span>
                  </>
                ) : null}
              </div>
            )}
          </div>

          {/* Difficulty Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 sepia:text-sepia-900 mb-3 uppercase tracking-wide">
              {t('difficulty_label')}
            </label>
            <div className="space-y-3">
              {DIFFICULTIES.map((diff) => (
                <button
                  key={diff.value}
                  type="button"
                  onClick={() => setDifficulty(diff.value)}
                  disabled={isLoading}
                  className={`group w-full flex items-center px-5 py-3 rounded-2xl border-2 text-left transition-all duration-300 ${
                    difficulty === diff.value
                      ? 'bg-blue-50/80 dark:bg-blue-900/20 border-india-blue text-india-blue dark:text-blue-300 shadow-md transform scale-[1.02]'
                      : 'bg-white/50 dark:bg-slate-800/50 sepia:bg-sepia-50/50 border-transparent text-gray-600 dark:text-gray-300 sepia:text-sepia-800 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <div className={`relative w-4 h-4 rounded-full mr-4 border-2 flex items-center justify-center transition-colors ${
                    difficulty === diff.value ? 'border-india-blue bg-india-blue' : 'border-gray-300 dark:border-slate-600 bg-transparent'
                  }`}>
                     {difficulty === diff.value && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                  </div>
                  <div>
                    <div className="text-sm font-bold group-hover:text-india-blue transition-colors">{diff.label}</div>
                    <div className="text-xs opacity-75 font-medium">{diff.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !topic.trim()}
          className="group relative w-full overflow-hidden bg-gradient-to-r from-india-orange via-orange-500 to-red-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-orange-300/50 dark:shadow-orange-900/20 hover:shadow-orange-400/60 transform transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
        >
          {/* Shimmer Effect */}
          <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[30deg] animate-shimmer" />

          {isLoading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-lg tracking-wide">{t('loading_text')}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6 group-hover:animate-ping" />
              <span className="text-lg tracking-wide">{t('submit_button')}</span>
              <Send className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ExplanationForm;