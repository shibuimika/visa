import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>VISA Scout Demo | ローカル完結</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Modern Header */}
        <header className="backdrop-blur-sm bg-white/80 border-b border-gray-200/50 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
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
              </div>
              <nav className="flex items-center gap-6">
                <Link href="/visa" className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200">
                  VISA申請
                </Link>
                <Link href="/scout" className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200">
                  スカウト
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="relative">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                </svg>
                ローカル完結デモ
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                VISA申請から
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block">
                  キャリアマッチングまで
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                APIなし・メモリ＋localStorage＋擬似非同期処理で、<br/>
                リアルなVISA申請体験とスカウト機能を体験できます
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="group">
                <Link href="/visa" className="block">
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 group-hover:border-blue-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full transform translate-x-6 -translate-y-6"></div>
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">VISA申請</h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        在留資格、期限、日本語レベルなど、必要な情報を入力してVISA申請を行います
                      </p>
                      <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-1 transition-transform duration-200">
                        申請を開始
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="group">
                <Link href="/scout" className="block">
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 group-hover:border-indigo-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-50 to-transparent rounded-bl-full transform translate-x-6 -translate-y-6"></div>
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"/>
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">スカウト機能</h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        申請情報に基づいて、あなたに最適な求人が自動的にマッチングされます
                      </p>
                      <div className="flex items-center text-indigo-600 font-semibold group-hover:translate-x-1 transition-transform duration-200">
                        求人を探す
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">簡単3ステップで始める</h2>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-4xl mx-auto">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <span className="text-gray-700 font-medium">基本情報を入力</span>
                </div>
                <svg className="w-6 h-6 text-gray-400 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <span className="text-gray-700 font-medium">VISA申請を送信</span>
                </div>
                <svg className="w-6 h-6 text-gray-400 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <span className="text-gray-700 font-medium">マッチング求人を確認</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
