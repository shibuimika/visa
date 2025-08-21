import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, loadLanguage, saveLanguage, DEFAULT_LANGUAGE } from './i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);

  // 初期化時にlocalStorageから言語を読み込み
  useEffect(() => {
    const storedLanguage = loadLanguage();
    setLanguageState(storedLanguage);
  }, []);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    saveLanguage(newLanguage);
  };

  const t = (key: string): string => {
    // 動的なインポートを避けるため、直接translationsを参照
    const translations = {
      ja: () => import('./i18n').then(m => m.translations.ja[key as any] || key),
      en: () => import('./i18n').then(m => m.translations.en[key as any] || key),
      zh: () => import('./i18n').then(m => m.translations.zh[key as any] || key),
    };

    // 同期的に現在の言語の翻訳を返す
    try {
      const translationModule = require('./i18n');
      return translationModule.translations[language]?.[key as any] || key;
    } catch {
      return key;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

