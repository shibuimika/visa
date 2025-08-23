import Head from 'next/head';
import VisaForm from '@/components/VisaForm';
import { useLanguage } from '@/lib/LanguageContext';
import Header from '@/components/Header';

export default function VisaPage() {
  const { t } = useLanguage();

  return (
    <>
      <Head>
        <title>{`${t('visa_application')} - ${t('app_title')}`}</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Header currentPage="visa" />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          <VisaForm />
        </main>
      </div>
    </>
  );
}


