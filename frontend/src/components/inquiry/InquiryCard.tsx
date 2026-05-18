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
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className={`rounded-md px-2.5 py-1 text-xs font-black ${color.bg} ${color.text}`}>
          {inquiry.status}
        </span>
        <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-600">
          {inquiry.category}
        </span>
        <span className="ml-auto text-xs font-semibold text-slate-400">{formatDate(inquiry.created_at)}</span>
      </div>

      <h2 className="text-lg font-black text-slate-950">{inquiry.title}</h2>
      <p className={`mt-2 text-sm leading-6 text-slate-600 ${inquiry.status === '답변 완료' ? '' : 'line-clamp-2'}`}>
        {inquiry.content}
      </p>

      {inquiry.status === '답변 완료' && (
        <div className="mt-5 border-l-4 border-blue-600 bg-blue-50/70 px-4 py-3">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
            <strong className="font-black text-blue-800">학생회 답변</strong>
            <span className="font-semibold text-blue-600">
              {inquiry.replied_at ? formatDate(inquiry.replied_at) : '답변일 미등록'}
            </span>
          </div>
          <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
            {inquiry.reply || '답변이 삭제되었습니다.'}
          </p>
        </div>
      )}
    </article>
  );
}
