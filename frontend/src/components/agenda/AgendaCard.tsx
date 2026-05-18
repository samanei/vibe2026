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
      className="group rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-100 hover:shadow-md cursor-pointer"
    >
      <div className="mb-3 flex items-center gap-2">
        <CategoryBadge category={agenda.category} />
        <StatusBadge status={agenda.status} />
        {isHot && <HotBadge />}
        <span className="ml-auto text-xs font-medium text-slate-400">익명 · {agenda.department}</span>
      </div>

      <h2 className="line-clamp-1 text-base font-bold text-slate-900 group-hover:text-indigo-700 transition">{agenda.title}</h2>
      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-500">
        {agenda.problem_description || agenda.improvement_request}
      </p>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">찬성 {agenda.agree_count}</span>
            <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-600">반대 {agenda.disagree_count}</span>
          </div>
          <strong className="text-base font-bold text-indigo-700">{agreeRate}%</strong>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600" style={{ width: `${agreeRate}%` }} />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <span>{formatDate(agenda.created_at)}</span>
        <span className="font-medium text-indigo-500 opacity-0 transition group-hover:opacity-100">상세 보기 →</span>
      </div>
    </article>
  );
}
