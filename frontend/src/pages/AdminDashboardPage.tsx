// 관리자 대시보드 데이터를 조회하고 표시하는 페이지
import { useEffect, useMemo, useState } from 'react';
import AdminGNB from '../components/admin/AdminGNB';
import api from '../lib/api';
import type {
  AdminChartRow,
  AdminDashboardData,
  AdminMetrics,
  AdminPendingInquiry,
  AdminPopularAgenda,
  ApiResponse,
} from '../types';

const EMPTY_DASHBOARD: AdminDashboardData = {
  metrics: {
    total_agendas: 0,
    weekly_new_agendas: 0,
    pending_inquiries: 0,
    reviewing_agendas: 0,
    completed_agendas: 0,
  },
  pending_inquiries: [],
  popular_agendas: [],
  charts: {
    agenda_categories: [
      { label: '시설', value: 0 },
      { label: '수업', value: 0 },
      { label: '행정', value: 0 },
      { label: '복지', value: 0 },
      { label: '학식', value: 0 },
      { label: '행사', value: 0 },
    ],
    agenda_statuses: [
      { label: '접수됨', value: 0 },
      { label: '검토 중', value: 0 },
      { label: '학교 전달 완료', value: 0 },
      { label: '반영 완료', value: 0 },
    ],
    inquiry_categories: [
      { label: '장학금', value: 0 },
      { label: '휴학', value: 0 },
      { label: '행사', value: 0 },
      { label: '학생회', value: 0 },
      { label: '기타', value: 0 },
    ],
  },
};

function formatDate(value: string) {
  return new Date(value.replace(' ', 'T')).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\. /g, '.').replace(/\.$/, '');
}

