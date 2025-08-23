import Head from 'next/head';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import Header from '@/components/Header';

export default function Home() {
  const { t } = useLanguage();

  return (
    <>
      <Head>
        <title>{t('app_title')} - VISA申請からキャリアマッチングまで</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Header currentPage="home" />

        {/* Hero Section */}
        <main className="relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
            <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                {t('hero_title')}
              </h1>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16">
              <div className="group">
                <Link href="/visa" className="block">
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 lg:p-8 border border-gray-100 group-hover:border-blue-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full transform translate-x-3 sm:translate-x-4 lg:translate-x-6 -translate-y-3 sm:-translate-y-4 lg:-translate-y-6"></div>
                    <div className="relative">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                      </div>
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">{t('visa_application_title')}</h3>
                      <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                        {t('feature_visa_description')}
                      </p>
                      <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-1 transition-transform duration-200 text-sm sm:text-base">
                        {t('feature_visa_title')}
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="group">
                <Link href="/scout" className="block">
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 lg:p-8 border border-gray-100 group-hover:border-indigo-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-indigo-50 to-transparent rounded-bl-full transform translate-x-3 sm:translate-x-4 lg:translate-x-6 -translate-y-3 sm:-translate-y-4 lg:-translate-y-6"></div>
                    <div className="relative">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"/>
                        </svg>
                      </div>
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">{t('scout_title')}</h3>
                      <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                        {t('feature_scout_description')}
                      </p>
                      <div className="flex items-center text-indigo-600 font-semibold group-hover:translate-x-1 transition-transform duration-200 text-sm sm:text-base">
                        {t('feature_scout_title')}
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Quick Start */}
            <div className="text-center">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">{t('quick_start_title')}</h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-8 max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto">
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base">1</div>
                  <span className="text-sm sm:text-base text-gray-700 font-medium">{t('step1')}</span>
                </div>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-400 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-400 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                </svg>
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base">2</div>
                  <span className="text-sm sm:text-base text-gray-700 font-medium">{t('step2')}</span>
                </div>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-400 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-400 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                </svg>
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base">3</div>
                  <span className="text-sm sm:text-base text-gray-700 font-medium">{t('step3')}</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
