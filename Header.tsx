import React, { useState } from 'react';
import { BookOpen, Settings, X, Moon, Sun, Palette, Globe } from 'lucide-react';
import { APP_NAME, APP_TAGLINE, TRANSLATION_LANGUAGES } from '../constants';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';

const Header: React.FC = () => {
  const { theme, setTheme, language, setLanguage, t } = useThemeLanguage();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <header className="fixed w-full top-0 z-50 transition-all duration-300 glass-panel border-b border-white/20 dark:border-slate-800/50 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="bg-gradient-to-br from-india-orange via-white to-india-green p-2.5 rounded-xl shadow-md border border-white/50 dark:border-slate-700 transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110">
            <BookOpen className="w-6 h-6 text-india-blue dark:text-blue-900" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 sepia:from-sepia-900 sepia:to-sepia-800 tracking-tight font-sans">
              {APP_NAME}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 sepia:text-sepia-800 font-medium hidden sm:block tracking-wide uppercase">
              {APP_TAGLINE}
            </p>
          </div>
        </div>

        {/* Settings Button */}
        <div className="relative">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2.5 rounded-full transition-all duration-300 ${showSettings ? 'bg-gray-100 dark:bg-slate-800 rotate-90' : 'hover:bg-gray-100/50 dark:hover:bg-slate-800/50'} text-gray-600 dark:text-gray-300 sepia:text-sepia-800`}
            title="Settings"
          >
            {showSettings ? <X className="w-6 h-6" /> : <Settings className="w-6 h-6" />}
          </button>

          {/* Settings Dropdown */}
          {showSettings && (
            <div className="absolute right-0 top-full mt-4 w-80 glass-panel bg-white/95 dark:bg-slate-900/95 sepia:bg-sepia-50/95 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 sepia:border-sepia-200 p-6 animate-in fade-in slide-in-from-top-4 duration-300 z-50 backdrop-blur-xl">
              <h3 className="font-bold text-lg text-gray-800 dark:text-white sepia:text-sepia-900 mb-5 pb-3 border-b border-gray-100 dark:border-slate-800 sepia:border-sepia-200 flex items-center gap-2">
                <Settings className="w-5 h-5 text-india-orange" />
                {t('settings_title')}
              </h3>

              {/* Theme Selector */}
              <div className="mb-6">
                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 sepia:text-sepia-800 uppercase tracking-wider mb-3 block">
                  {t('theme_label')}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-300 ${
                      theme === 'light' 
                        ? 'bg-blue-50/50 border-blue-500 text-blue-700 shadow-inner' 
                        : 'border-transparent bg-gray-50 dark:bg-slate-800 hover:scale-105'
                    }`}
                  >
                    <Sun className="w-5 h-5 mb-1.5" />
                    <span className="text-xs font-semibold">Light</span>
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-300 ${
                      theme === 'dark' 
                        ? 'bg-slate-800 border-indigo-500 text-indigo-400 shadow-inner' 
                        : 'border-transparent bg-gray-50 dark:bg-slate-800 hover:scale-105'
                    }`}
                  >
                    <Moon className="w-5 h-5 mb-1.5" />
                    <span className="text-xs font-semibold">Dark</span>
                  </button>
                  <button
                    onClick={() => setTheme('sepia')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-300 ${
                      theme === 'sepia' 
                        ? 'bg-amber-100 border-amber-600 text-amber-900 shadow-inner' 
                        : 'border-transparent bg-gray-50 dark:bg-slate-800 hover:scale-105'
                    }`}
                  >
                    <Palette className="w-5 h-5 mb-1.5" />
                    <span className="text-xs font-semibold">Sepia</span>
                  </button>
                </div>
              </div>

              {/* Language Selector */}
              <div>
                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 sepia:text-sepia-800 uppercase tracking-wider mb-3 block">
                  {t('language_label')}
                </label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-hover:text-india-blue">
                    <Globe className="w-4 h-4 text-gray-400" />
                  </div>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-800 sepia:bg-sepia-100 border-2 border-transparent hover:border-gray-200 dark:hover:border-slate-700 rounded-xl text-sm text-gray-700 dark:text-gray-200 sepia:text-sepia-900 focus:outline-none focus:border-india-orange focus:ring-0 transition-all cursor-pointer appearance-none"
                  >
                    {TRANSLATION_LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;