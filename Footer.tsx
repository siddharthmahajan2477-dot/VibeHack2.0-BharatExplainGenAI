import React from 'react';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';

const Footer: React.FC = () => {
  const { t } = useThemeLanguage();
  return (
    <footer className="py-8 text-center text-gray-400 dark:text-gray-500 sepia:text-sepia-700 text-sm">
      <p>{t('footer_made_with')}</p>
      <p className="mt-1 text-xs">
        {t('footer_data')} • {new Date().getFullYear()}
      </p>
    </footer>
  );
};

export default Footer;