function StatusPill({ status }: { status: string }) {
  const statusClass: Record<string, string> = {
    '답변 대기': 'bg-orange-50 text-orange-700',
    접수됨: 'bg-blue-50 text-blue-700',
    '검토 중': 'bg-orange-50 text-orange-700',
    '학교 전달 완료': 'bg-purple-50 text-purple-700',
    '반영 완료': 'bg-green-50 text-green-700',
    '반영 어려움': 'bg-gray-100 text-gray-600',
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

function MetricCard({
  label,
  value,
  description,
  tone = 'blue',
}: {
  label: string;
  value: number;
  description: string;
  tone?: 'blue' | 'orange' | 'green';
}) {
  const numberColor = {
    blue: 'text-blue-600',
    orange: 'text-orange-600',
    green: 'text-green-600',
  }[tone];

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className={`mt-4 text-4xl font-bold leading-none ${numberColor}`}>{value.toLocaleString()}</p>
      <p className="mt-3 text-xs text-slate-400">{description}</p>
    </div>
  );
}

function PendingInquiryItem({ inquiry }: { inquiry: AdminPendingInquiry }) {
  return (
    <li className="border-b border-slate-100 last:border-0 py-4">
      <div className="flex items-start gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{inquiry.title}</p>
          <p className="mt-1 text-xs text-slate-500">{inquiry.category} · {inquiry.department} · 익명</p>
        </div>
        <span className="ml-auto shrink-0 text-xs text-slate-500">{formatDate(inquiry.created_at)}</span>
      </div>
      <div className="mt-2">
        <StatusPill status={inquiry.status} />
      </div>
    </li>
  );
}

function PopularAgendaItem({ agenda }: { agenda: AdminPopularAgenda }) {
  return (
    <li className="grid grid-cols-[1fr_140px_54px_88px] items-center gap-4 border-b border-slate-100 py-4 last:border-0">
      <p className="truncate text-sm font-semibold text-slate-900">{agenda.title}</p>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-indigo-600" style={{ width: `${agenda.agreement_rate}%` }} />
      </div>
      <p className="text-right text-sm font-bold text-indigo-600">{agenda.agreement_rate}%</p>
      <StatusPill status={agenda.status} />
    </li>
  );
}

function ChartBlock({ title, rows, color = 'blue' }: { title: string; rows: AdminChartRow[]; color?: 'blue' | 'status' }) {
  const maxValue = useMemo(() => Math.max(0, ...rows.map((row) => row.value)), [rows]);
  const statusColors: Record<string, string> = {
    접수됨: 'bg-gray-600',
    '검토 중': 'bg-orange-500',
    '학교 전달 완료': 'bg-purple-600',
    '반영 완료': 'bg-green-600',
    '반영 어려움': 'bg-gray-400',
  };

  return (
    <section className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
      <h3 className="text-base font-bold text-slate-900 mb-5">{title}</h3>
      <div className="space-y-4">
        {rows.map((row) => {
          const width = maxValue === 0 ? 0 : Math.round((row.value / maxValue) * 100);
          const barColor = color === 'status' ? statusColors[row.label] ?? 'bg-indigo-600' : 'bg-indigo-600';

          return (
            <div key={row.label} className="grid grid-cols-[72px_1fr_36px] items-center gap-3 text-sm">
              <span className="truncate text-right font-medium text-slate-500">{row.label}</span>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full rounded-full ${barColor}`} style={{ width: `${width}%` }} />
              </div>
              <span className="text-right font-semibold text-slate-500">{row.value}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function MetricsGrid({ metrics }: { metrics: AdminMetrics }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        label="전체 안건"
        value={metrics.total_agendas}
        description={`이번 주 신규 ${metrics.weekly_new_agendas.toLocaleString()}건`}
        tone="blue"
      />
      <MetricCard
        label="답변 대기 문의"
        value={metrics.pending_inquiries}
        description={metrics.pending_inquiries === 0 ? '대기 문의 없음' : '미처리 · 빠른 답변 필요'}
        tone="orange"
      />
      <MetricCard label="검토 중 안건" value={metrics.reviewing_agendas} description="진행 중" tone="blue" />
      <MetricCard label="반영 완료" value={metrics.completed_agendas} description="누적 처리 완료" tone="green" />
    </div>
  );
}

function CardHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <h2 className="text-base font-bold text-slate-900">{title}</h2>
      <a href={href} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
        전체 보기 →
      </a>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const displayDashboard = dashboard ?? (error ? EMPTY_DASHBOARD : null);

  useEffect(() => {
    let ignore = false;

    async function fetchDashboard() {
      try {
        const response = await api.get<ApiResponse<AdminDashboardData>>('/admin/dashboard');
        if (!ignore) setDashboard(response.data.data);
      } catch (err) {
        if (!ignore) setError(err instanceof Error ? err.message : '대시보드 정보를 불러오지 못했습니다.');
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    fetchDashboard();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminGNB />
      <main className="max-w-7xl mx-auto px-6 py-10 lg:px-10 lg:py-12">
        <h1 className="text-2xl font-bold text-slate-900">대시보드</h1>

        {isLoading && <div className="mt-9 rounded-xl border border-slate-100 bg-white p-12 text-center text-sm text-slate-400">대시보드를 불러오는 중입니다.</div>}
        {error && !isLoading && (
          <div className="mt-9 rounded-xl border border-red-100 bg-red-50 px-5 py-3 text-center text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {displayDashboard && !isLoading && (
          <div className="mt-9 space-y-8">
            <MetricsGrid metrics={displayDashboard.metrics} />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <section className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                <CardHeader title="🔥 공감도 높은 안건" href="/admin/agendas" />
                {displayDashboard.popular_agendas.length === 0 ? (
                  <p className="py-16 text-center text-sm text-slate-400">등록된 안건이 없습니다.</p>
                ) : (
                  <ul>
                    {displayDashboard.popular_agendas.slice(0, 4).map((agenda) => (
                      <PopularAgendaItem key={agenda.id} agenda={agenda} />
                    ))}
                  </ul>
                )}
              </section>

              <section className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                <CardHeader title="⏰ 답변 필요한 문의" href="/admin/inquiries?status=답변 대기" />
                {displayDashboard.pending_inquiries.length === 0 ? (
                  <p className="py-16 text-center text-sm text-slate-400">답변 대기 문의가 없습니다.</p>
                ) : (
                  <ul>
                    {displayDashboard.pending_inquiries.slice(0, 3).map((inquiry) => (
                      <PendingInquiryItem key={inquiry.id} inquiry={inquiry} />
                    ))}
                  </ul>
                )}
              </section>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <ChartBlock title="카테고리별 안건" rows={displayDashboard.charts.agenda_categories} />
              <ChartBlock title="처리 상태 현황" rows={displayDashboard.charts.agenda_statuses} color="status" />
              <ChartBlock title="문의 유형별 현황" rows={displayDashboard.charts.inquiry_categories} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
