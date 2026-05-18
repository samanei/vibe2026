// 관리자 문의 관리 응답 데이터를 정규화하는 헬퍼
const ADMIN_INQUIRY_STATUSES = ['답변 대기', '검토 중', '답변 완료'];
const REPLY_STATUS_OPTIONS = ['검토 중', '답변 완료'];

const STATUS_LABELS = {
  전체: '전체',
  '답변 대기': '답변 대기',
  '검토 중': '검토 중',
  '답변 완료': '답변 완료',
};

function toNumber(value) {
  if (value === null || value === undefined) return 0;
  return Number(value) || 0;
}

function normalizeAdminInquiry(row) {
  return {
    id: row.id,
    category: row.category,
    title: row.title,
    content: row.content,
    department: row.department || '익명',
    status: row.status,
    reply: row.reply ?? null,
    created_at: row.created_at,
    replied_at: row.replied_at ?? null,
  };
}

function buildInquiryStatusCounts(rows) {
  const countMap = new Map(rows.map((row) => [row.status, toNumber(row.value)]));
  const statusCounts = ADMIN_INQUIRY_STATUSES.map((status) => ({
    status,
    label: STATUS_LABELS[status],
    value: countMap.get(status) ?? 0,
  }));
  const total = statusCounts.reduce((sum, row) => sum + row.value, 0);

  return [{ status: '전체', label: STATUS_LABELS['전체'], value: total }, ...statusCounts];
}

function isInquiryStatus(status) {
  return ADMIN_INQUIRY_STATUSES.includes(status);
}

function isReplyStatus(status) {
  return REPLY_STATUS_OPTIONS.includes(status);
}

module.exports = {
  ADMIN_INQUIRY_STATUSES,
  REPLY_STATUS_OPTIONS,
  buildInquiryStatusCounts,
  isInquiryStatus,
  isReplyStatus,
  normalizeAdminInquiry,
};
