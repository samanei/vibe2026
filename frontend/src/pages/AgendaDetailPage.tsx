import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StatusTimeline from '../components/agenda/StatusTimeline';
import VoteButtons from '../components/agenda/VoteButtons';
import { CategoryBadge, StatusBadge } from '../components/common/Badge';
import Toast from '../components/common/Toast';
import { formatDate, getAgreeRate, getTotalVotes } from '../lib/agenda';
import { getAgenda, voteAgenda } from '../lib/api';
import { getUserToken } from '../lib/session';
import type { AgendaDetail, VoteType } from '../types';

export default function AgendaDetailPage() {
  const navigate = useNavigate();
  const params = useParams();
  const agendaId = Number(params.id);
  const invalidAgendaId = !Number.isInteger(agendaId) || agendaId <= 0;
  const [agenda, setAgenda] = useState<AgendaDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (invalidAgendaId) return;

    let active = true;
    Promise.resolve()
      .then(() => {
        setLoading(true);
        return getAgenda(agendaId, getUserToken());
      })
      .then((data) => {
        if (active) setAgenda(data);
      })
      .catch((err: Error) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [agendaId, invalidAgendaId]);

  const handleVote = async (voteType: VoteType) => {
    if (!agenda || voting) return;

    setVoting(true);
    try {
      const response = await voteAgenda(agenda.id, voteType, getUserToken());
      if (response.data) setAgenda(response.data);
      setToast({ message: response.message || '투표가 반영되었습니다.', type: 'success' });
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : '투표에 실패했습니다.', type: 'error' });
    } finally {
      setVoting(false);
    }
  };

  if (invalidAgendaId) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-8">
        <button onClick={() => navigate('/agendas')} className="mb-6 text-sm font-medium text-slate-500 hover:text-slate-900 transition">
          ← 목록으로
        </button>
        <div className="rounded-xl border border-slate-100 bg-white p-8 text-center text-sm text-slate-600">
          삭제된 안건입니다.
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="mx-auto max-w-6xl px-6 py-8 text-sm font-medium text-slate-500">안건을 불러오는 중입니다.</div>;
  }

  if (error || !agenda) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-8">
        <button onClick={() => navigate('/agendas')} className="mb-6 text-sm font-medium text-slate-500 hover:text-slate-900 transition">
          ← 목록으로
        </button>
        <div className="rounded-xl border border-slate-100 bg-white p-8 text-center text-sm text-slate-600">
          {error || '삭제된 안건입니다.'}
        </div>
      </div>
    );
  }

  const agreeRate = getAgreeRate(agenda);
  const totalVotes = getTotalVotes(agenda);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-5 flex items-center justify-between">
        <button onClick={() => navigate('/agendas')} className="text-sm font-medium text-slate-500 hover:text-slate-900 transition">
          ← 목록으로
        </button>
        <span className="rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
          익명 · {agenda.department}
        </span>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_280px] gap-6">
        <main className="space-y-5">
          <section className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <CategoryBadge category={agenda.category} />
              <StatusBadge status={agenda.status} />
              <span className="text-xs font-semibold text-slate-400">{formatDate(agenda.created_at)}</span>
            </div>

            <h1 className="text-2xl font-bold leading-snug text-slate-900">{agenda.title}</h1>

            <div className="mt-8 grid gap-5">
              <TextSection title="문제 상황" content={agenda.problem_description} />
              <TextSection title="개선 요청" content={agenda.improvement_request} />
            </div>
          </section>

          <section className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">투표 현황</h2>
              <span className="text-sm font-semibold text-slate-500">총 {totalVotes}명 참여</span>
            </div>
            <div className="grid grid-cols-4 gap-3 text-center">
              <Metric label="찬성" value={agenda.agree_count} />
              <Metric label="공감률" value={`${agreeRate}%`} accent />
              <Metric label="반대" value={agenda.disagree_count} />
              <Metric label="총 참여" value={totalVotes} />
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600" style={{ width: `${agreeRate}%` }} />
            </div>
            <div className="mt-5">
              <VoteButtons selected={agenda.user_vote} disabled={voting} onVote={handleVote} />
            </div>
          </section>

          <StatusTimeline status={agenda.status} timeline={agenda.timeline} />
        </main>

        <aside className="sticky top-[4.5rem] h-fit rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-base font-bold text-slate-900">안건 정보</h2>
          <InfoRow label="카테고리" value={agenda.category} />
          <InfoRow label="등록 학과" value={agenda.department} />
          <InfoRow label="등록일" value={formatDate(agenda.created_at)} />
          <InfoRow label="총 투표 수" value={`${totalVotes}`} />
          <InfoRow label="공감률" value={`${agreeRate}%`} accent />
        </aside>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}

function TextSection({ title, content }: { title: string; content: string }) {
  return (
    <section className="border-l-4 border-indigo-100 pl-4">
      <h2 className="mb-3 text-sm font-bold text-slate-700">{title}</h2>
      <p className="text-sm leading-7 text-slate-600 whitespace-pre-wrap">{content}</p>
    </section>
  );
}

function Metric({ label, value, accent = false }: { label: string; value: number | string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-center">
      <div className="text-xs font-medium text-slate-500">{label}</div>
      <div className={`mt-1.5 text-2xl font-bold ${accent ? 'text-indigo-600' : 'text-slate-900'}`}>{value}</div>
    </div>
  );
}

function InfoRow({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-3 last:border-b-0">
      <span className="text-xs text-slate-500">{label}</span>
      <strong className={`text-sm font-semibold ${accent ? 'text-indigo-600' : 'text-slate-900'}`}>{value}</strong>
    </div>
  );
}
