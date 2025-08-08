import { formatRelative } from '@/lib/format';

type Props = {
  postedDate?: string;
  lastUpdated?: string;
  applicantCount?: number;
  status?: 'open' | 'closed';
};

export default function MetaRow({ postedDate, lastUpdated, applicantCount, status }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-700">
      <div>
        <span className="text-gray-500">掲載:</span> {formatRelative(postedDate)}
      </div>
      <div>
        <span className="text-gray-500">更新:</span> {formatRelative(lastUpdated)}
      </div>
      <div>
        <span className="text-gray-500">応募者数:</span> {typeof applicantCount === 'number' ? applicantCount : '-'}
      </div>
      <div>
        <span className="text-gray-500">状態:</span> {status === 'open' ? '募集中' : status === 'closed' ? '募集終了' : '-'}
      </div>
    </div>
  );
}


