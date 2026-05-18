// 관리자 문의 목록을 확인하고 학생에게 답변을 등록하는 페이지
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AdminGNB from '../components/admin/AdminGNB';
import Toast from '../components/common/Toast';
import { INQUIRY_STATUS_COLORS } from '../constants';
import api from '../lib/api';
import type { AdminInquiry, AdminInquiryListResponse, AdminInquiryStatusCount, InquiryStatus } from '../types';

const REPLY_STATUS_OPTIONS: InquiryStatus[] = ['검토 중', '답변 완료'];
const FILTER_OPTIONS: Array<InquiryStatus | '전체'> = ['전체', '답변 대기', '검토 중', '답변 완료'];

const DEFAULT_COUNTS: AdminInquiryStatusCount[] = [
  { status: '전체', label: '전체', value: 0 },
  { status: '답변 대기', label: '답변 대기', value: 0 },
  { status: '검토 중', label: '검토 중', value: 0 },
  { status: '답변 완료', label: '답변 완료', value: 0 },
];

function isFilterStatus(value: string | null): value is InquiryStatus | '전체' {
  return FILTER_OPTIONS.includes(value as InquiryStatus | '전체');
}

function formatDate(value: string | null) {
  if (!value) return '-';

  return new Date(value.replace(' ', 'T')).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\. /g, '.').replace(/\.$/, '');
}

function getReplyStatus(status: InquiryStatus): InquiryStatus {
  return status === '검토 중' ? '검토 중' : '답변 완료';
}

