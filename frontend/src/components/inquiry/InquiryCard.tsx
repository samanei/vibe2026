import { INQUIRY_STATUS_COLORS } from '../../constants';
import { formatDate } from '../../lib/agenda';
import type { Inquiry } from '../../types';

interface InquiryCardProps {
  inquiry: Inquiry;
}

export default function InquiryCard({ inquiry }: InquiryCardProps) {
  const color = INQUIRY_STATUS_COLORS[inquiry.status] ?? {
    bg: 'bg-slate-50',
    text: 'text-slate-600',
  };

  return (
    <article className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${color.bg} ${color.text}`}>
          {inquiry.status}
        </span>
        <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600">
          {inquiry.category}
        </span>
        <span className="ml-auto text-xs font-medium text-slate-400">{formatDate(inquiry.created_at)}</span>
      </div>

      <h2 className="text-base font-bold text-slate-900">{inquiry.title}</h2>
      <p className={`mt-1.5 text-sm leading-relaxed text-slate-500 ${inquiry.status === '답변 완료' ? '' : 'line-clamp-2'}`}>
        {inquiry.content}
      </p>

      {inquiry.status === '답변 완료' && (
        <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
            <strong className="font-semibold text-emerald-800">학생회 답변</strong>
            <span className="font-medium text-emerald-600">
              {inquiry.replied_at ? formatDate(inquiry.replied_at) : '답변일 미등록'}
            </span>
          </div>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
            {inquiry.reply || '답변이 삭제되었습니다.'}
          </p>
        </div>
      )}
    </article>
  );
}
