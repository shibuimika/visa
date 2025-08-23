import Head from 'next/head';
import VisaForm from '@/components/VisaForm';
import { useLanguage } from '@/lib/LanguageContext';
import Header from '@/components/Header';

export default function VisaPage() {
  const { t } = useLanguage();

  return (
    <>
      <Head>
        <title>{`${t('visa_application')} | ${t('local_demo')}`}</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Header currentPage="visa" />
        <main className="max-w-5xl mx-auto px-4 py-10">
          <VisaForm />
        </main>
      </div>
    </>
  );
}


