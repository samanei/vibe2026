// 관리자 안건 관리 응답 데이터를 정규화하는 헬퍼
const ADMIN_AGENDA_STATUSES = ['접수됨', '검토 중', '학교 전달 완료', '반영 완료', '반영 어려움'];

const STATUS_LABELS = {
  전체: '전체',
  접수됨: '접수됨',
  '검토 중': '검토 중',
  '학교 전달 완료': '전달 완료',
  '반영 완료': '반영 완료',
  '반영 어려움': '반영 어려움',
};

function toNumber(value) {
  if (value === null || value === undefined) return 0;
  return Number(value) || 0;
}

function calculateAgreementRate(agreeCount, disagreeCount) {
  const agree = toNumber(agreeCount);
  const disagree = toNumber(disagreeCount);
  const total = agree + disagree;

  if (total === 0) return 0;
  return Math.round((agree / total) * 100);
}

function normalizeAdminAgenda(row) {
  const agreeCount = toNumber(row.agree_count);
  const disagreeCount = toNumber(row.disagree_count);

  return {
    id: row.id,
    title: row.title,
    category: row.category,
    department: row.department,
    status: row.status,
    agree_count: agreeCount,
    disagree_count: disagreeCount,
    agreement_rate: calculateAgreementRate(agreeCount, disagreeCount),
    created_at: row.created_at,
  };
}

function buildStatusCounts(rows) {
  const countMap = new Map(rows.map((row) => [row.status, toNumber(row.value)]));
  const statusCounts = ADMIN_AGENDA_STATUSES.map((status) => ({
    status,
    label: STATUS_LABELS[status],
    value: countMap.get(status) ?? 0,
  }));
  const total = statusCounts.reduce((sum, row) => sum + row.value, 0);

  return [{ status: '전체', label: STATUS_LABELS['전체'], value: total }, ...statusCounts];
}

module.exports = {
  ADMIN_AGENDA_STATUSES,
  buildStatusCounts,
  calculateAgreementRate,
  normalizeAdminAgenda,
};
