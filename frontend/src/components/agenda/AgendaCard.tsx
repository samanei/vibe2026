import { useNavigate } from 'react-router-dom';
import { HOT_THRESHOLD } from '../../constants';
import { formatDate, getAgreeRate, getTotalVotes } from '../../lib/agenda';
import type { Agenda } from '../../types';
import { CategoryBadge, HotBadge, StatusBadge } from '../common/Badge';

interface AgendaCardProps {
  agenda: Agenda;
}

export default function AgendaCard({ agenda }: AgendaCardProps) {
  const navigate = useNavigate();
  const agreeRate = getAgreeRate(agenda);
  const totalVotes = getTotalVotes(agenda);
  const isHot = agenda.agree_count >= HOT_THRESHOLD || (totalVotes >= 10 && agreeRate >= 70);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/agendas/${agenda.id}`)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') navigate(`/agendas/${agenda.id}`);
      }}
      className="group rounded-lg border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
    >
      <div className="mb-3 flex items-center gap-2">
        <CategoryBadge category={agenda.category} />
        <StatusBadge status={agenda.status} />
        {isHot && <HotBadge />}
        <span className="ml-auto text-xs font-medium text-slate-500">익명 · {agenda.department}</span>
      </div>

      <h2 className="line-clamp-1 text-lg font-black text-slate-950 group-hover:text-blue-700">{agenda.title}</h2>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
        {agenda.problem_description || agenda.improvement_request}
      </p>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">찬성 {agenda.agree_count}</span>
            <span className="rounded-md bg-rose-50 px-2 py-1 text-xs font-bold text-rose-700">반대 {agenda.disagree_count}</span>
          </div>
          <strong className="text-base font-black text-blue-700">{agreeRate}%</strong>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-blue-600" style={{ width: `${agreeRate}%` }} />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <span>{formatDate(agenda.created_at)}</span>
        <span className="font-semibold text-slate-500 opacity-0 transition group-hover:opacity-100">상세 보기 →</span>
      </div>
    </article>
  );
}
