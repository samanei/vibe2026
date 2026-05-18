import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import InquiryCard from '../components/inquiry/InquiryCard';
import Toast from '../components/common/Toast';
import { INQUIRY_STATUS_FILTERS } from '../constants';
import { getMyInquiries } from '../lib/api';
import { getUserToken } from '../lib/session';
import type { Inquiry, InquiryStats, InquiryStatus } from '../types';

type StatusFilter = '전체' | InquiryStatus;

const EMPTY_STATS: InquiryStats = {
  total: 0,
  done: 0,
  waiting: 0,
  reviewing: 0,
};

export default function MyInquiriesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [filter, setFilter] = useState<StatusFilter>('전체');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [stats, setStats] = useState<InquiryStats>(EMPTY_STATS);
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
        return getMyInquiries(getUserToken());
      })
      .then((response) => {
        if (!active) return;
        setInquiries(response.data);
        setStats(response.stats);
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
  }, []);

  const filteredInquiries = useMemo(() => {
    if (filter === '전체') return inquiries;
    return inquiries.filter((inquiry) => inquiry.status === filter);
  }, [filter, inquiries]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-7">
      <div className="mb-5 flex items-center justify-between">
        <button onClick={() => navigate('/agendas')} className="text-sm font-black text-slate-600 hover:text-slate-950">
          ← 돌아가기
        </button>
        <button
          onClick={() => navigate('/inquiries/new')}
          className="rounded-md bg-slate-950 px-4 py-2 text-sm font-black text-white shadow-sm hover:bg-slate-800"
        >
          + 새 문의
        </button>
      </div>

      <section className="mb-5 rounded-lg border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <p className="text-xs font-black uppercase text-emerald-700">MY INQUIRIES</p>
        <h1 className="mt-1 text-2xl font-black text-slate-950">내 문의함</h1>
        <p className="mt-1 text-sm text-slate-500">내가 제출한 비공개 문의와 답변 상태를 확인할 수 있습니다.</p>

        <div className="mt-6 grid grid-cols-4 gap-3">
          <Stat label="총 문의" value={stats.total} />
          <Stat label="답변 완료" value={stats.done} />
          <Stat label="대기 중" value={stats.waiting} />
          <Stat label="검토 중" value={stats.reviewing} />
        </div>
      </section>

      <div className="mb-4 flex flex-wrap gap-2">
        {INQUIRY_STATUS_FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`rounded-md border px-3 py-2 text-sm font-bold transition ${
              filter === item
                ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-sm font-medium text-slate-500">
          문의를 불러오는 중입니다.
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-10 text-center shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <p className="text-sm font-medium text-slate-500">해당 상태의 문의가 없습니다.</p>
          <button
            onClick={() => navigate('/inquiries/new')}
            className="mt-4 rounded-md bg-emerald-600 px-4 py-2 text-sm font-black text-white hover:bg-emerald-700"
          >
            문의 작성하기
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredInquiries.map((inquiry) => (
            <InquiryCard key={inquiry.id} inquiry={inquiry} />
          ))}
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs font-bold text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-black text-slate-950">{value}</div>
    </div>
  );
}
