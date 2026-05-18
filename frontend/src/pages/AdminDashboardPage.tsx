// 관리자 대시보드 데이터를 조회하고 표시하는 페이지
import { useEffect, useMemo, useState } from 'react';
import AdminGNB from '../components/admin/AdminGNB';
import { CategoryBadge, StatusBadge } from '../components/common/Badge';
import { INQUIRY_STATUS_COLORS } from '../constants';
import api from '../lib/api';
import type {
  AdminChartRow,
  AdminDashboardData,
  AdminMetrics,
  AdminPendingInquiry,
  AdminPopularAgenda,
  ApiResponse,
  InquiryStatus,
} from '../types';

function formatDate(value: string) {
  return new Date(value.replace(' ', 'T')).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

function InquiryStatusBadge({ status }: { status: InquiryStatus }) {
  const color = INQUIRY_STATUS_COLORS[status] ?? { bg: 'bg-gray-100', text: 'text-gray-500' };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${color.bg} ${color.text}`}>
      {status}
    </span>
  );
}

function MetricCard({
  label,
  value,
  description,
  tone = 'default',
}: {
  label: string;
  value: number;
  description: string;
  tone?: 'default' | 'warning' | 'success';
}) {
  const toneClass = {
    default: 'border-gray-200',
    warning: 'border-orange-300 bg-orange-50',
    success: 'border-green-300 bg-green-50',
  }[tone];

  return (
    <div className={`rounded-lg border ${toneClass} p-4`}>
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className="mt-2 text-3xl font-bold text-gray-950">{value.toLocaleString()}</p>
      <p className="mt-1 text-xs text-gray-500">{description}</p>
    </div>
  );
}

function PendingInquiryItem({ inquiry }: { inquiry: AdminPendingInquiry }) {
  return (
    <li className="border-b border-gray-100 last:border-0 py-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-gray-950">{inquiry.title}</p>
          <p className="mt-1 text-sm text-gray-500">
            {inquiry.category} · 익명 · {inquiry.department}
          </p>
        </div>
        <InquiryStatusBadge status={inquiry.status} />
      </div>
      <p className="mt-2 text-xs text-gray-400">{formatDate(inquiry.created_at)}</p>
    </li>
  );
}

function PopularAgendaItem({ agenda }: { agenda: AdminPopularAgenda }) {
  return (
    <li className="border-b border-gray-100 last:border-0 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-gray-950 truncate">{agenda.title}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <CategoryBadge category={agenda.category} />
            <StatusBadge status={agenda.status} />
          </div>
        </div>
        <p className="text-lg font-bold text-blue-600">{agenda.agreement_rate}%</p>
      </div>
      <div className="mt-3 h-2 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full rounded-full bg-blue-600" style={{ width: `${agenda.agreement_rate}%` }} />
      </div>
      <p className="mt-2 text-xs text-gray-400">
        찬성 {agenda.agree_count.toLocaleString()} · 반대 {agenda.disagree_count.toLocaleString()}
      </p>
    </li>
  );
}

function ChartBlock({ title, rows }: { title: string; rows: AdminChartRow[] }) {
  const maxValue = useMemo(() => Math.max(0, ...rows.map((row) => row.value)), [rows]);

  return (
    <section>
      <h3 className="text-sm font-bold text-gray-900 mb-3">{title}</h3>
      <div className="space-y-2">
        {rows.map((row) => {
          const width = maxValue === 0 ? 0 : Math.round((row.value / maxValue) * 100);

          return (
            <div key={row.label} className="grid grid-cols-[88px_1fr_32px] items-center gap-2 text-sm">
              <span className="text-gray-600 truncate">{row.label}</span>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full bg-blue-500" style={{ width: `${width}%` }} />
              </div>
              <span className="text-right font-medium text-gray-800">{row.value}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function MetricsGrid({ metrics }: { metrics: AdminMetrics }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <MetricCard
        label="전체 안건"
        value={metrics.total_agendas}
        description={`이번 주 신규 ${metrics.weekly_new_agendas.toLocaleString()}건`}
      />
      <MetricCard
        label="답변 대기 문의"
        value={metrics.pending_inquiries}
        description={metrics.pending_inquiries === 0 ? '대기 문의 없음' : '빠른 답변 필요'}
        tone={metrics.pending_inquiries === 0 ? 'success' : 'warning'}
      />
      <MetricCard label="검토 중 안건" value={metrics.reviewing_agendas} description="현재 처리 중" />
      <MetricCard label="반영 완료" value={metrics.completed_agendas} description="누적 완료" />
    </div>
  );
}

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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
    <div className="min-h-screen bg-gray-50">
      <AdminGNB />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-950">관리자 대시보드</h1>
          <p className="mt-2 text-sm text-gray-500">답변 대기 문의와 주요 안건 현황을 확인합니다.</p>
        </div>

        {isLoading && <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">불러오는 중입니다.</div>}
        {error && !isLoading && <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center text-red-600">{error}</div>}

        {dashboard && !isLoading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <section className="lg:col-span-7 rounded-lg border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between gap-3 mb-2">
                <h2 className="text-lg font-bold text-gray-950">답변 필요한 문의</h2>
                <a href="/admin/inquiries?status=답변 대기" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                  전체 보기
                </a>
              </div>
              {dashboard.pending_inquiries.length === 0 ? (
                <p className="py-12 text-center text-gray-500">답변 대기 문의가 없습니다.</p>
              ) : (
                <ul>
                  {dashboard.pending_inquiries.map((inquiry) => (
                    <PendingInquiryItem key={inquiry.id} inquiry={inquiry} />
                  ))}
                </ul>
              )}
            </section>

            <aside className="lg:col-span-5 space-y-6">
              <MetricsGrid metrics={dashboard.metrics} />

              <section className="rounded-lg border border-gray-200 bg-white p-6">
                <h2 className="text-lg font-bold text-gray-950 mb-2">통계</h2>
                <div className="space-y-6">
                  <ChartBlock title="카테고리별 안건 수" rows={dashboard.charts.agenda_categories} />
                  <ChartBlock title="처리 상태별 분포" rows={dashboard.charts.agenda_statuses} />
                  <ChartBlock title="문의 유형별 현황" rows={dashboard.charts.inquiry_categories} />
                </div>
              </section>
            </aside>

            <section className="lg:col-span-12 rounded-lg border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between gap-3 mb-2">
                <h2 className="text-lg font-bold text-gray-950">공감도 높은 안건</h2>
                <a href="/admin/agendas" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                  전체 보기
                </a>
              </div>
              {dashboard.popular_agendas.length === 0 ? (
                <p className="py-12 text-center text-gray-500">등록된 안건이 없습니다.</p>
              ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                  {dashboard.popular_agendas.map((agenda) => (
                    <PopularAgendaItem key={agenda.id} agenda={agenda} />
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
