import type { Job } from '@/lib/mockData';
import type { ScoredJob } from '@/lib/fakeApi';
import { formatSalaryRange } from '@/lib/format';
import Tag from '@/components/Tag';
import MetaRow from '@/components/MetaRow';

type Props = {
  job: Job | ScoredJob;
  applied: boolean;
  onApply: (jobId: string) => void;
};

export default function JobCard({ job, applied, onApply }: Props) {
  const scored = (job as ScoredJob).score !== undefined ? (job as ScoredJob) : undefined;
  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 overflow-hidden">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {job.companyLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={job.companyLogo} alt={job.company} className="w-10 h-10 rounded-lg object-contain bg-white p-1 border" />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"/>
                  </svg>
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-200">
                  {job.title}
                </h3>
                <p className="text-gray-600 font-medium">{job.company}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {scored && (
              <div className="flex items-center gap-2">
                <div className="h-2 w-28 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                    style={{ width: `${Math.min(100, Math.max(0, scored.score))}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-700">{Math.floor(Math.max(0, Math.min(100, (scored.score ?? 0))))}%</span>
              </div>
            )}
            <div className="rounded-lg px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 font-semibold text-sm">
              {formatSalaryRange(job.salaryMin, job.salaryMax, job.salary)}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Requirements */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0v10a2 2 0 01-2 2H9a2 2 0 01-2-2V8m6 0V6"/>
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">日本語レベル</p>
              <div>
                <Tag color="blue" icon={<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0v10a2 2 0 01-2 2H9a2 2 0 01-2-2V8m6 0V6"/></svg>}>
                  {job.jlpt}
                </Tag>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">在留資格</p>
              <div>
                <Tag color="indigo" icon={<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>}>
                  {job.visaKind}
                </Tag>
              </div>
            </div>
          </div>
        </div>

        {/* Extended Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {job.location && (
            <div className="text-sm text-gray-700"><span className="text-gray-500">勤務地:</span> {job.location}</div>
          )}
          {job.remote && (
            <div className="text-sm text-gray-700"><span className="text-gray-500">リモート:</span> {job.remote}</div>
          )}
          {job.employmentType && (
            <div className="text-sm text-gray-700"><span className="text-gray-500">雇用形態:</span> {job.employmentType}</div>
          )}
          {('applicantCount' in job) && typeof job.applicantCount === 'number' && (
            <div className="text-sm text-gray-700"><span className="text-gray-500">応募者数:</span> {job.applicantCount}</div>
          )}
        </div>
        <MetaRow postedDate={job.postedDate} lastUpdated={job.lastUpdated} applicantCount={job.applicantCount} status={job.status} />

        {job.summary && (
          <p className="text-sm text-gray-700 leading-relaxed mb-4">{job.summary}</p>
        )}
        {job.requiredSkills && job.requiredSkills.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">必須スキル</p>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.slice(0, 3).map((s) => (
                <Tag key={s} color="gray">{s}</Tag>
              ))}
            </div>
          </div>
        )}

        {scored && scored.reasons?.length > 0 && (
          <div className="mb-6">
            <p className="text-xs text-gray-500 mb-2">マッチ理由</p>
            <div className="flex flex-wrap gap-2">
              {scored.reasons.slice(0, 2).map((r, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  {r.label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Apply Button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>今すぐ応募可能</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const event = new CustomEvent('open-job-detail', { detail: { jobId: job.id } });
                window.dispatchEvent(event);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              詳細を見る
            </button>
            <button
            disabled={applied}
            onClick={() => onApply(job.id)}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
              applied 
                ? 'bg-green-100 text-green-700 cursor-not-allowed border border-green-200' 
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            }`}
          >
            {applied ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                応募済み
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
                応募する
              </>
            )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