function StatusBadge({ status }: { status: InquiryStatus }) {
  const color = INQUIRY_STATUS_COLORS[status];

  return (
    <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-extrabold ${color.bg} ${color.text}`}>
      {status}
    </span>
  );
}

function InquiryListItem({
  inquiry,
  isSelected,
  onSelect,
}: {
  inquiry: AdminInquiry;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-lg border bg-white p-5 text-left shadow-sm transition ${
        isSelected
          ? 'border-blue-200 border-l-4 border-l-blue-600 bg-blue-50'
          : 'border-[#dedbd4] hover:border-blue-200 hover:bg-blue-50/50'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <StatusBadge status={inquiry.status} />
        <span className="shrink-0 text-xs font-bold text-[#9a958b]">{formatDate(inquiry.created_at)}</span>
      </div>
      <div className="mt-4 flex min-w-0 items-center gap-2 text-xs font-bold text-[#8b867c]">
        <span className="rounded-md border border-[#dedbd4] bg-[#f4f2ed] px-2 py-1 text-[#6d6960]">{inquiry.category}</span>
        <span>익명</span>
      </div>
      <p className="mt-3 truncate text-base font-extrabold text-[#22201c]">{inquiry.title}</p>
      <p className="mt-2 truncate text-sm font-medium text-[#8a857b]">{inquiry.content}</p>
    </button>
  );
}

export default function AdminInquiryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = isFilterStatus(searchParams.get('status')) ? searchParams.get('status') as InquiryStatus | '전체' : '전체';
  const [activeStatus, setActiveStatus] = useState<InquiryStatus | '전체'>(initialStatus);
  const [statusCounts, setStatusCounts] = useState<AdminInquiryStatusCount[]>(DEFAULT_COUNTS);
  const [inquiries, setInquiries] = useState<AdminInquiry[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<InquiryStatus>('답변 완료');
  const [draftReply, setDraftReply] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const selectedInquiry = useMemo(
    () => inquiries.find((inquiry) => inquiry.id === selectedId) ?? null,
    [inquiries, selectedId]
  );

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (activeStatus !== '전체') params.set('status', activeStatus);
    return params.toString();
  }, [activeStatus]);

  const fetchInquiries = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await api.get<AdminInquiryListResponse>(`/admin/inquiries${queryParams ? `?${queryParams}` : ''}`);
      const nextInquiries = response.data.data;
      setInquiries(nextInquiries);
      setStatusCounts(response.data.status_counts);
      setSelectedId((currentId) => {
        if (nextInquiries.length === 0) return null;
        if (currentId && nextInquiries.some((inquiry) => inquiry.id === currentId)) return currentId;
        return nextInquiries[0].id;
      });
    } catch (err) {
      setInquiries([]);
      setSelectedId(null);
      setError(err instanceof Error ? err.message : '문의 목록을 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [queryParams]);

  useEffect(() => {
    if (!selectedInquiry) {
      setDraftReply('');
      setSelectedStatus('답변 완료');
      return;
    }

    setDraftReply(selectedInquiry.reply ?? '');
    setSelectedStatus(getReplyStatus(selectedInquiry.status));
  }, [selectedInquiry]);

  const handleFilterClick = (status: InquiryStatus | '전체') => {
    setActiveStatus(status);
    setSearchParams(status === '전체' ? {} : { status });
  };

  const handleSubmit = async () => {
    if (!selectedInquiry || !draftReply.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await api.patch(`/admin/inquiries/${selectedInquiry.id}/reply`, {
        reply: draftReply.trim(),
        status: selectedStatus,
      });
      setToast({ message: '답변이 등록되었습니다.', type: 'success' });
      await fetchInquiries();
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : '답변을 등록하지 못했습니다.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f6f2] text-[#1f1d1a]">
      <AdminGNB />
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#171613]">문의 관리</h1>

        <div className="mt-8 grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
          <section className="rounded-lg border border-[#dedbd4] bg-white shadow-sm">
            <div className="border-b border-[#e7e4de] p-5">
              <div className="flex flex-wrap gap-2">
                {statusCounts.map((count) => {
                  const isActive = activeStatus === count.status;

                  return (
                    <button
                      key={count.status}
                      type="button"
                      onClick={() => handleFilterClick(count.status)}
                      className={`h-9 rounded-full border px-4 text-sm font-semibold transition ${
                        isActive
                          ? 'border-[#191815] bg-[#191815] text-white'
                          : 'border-[#dedbd4] bg-white text-[#767168] hover:border-[#c8c3ba] hover:text-[#1f1d1a]'
                      }`}
                    >
                      {count.label} ({count.value})
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="max-h-[calc(100vh-260px)] min-h-[520px] space-y-3 overflow-y-auto p-5">
              {isLoading && (
                <p className="py-20 text-center text-sm font-medium text-[#8b867c]">문의를 불러오는 중입니다.</p>
              )}
              {!isLoading && error && (
                <p className="py-20 text-center text-sm font-medium text-red-600">{error}</p>
              )}
              {!isLoading && !error && inquiries.length === 0 && (
                <p className="py-20 text-center text-sm font-medium text-[#8b867c]">등록된 문의가 없습니다.</p>
              )}
              {!isLoading && !error && inquiries.map((inquiry) => (
                <InquiryListItem
                  key={inquiry.id}
                  inquiry={inquiry}
                  isSelected={selectedId === inquiry.id}
                  onSelect={() => setSelectedId(inquiry.id)}
                />
              ))}
            </div>
          </section>

          <section className="min-h-[654px] rounded-lg border border-[#dedbd4] bg-white shadow-sm">
            {!selectedInquiry ? (
              <div className="flex h-full min-h-[520px] items-center justify-center p-8 text-sm font-medium text-[#8b867c]">
                선택된 문의가 없습니다.
              </div>
            ) : (
              <div className="flex h-full min-h-[654px] flex-col">
                <div className="border-b border-[#e7e4de] p-7">
                  <div className="flex items-start justify-between gap-5">
                    <div className="min-w-0">
                      <h2 className="truncate text-2xl font-extrabold text-[#22201c]">{selectedInquiry.title}</h2>
                      <p className="mt-3 text-sm font-bold text-[#8b867c]">
                        {selectedInquiry.category} · 익명 · {formatDate(selectedInquiry.created_at)} 등록
                      </p>
                    </div>
                    <StatusBadge status={selectedInquiry.status} />
                  </div>
                </div>

                <div className="flex-1 space-y-7 p-7">
                  <div>
                    <h3 className="text-sm font-extrabold text-[#59544c]">문의 내용</h3>
                    <div className="mt-3 max-h-60 overflow-y-auto rounded-lg border border-[#e2ded7] bg-[#f4f2ed] p-5 text-sm font-medium leading-7 text-[#3d3933]">
                      {selectedInquiry.content}
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-[220px_minmax(0,1fr)]">
                    <label className="block">
                      <span className="text-sm font-extrabold text-[#59544c]">처리 상태</span>
                      <select
                        value={selectedStatus}
                        onChange={(event) => setSelectedStatus(event.target.value as InquiryStatus)}
                        className="mt-3 h-11 w-full rounded-lg border border-[#d8d5cf] bg-white px-4 text-sm font-bold text-[#2a2824] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      >
                        {REPLY_STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className="text-sm font-extrabold text-[#59544c]">답변</span>
                      <textarea
                        value={draftReply}
                        onChange={(event) => setDraftReply(event.target.value)}
                        className="mt-3 min-h-48 w-full resize-none rounded-lg border border-[#d8d5cf] bg-white p-4 text-sm font-medium leading-7 text-[#2a2824] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        placeholder="답변 내용을 입력하세요."
                      />
                    </label>
                  </div>
                </div>

                <div className="border-t border-[#e7e4de] p-7">
                  <p className="text-sm font-bold text-[#8b867c]">답변 내용은 해당 학생에게만 비공개로 전달됩니다.</p>
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                    <p className="text-xs font-bold text-[#aaa49a]">등록 후에도 수정할 수 있습니다.</p>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!draftReply.trim() || isSubmitting}
                      className="h-11 rounded-lg bg-blue-600 px-6 text-sm font-extrabold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-[#d8d5cf] disabled:text-[#8b867c]"
                    >
                      {isSubmitting ? '등록 중' : '답변 등록하기'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
