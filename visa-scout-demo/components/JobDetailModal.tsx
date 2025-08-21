import { useEffect, useMemo } from 'react';
import { formatRelative, formatSalaryRange } from '@/lib/format';
import Tag from '@/components/Tag';
import type { Job } from '@/lib/mockData';
import { useLanguage } from '@/lib/LanguageContext';

type Props = {
  open: boolean;
  job: Job | null;
  onClose: () => void;
  onApply: (jobId: string) => void;
  applied: boolean;
};

export default function JobDetailModal({ open, job, onClose, onApply, applied }: Props) {
  const { t } = useLanguage();

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
      { label: t('location_label'), value: job.location },
      { label: t('remote'), value: job.remote },
      { label: t('employment_type_label'), value: job.employmentType },
      { label: t('working_hours_label'), value: job.workingHours },
      { label: t('holidays_label'), value: job.holidays },
      { label: t('work_language_label'), value: job.workLang },
      { label: t('japanese_read_speak_label'), value: job.readingLevel && job.speakingLevel ? `${job.readingLevel}/${job.speakingLevel}` : undefined },
      { label: t('visa_type_label'), value: job.visaKind },
      { label: t('visa_sponsorship_label'), value: job.visaSponsorship ? t('option_yes') : job.visaSponsorship === false ? t('option_no') : undefined },
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
              <p className="text-sm text-gray-500 mb-2">{t('required_skills_label')}</p>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map((s) => (
                  <Tag key={s} color="gray">{s}</Tag>
                ))}
              </div>
            </div>
          )}

          {job.preferredSkills && job.preferredSkills.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 mb-2">{t('welcome_skills_label')}</p>
              <div className="flex flex-wrap gap-2">
                {job.preferredSkills.map((s) => (
                  <Tag key={s} color="blue">{s}</Tag>
                ))}
              </div>
            </div>
          )}

          {job.description && (
            <div>
              <p className="text-sm text-gray-500 mb-2">{t('job_description_label')}</p>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{job.description}</p>
            </div>
          )}

          {job.benefits && job.benefits.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 mb-2">{t('benefits_label')}</p>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {job.benefits.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm text-gray-700"><span className="text-gray-500">{t('salary_range_label')}</span> {formatSalaryRange(job.salaryMin, job.salaryMax, job.salary)}</div>
            <div className="text-sm text-gray-700"><span className="text-gray-500">{t('posted_label')}</span> {formatRelative(job.postedDate)}</div>
            <div className="text-sm text-gray-700"><span className="text-gray-500">{t('updated_label')}</span> {formatRelative(job.lastUpdated)}</div>
            {typeof job.applicantCount === 'number' && (
              <div className="text-sm text-gray-700"><span className="text-gray-500">{t('applicants_label')}</span> {job.applicantCount}</div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex items-center justify-between">
          <div className="text-gray-600 text-sm">
            {job.companyWebsite && (
              <a href={job.companyWebsite} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{t('view_company_site')}</a>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">{t('close_button')}</button>
            <button
              disabled={applied}
              onClick={() => job && onApply(job.id)}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                applied
                  ? 'bg-green-100 text-green-700 cursor-not-allowed border border-green-200'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {applied ? t('applied') : t('apply_job')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


