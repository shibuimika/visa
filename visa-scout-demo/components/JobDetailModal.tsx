import { useEffect, useMemo } from 'react';
import { formatRelative, formatSalaryRange } from '@/lib/format';
import Tag from '@/components/Tag';
import type { Job } from '@/lib/mockData';

type Props = {
  open: boolean;
  job: Job | null;
  onClose: () => void;
  onApply: (jobId: string) => void;
  applied: boolean;
};

export default function JobDetailModal({ open, job, onClose, onApply, applied }: Props) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const items = useMemo(() => {
    if (!job) return [] as Array<{ label: string; value?: string }>;
    return [
      { label: '勤務地', value: job.location },
      { label: 'リモート', value: job.remote },
      { label: '雇用形態', value: job.employmentType },
      { label: '勤務時間', value: job.workingHours },
      { label: '休日', value: job.holidays },
      { label: '言語(業務)', value: job.workLang },
      { label: '日本語 読み/会話', value: job.readingLevel && job.speakingLevel ? `${job.readingLevel}/${job.speakingLevel}` : undefined },
      { label: '在留資格', value: job.visaKind },
      { label: 'ビザ支援', value: job.visaSponsorship ? 'あり' : job.visaSponsorship === false ? 'なし' : undefined },
    ].filter((i) => i.value);
  }, [job]);

  if (!open || !job) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 md:inset-auto md:right-6 md:top-6 md:w-[720px] md:rounded-2xl md:shadow-2xl bg-white border border-gray-200 md:max-h-[90vh] overflow-hidden">
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {job.companyLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={job.companyLogo} alt={job.company} className="w-10 h-10 rounded-lg object-contain bg-white p-1 border" />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg" />
            )}
            <div>
              <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
              <p className="text-gray-600">{job.company}</p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600" onClick={onClose}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-8 overflow-y-auto md:max-h-[70vh]">
          {job.summary && <p className="text-gray-800 leading-relaxed">{job.summary}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((i) => (
              <div key={i.label} className="text-sm text-gray-700">
                <span className="text-gray-500">{i.label}:</span> {i.value}
              </div>
            ))}
          </div>

          {job.requiredSkills && job.requiredSkills.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 mb-2">必須スキル</p>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map((s) => (
                  <Tag key={s} color="gray">{s}</Tag>
                ))}
              </div>
            </div>
          )}

          {job.preferredSkills && job.preferredSkills.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 mb-2">歓迎スキル</p>
              <div className="flex flex-wrap gap-2">
                {job.preferredSkills.map((s) => (
                  <Tag key={s} color="blue">{s}</Tag>
                ))}
              </div>
            </div>
          )}

          {job.description && (
            <div>
              <p className="text-sm text-gray-500 mb-2">仕事内容</p>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{job.description}</p>
            </div>
          )}

          {job.benefits && job.benefits.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 mb-2">福利厚生</p>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {job.benefits.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm text-gray-700"><span className="text-gray-500">年収レンジ:</span> {formatSalaryRange(job.salaryMin, job.salaryMax, job.salary)}</div>
            <div className="text-sm text-gray-700"><span className="text-gray-500">掲載:</span> {formatRelative(job.postedDate)}</div>
            <div className="text-sm text-gray-700"><span className="text-gray-500">更新:</span> {formatRelative(job.lastUpdated)}</div>
            {typeof job.applicantCount === 'number' && (
              <div className="text-sm text-gray-700"><span className="text-gray-500">応募者数:</span> {job.applicantCount}</div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex items-center justify-between">
          <div className="text-gray-600 text-sm">
            {job.companyWebsite && (
              <a href={job.companyWebsite} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">企業サイトを見る</a>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">閉じる</button>
            <button
              disabled={applied}
              onClick={() => job && onApply(job.id)}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                applied
                  ? 'bg-green-100 text-green-700 cursor-not-allowed border border-green-200'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {applied ? '応募済み' : '応募する'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


