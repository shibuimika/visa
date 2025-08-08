import Head from 'next/head';
import VisaForm from '@/components/VisaForm';
import Link from 'next/link';

export default function VisaPage() {
  return (
    <>
      <Head>
        <title>VISA申請 | ローカル完結デモ</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <header className="backdrop-blur-sm bg-white/80 border-b border-gray-200/50 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/>
                    <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    VISA Scout
                  </h1>
                  <p className="text-xs text-gray-500">Professional Platform</p>
                </div>
              </Link>
              <nav className="flex items-center gap-6">
                <Link href="/visa" className="text-blue-600 border-b-2 border-blue-600 font-medium transition-colors duration-200 pb-1">
                  VISA申請
                </Link>
                <Link href="/scout" className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200">
                  スカウト
                </Link>
              </nav>
            </div>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-10">
          <VisaForm />
        </main>
      </div>
    </>
  );
}


