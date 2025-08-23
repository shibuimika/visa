import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import type { Language } from '@/lib/i18n';

interface HeaderProps {
  currentPage?: 'home' | 'visa' | 'scout';
}

export default function Header({ currentPage }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return (
    <header className="backdrop-blur-sm bg-white/80 border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/>
                <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd"/>
              </svg>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {t('app_title')}
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">{t('professional_platform')}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
            <nav className="hidden sm:flex items-center gap-4 lg:gap-6">
              <Link
                href="/visa"
                className={`font-medium transition-colors duration-200 pb-1 text-sm lg:text-base ${
                  currentPage === 'visa'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {t('visa_application')}
              </Link>
              <Link
                href="/scout"
                className={`font-medium transition-colors duration-200 pb-1 text-sm lg:text-base ${
                  currentPage === 'scout'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {t('scout')}
              </Link>
            </nav>

            {/* Language Switcher */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleLanguageChange('ja')}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 ${
                  language === 'ja'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-pressed={language === 'ja'}
                aria-label="Switch to Japanese"
              >
                {t('language_ja')}
              </button>
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 ${
                  language === 'en'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-pressed={language === 'en'}
                aria-label="Switch to English"
              >
                {t('language_en')}
              </button>
              <button
                onClick={() => handleLanguageChange('zh')}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 ${
                  language === 'zh'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-pressed={language === 'zh'}
                aria-label="Switch to Chinese"
              >
                {t('language_zh')}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="sm:hidden flex items-center justify-center gap-6 mt-3 pt-3 border-t border-gray-200/50">
          <Link
            href="/visa"
            className={`font-medium transition-colors duration-200 pb-1 text-sm ${
              currentPage === 'visa'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            {t('visa_application')}
          </Link>
          <Link
            href="/scout"
            className={`font-medium transition-colors duration-200 pb-1 text-sm ${
              currentPage === 'scout'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            {t('scout')}
          </Link>
        </nav>
      </div>
    </header>
  );
}

