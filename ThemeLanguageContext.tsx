import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeType, TranslationKey } from '../types';
import { UI_TRANSLATIONS } from '../constants';

interface ThemeLanguageContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: TranslationKey) => string;
}

const ThemeLanguageContext = createContext<ThemeLanguageContextType | undefined>(undefined);

export const ThemeLanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>('light');
  const [language, setLanguage] = useState<string>('en-IN');

  useEffect(() => {
    // Apply theme classes to the document element or body
    const root = document.documentElement;
    root.classList.remove('dark', 'sepia');
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'sepia') {
      root.classList.add('sepia');
    }
    
    // Set language attribute for accessibility
    root.lang = language.split('-')[0];
  }, [theme, language]);

  const t = (key: TranslationKey): string => {
    const langTranslations = UI_TRANSLATIONS[language] || UI_TRANSLATIONS['en-IN'];
    return langTranslations[key] || UI_TRANSLATIONS['en-IN'][key] || key;
  };

  return (
    <ThemeLanguageContext.Provider value={{ theme, setTheme, language, setLanguage, t }}>
      {children}
    </ThemeLanguageContext.Provider>
  );
};

export const useThemeLanguage = () => {
  const context = useContext(ThemeLanguageContext);
  if (!context) {
    throw new Error('useThemeLanguage must be used within a ThemeLanguageProvider');
  }
  return context;
};