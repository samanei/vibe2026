import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AgendaCard from '../components/agenda/AgendaCard';
import Pagination from '../components/common/Pagination';
import Toast from '../components/common/Toast';
import { AGENDA_CATEGORIES, PAGE_SIZE } from '../constants';
import { getAgendas, getWeeklyAgendaStats } from '../lib/api';
import type { Agenda, WeeklyAgendaStats } from '../types';

type SortKey = 'popular' | 'latest' | 'rate';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'popular', label: '🔥 인기순' },
  { key: 'latest', label: '🕐 최신순' },
  { key: 'rate', label: '👍 찬성률순' },
];
const INLINE_CATEGORIES = AGENDA_CATEGORIES.filter((item) => item !== '기타');

export default function AgendaListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [category, setCategory] = useState('전체');
  const [sort, setSort] = useState<SortKey>('popular');
  const [page, setPage] = useState(1);
  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [total, setTotal] = useState(0);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({ 전체: 0 });
  const [stats, setStats] = useState<WeeklyAgendaStats>({
    new_count: 0,
    done_count: 0,
    reviewing_count: 0,
    total_votes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<string | null>(() => {
    const state = location.state as { toast?: string } | null;
    return state?.toast ?? null;
  });

  useEffect(() => {
    const state = location.state as { toast?: string } | null;
    if (state?.toast) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    let active = true;

    Promise.resolve()
      .then(() => {
        setLoading(true);
        setError('');
        return Promise.all([
          getAgendas({ category, sort, page, limit: PAGE_SIZE }),
          getWeeklyAgendaStats(),
        ]);
      })
      .then(([agendaResponse, weeklyStats]) => {
        if (!active) return;
        setAgendas(agendaResponse.data);
        setTotal(agendaResponse.total);
        setCategoryCounts(agendaResponse.category_counts);
        setStats(weeklyStats);
      })
      .catch((err: Error) => {
        if (!active) return;
        setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [category, page, sort]);

  const selectCategory = (nextCategory: string) => {
    setCategory(nextCategory);
    setPage(1);
  };

  const selectSort = (nextSort: SortKey) => {
    setSort(nextSort);
    setPage(1);
  };

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-[248px_minmax(0,1fr)] gap-6 px-6 py-7">
      <aside className="sticky top-24 h-fit space-y-4">
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-950">카테고리</h2>
            <span className="text-xs font-bold text-slate-400">{categoryCounts.전체 ?? 0}건</span>
          </div>
          <nav className="space-y-1">
            {AGENDA_CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => selectCategory(item)}
                className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm transition ${
                  category === item
                    ? 'bg-slate-950 font-black text-white'
                    : 'font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                }`}
              >
                <span>{item}</span>
                <span className={category === item ? 'text-xs text-white/70' : 'text-xs text-slate-400'}>
                  {categoryCounts[item] ?? 0}
                </span>
              </button>
            ))}
          </nav>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <h2 className="mb-4 text-sm font-black text-slate-950">이번 주 현황</h2>
          <div className="divide-y divide-slate-100">
            <Stat label="신규 안건" value={stats.new_count} />
            <Stat label="처리 완료" value={stats.done_count} />
            <Stat label="검토 중" value={stats.reviewing_count} />
            <Stat label="총 투표 수" value={stats.total_votes} />
          </div>
        </section>
      </aside>

      <div className="min-w-0">
        <div className="mb-5 rounded-lg border border-slate-200 bg-white px-5 pt-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase text-blue-700">PUBLIC AGENDA</p>
              <h1 className="mt-1 text-2xl font-black text-slate-950">공개 안건</h1>
              <p className="mt-1 text-sm text-slate-500">학우들이 올린 안건을 확인하고 찬반 의견을 남겨보세요.</p>
            </div>
            <button
              onClick={() => navigate('/agendas/new')}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-black text-white shadow-sm hover:bg-blue-700"
            >
              + 안건 등록
            </button>
          </div>

          <div className="flex items-center gap-6">
            <button className="border-b-2 border-slate-950 px-1 pb-3 text-sm font-black text-slate-950">
              공개 안건
            </button>
            <button
              onClick={() => navigate('/inquiries/new')}
              className="px-1 pb-3 text-sm font-semibold text-slate-500 hover:text-slate-900"
            >
              비공개 문의 작성
            </button>
          </div>
        </div>

        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {INLINE_CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => selectCategory(item)}
              className={`shrink-0 rounded-md border px-3 py-2 text-sm font-bold transition ${
                category === item
                  ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mb-4 flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3">
          <div>
            <strong className="text-sm font-black text-slate-950">{category}</strong>
            <span className="ml-2 text-sm text-slate-500">총 {total}건</span>
          </div>
          <div className="flex gap-2">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => selectSort(option.key)}
                className={`rounded-md border px-3 py-2 text-sm font-bold transition ${
                  sort === option.key
                    ? 'border-slate-950 bg-slate-950 text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-sm font-medium text-slate-500">
            안건을 불러오는 중입니다.
          </div>
        ) : agendas.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-10 text-center shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <p className="text-sm font-medium text-slate-500">아직 등록된 안건이 없습니다.</p>
            <button
              onClick={() => navigate('/agendas/new')}
              className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-black text-white hover:bg-blue-700"
            >
              안건 등록하기
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {agendas.map((agenda) => (
              <AgendaCard key={agenda.id} agenda={agenda} />
            ))}
          </div>
        )}

        <Pagination page={page} total={total} limit={PAGE_SIZE} onChange={setPage} />
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="text-xs font-bold text-slate-500">{label}</div>
      <div className="text-lg font-black text-slate-950">{value}</div>
    </div>
  );
}
