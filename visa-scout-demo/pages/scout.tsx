import Head from 'next/head';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import Header from '@/components/Header';
import { useEffect, useMemo, useState } from 'react';
import { loadAppliedJobs, loadLastApplication, saveAppliedJobs, matchJobsWithScore } from '@/lib/fakeApi';
import JobCard from '@/components/JobCard';
import Toast from '@/components/Toast';
import type { ScoredJob } from '@/lib/fakeApi';
import JobDetailModal from '@/components/JobDetailModal';

export default function ScoutPage() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [appToast, setAppToast] = useState<string | null>(null);
  const [applied, setApplied] = useState<string[]>([]);
  const [jobs, setJobs] = useState<ScoredJob[]>([]);
  const [hadApplication, setHadApplication] = useState(false);
  const [openJobId, setOpenJobId] = useState<string | null>(null);

  useEffect(() => {
    const last = loadLastApplication();
    const appliedIds = loadAppliedJobs();
    setApplied(appliedIds);
    if (last) {
      setHadApplication(true);
      const scored = matchJobsWithScore(last);
      setJobs(scored);
    } else {
      setJobs([]);
    }
    // 擬似非同期に見えるように少し待つ
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  // Custom event で JobCard からモーダルを開く
  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<{ jobId: string }>;
      setOpenJobId(custom.detail.jobId);
    };
    window.addEventListener('open-job-detail', handler as EventListener);
    return () => window.removeEventListener('open-job-detail', handler as EventListener);
  }, []);

  const handleApply = (jobId: string) => {
    if (applied.includes(jobId)) return;
    const next = [...applied, jobId];
    setApplied(next);
    saveAppliedJobs(next);
    setAppToast(`${t('apply_success')} (ID: ${jobId})`);
  };

  const hasApplication = useMemo(() => jobs.length > 0, [jobs.length]);

  return (
    <>
      <Head>
        <title>{`${t('scout')} | ${t('local_demo')}`}</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Header currentPage="scout" />

        {appToast && <Toast message={appToast} onClose={() => setAppToast(null)} />}

        <main className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              {t('jlpt_visa_match')}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('your_recommended_jobs')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('matching_application_info')}
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-600 mt-4 text-lg">{t('loading_jobs')}</p>
            </div>
          ) : hasApplication ? (
            <div className="grid grid-cols-1 gap-6">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  applied={applied.includes(job.id)}
                  onApply={handleApply}
                />)
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 max-w-lg mx-auto">
                {hadApplication ? (
                  <>
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{t('no_matching_jobs')}</h3>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                      {t('no_matches_description')}
                    </p>
                    <Link href="/visa" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                      </svg>
                      {t('retry_application')}
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{t('no_application_found')}</h3>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                      {t('no_application_description')}
                    </p>
                    <Link href="/visa" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                      </svg>
                      {t('start_visa_application')}
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
          <JobDetailModal
            open={!!openJobId}
            job={openJobId ? jobs.find((j) => j.id === openJobId) ?? null : null}
            onClose={() => setOpenJobId(null)}
            onApply={handleApply}
            applied={openJobId ? applied.includes(openJobId) : false}
          />
        </main>
      </div>
    </>
  );
}


