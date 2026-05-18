// 관리자 안건 목록을 검색하고 처리 상태를 변경하는 페이지
import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import AdminGNB from '../components/admin/AdminGNB';
import Toast from '../components/common/Toast';
import api from '../lib/api';
import type { AdminAgenda, AdminAgendaListResponse, AdminAgendaStatusCount, AgendaStatus } from '../types';

const STATUS_OPTIONS: AgendaStatus[] = ['접수됨', '검토 중', '학교 전달 완료', '반영 완료', '반영 어려움'];

const DEFAULT_COUNTS: AdminAgendaStatusCount[] = [
  { status: '전체', label: '전체', value: 0 },
  { status: '접수됨', label: '접수됨', value: 0 },
  { status: '검토 중', label: '검토 중', value: 0 },
  { status: '학교 전달 완료', label: '전달 완료', value: 0 },
  { status: '반영 완료', label: '반영 완료', value: 0 },
  { status: '반영 어려움', label: '반영 어려움', value: 0 },
];

function formatDate(value: string) {
  return new Date(value.replace(' ', 'T')).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\. /g, '.').replace(/\.$/, '');
}

function CategoryPill({ category }: { category: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600">
      {category}
    </span>
  );
}

function SearchIcon() {
  return (
    <svg className="h-5 w-5 text-blue-500" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2" />
      <path d="M16 16l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function AdminAgendaPage() {
  const [agendas, setAgendas] = useState<AdminAgenda[]>([]);
  const [statusCounts, setStatusCounts] = useState<AdminAgendaStatusCount[]>(DEFAULT_COUNTS);
  const [activeStatus, setActiveStatus] = useState<AgendaStatus | '전체'>('전체');
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (keyword.trim()) params.set('keyword', keyword.trim());
    if (activeStatus !== '전체') params.set('status', activeStatus);
    return params.toString();
  }, [activeStatus, keyword]);

  useEffect(() => {
    let ignore = false;

    async function fetchAgendas() {
      setIsLoading(true);
      setError('');

      try {
        const response = await api.get<AdminAgendaListResponse>(`/admin/agendas${queryParams ? `?${queryParams}` : ''}`);
        if (ignore) return;
        setAgendas(response.data.data);
        setStatusCounts(response.data.status_counts);
      } catch (err) {
        if (ignore) return;
        setAgendas([]);
        setError(err instanceof Error ? err.message : '안건 목록을 불러오지 못했습니다.');
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    fetchAgendas();

    return () => {
      ignore = true;
    };
  }, [queryParams]);

  const handleStatusChange = async (agenda: AdminAgenda, nextStatus: AgendaStatus) => {
    const previousStatus = agenda.status;
    setAgendas((prev) => prev.map((item) => (item.id === agenda.id ? { ...item, status: nextStatus } : item)));

    try {
      await api.patch(`/admin/agendas/${agenda.id}/status`, { status: nextStatus });
      setToast({ message: '처리 상태가 변경되었습니다.', type: 'success' });
    } catch (err) {
      setAgendas((prev) => prev.map((item) => (item.id === agenda.id ? { ...item, status: previousStatus } : item)));
      setToast({ message: err instanceof Error ? err.message : '처리 상태를 변경하지 못했습니다.', type: 'error' });
    }
  };

  const emptyMessage = keyword.trim() ? '검색 결과가 없습니다.' : '등록된 안건이 없습니다.';

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminGNB />
      <main className="max-w-7xl mx-auto px-6 py-10 lg:px-10 lg:py-12">
        <div className="flex items-center justify-between gap-6">
          <h1 className="text-2xl font-bold text-slate-900">안건 관리</h1>
          <label className="relative w-[280px] md:w-[360px] shrink-0">
            <span className="absolute left-4 top-1/2 -translate-y-1/2">
              <SearchIcon />
            </span>
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-800 shadow-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition"
              placeholder="안건 검색..."
            />
          </label>
        </div>

        <div className="mt-9 flex flex-wrap items-center gap-2.5">
          {statusCounts.map((count) => {
            const isActive = activeStatus === count.status;

            return (
              <button
                key={count.status}
                type="button"
                onClick={() => setActiveStatus(count.status)}
                className={`h-9 rounded-full border px-5 text-sm font-semibold transition ${
                  isActive
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 transition'
                }`}
              >
                {count.label} ({count.value})
              </button>
            );
          })}
        </div>

        <section className="mt-6 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
          <table className="w-full table-fixed border-collapse">
            <colgroup>
              <col className="w-[46%]" />
              <col className="w-[7%]" />
              <col className="w-[7%]" />
              <col className="w-[8%]" />
              <col className="w-[15%]" />
              <col className="w-[17%]" />
            </colgroup>
            <thead>
              <tr className="h-12 border-b border-slate-100 bg-slate-50/80 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
                <th className="px-7">안건 제목</th>
                <th className="px-3 text-center">찬성</th>
                <th className="px-3 text-center">반대</th>
                <th className="px-3 text-center">공감률</th>
                <th className="px-3">카테고리 · 학과</th>
                <th className="px-7">처리 상태 변경</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && (
                <tr>
                  <td colSpan={6} className="h-36 text-center text-sm text-slate-400">
                    안건을 불러오는 중입니다.
                  </td>
                </tr>
              )}
              {!isLoading && error && (
                <tr>
                  <td colSpan={6} className="h-36 text-center text-sm font-medium text-red-600">
                    {error}
                  </td>
                </tr>
              )}
              {!isLoading && !error && agendas.length === 0 && (
                <tr>
                  <td colSpan={6} className="h-36 text-center text-sm text-slate-400">
                    {emptyMessage}
                  </td>
                </tr>
              )}
              {!isLoading && !error && agendas.map((agenda) => (
                <tr key={agenda.id} className="h-20 hover:bg-slate-50/50 transition">
                  <td className="px-7">
                    <p className="truncate text-sm font-semibold text-slate-900">{agenda.title}</p>
                    <p className="mt-1 text-xs text-slate-400">{formatDate(agenda.created_at)} 등록</p>
                  </td>
                  <td className="px-3 text-center text-sm font-bold text-slate-900">{agenda.agree_count}</td>
                  <td className="px-3 text-center text-sm font-bold text-slate-900">{agenda.disagree_count}</td>
                  <td className="px-3 text-center text-sm font-bold text-indigo-600">{agenda.agreement_rate}%</td>
                  <td className="px-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <CategoryPill category={agenda.category} />
                      <span className="truncate text-sm font-medium text-slate-500">{agenda.department}</span>
                    </div>
                  </td>
                  <td className="px-7">
                    <select
                      value={agenda.status}
                      onChange={(event: ChangeEvent<HTMLSelectElement>) => handleStatusChange(agenda, event.target.value as AgendaStatus)}
                      className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
