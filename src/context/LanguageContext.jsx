import { useState, useEffect } from 'react';
import { translations } from '../utils/translations';
import { LanguageContext } from './LanguageContextInstance';

const STORAGE_KEY_LANG = 'mess_calculator_lang_v1';

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_LANG);
      if (stored === 'bn' || stored === 'en') {
        return stored;
      }
    } catch (e) {
      console.error('Error loading language setting:', e);
    }
    return 'bn'; // Default to Bangla
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LANG, language);
    } catch (e) {
      console.error('Error saving language setting:', e);
    }
  }, [language]);

  const setLanguage = (lang) => {
    if (lang === 'bn' || lang === 'en') {
      setLanguageState(lang);
    }
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'bn' ? 'en' : 'bn'));
  };

  const t = translations[language] || translations.bn;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;

