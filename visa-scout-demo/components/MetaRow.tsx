import { formatRelative } from '@/lib/format';
import { useLanguage } from '@/lib/LanguageContext';

type Props = {
  postedDate?: string;
  lastUpdated?: string;
  applicantCount?: number;
  status?: 'open' | 'closed';
};

export default function MetaRow({ postedDate, lastUpdated, applicantCount, status }: Props) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-700">
      <div>
        <span className="text-gray-500">{t('posted_label')}</span> {formatRelative(postedDate)}
      </div>
      <div>
        <span className="text-gray-500">{t('updated_label')}</span> {formatRelative(lastUpdated)}
      </div>
      <div>
        <span className="text-gray-500">{t('applicants_label')}</span> {typeof applicantCount === 'number' ? applicantCount : '-'}
      </div>
      <div>
        <span className="text-gray-500">{t('status_label')}</span> {status === 'open' ? t('status_open') : status === 'closed' ? t('status_closed') : '-'}
      </div>
    </div>
  );
}


