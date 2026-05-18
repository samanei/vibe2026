// 관리자 대시보드 응답 데이터를 정규화하는 헬퍼
const AGENDA_CATEGORIES = ['시설', '수업', '행정', '복지', '학식', '행사', '학생회', '기타'];

const AGENDA_STATUSES = ['접수됨', '검토 중', '학교 전달 완료', '반영 완료', '반영 어려움'];

const INQUIRY_CATEGORIES = ['장학금', '학비', '휴학', '복학', '행사', '부스 신청', '학생회 운영', '제보', '기타'];

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

function mergeChartRows(labels, rows) {
  const valueMap = new Map(rows.map((row) => [row.label, toNumber(row.value)]));
  return labels.map((label) => ({
    label,
    value: valueMap.get(label) ?? 0,
  }));
}

function normalizeMetrics(row = {}) {
  return {
    total_agendas: toNumber(row.total_agendas),
    weekly_new_agendas: toNumber(row.weekly_new_agendas),
    pending_inquiries: toNumber(row.pending_inquiries),
    reviewing_agendas: toNumber(row.reviewing_agendas),
    completed_agendas: toNumber(row.completed_agendas),
  };
}

function normalizePendingInquiry(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    department: row.department,
    status: row.status,
    created_at: row.created_at,
  };
}

function normalizePopularAgenda(row) {
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

async function buildDashboardData(db) {
  const [
    [metricsRows],
    [pendingInquiryRows],
    [popularAgendaRows],
    [agendaCategoryRows],
    [agendaStatusRows],
    [inquiryCategoryRows],
  ] = await Promise.all([
    db.query(`
      SELECT
        COUNT(*) AS total_agendas,
        SUM(YEARWEEK(created_at, 1) = YEARWEEK(NOW(), 1)) AS weekly_new_agendas,
        (SELECT COUNT(*) FROM inquiries WHERE status = '답변 대기') AS pending_inquiries,
        SUM(status = '검토 중') AS reviewing_agendas,
        SUM(status = '반영 완료') AS completed_agendas
      FROM agendas
    `),
    db.query(`
      SELECT id, title, category, department, status, created_at
      FROM inquiries
      WHERE status = '답변 대기'
      ORDER BY created_at ASC
      LIMIT 5
    `),
    db.query(`
      SELECT id, title, category, department, status, agree_count, disagree_count, created_at
      FROM agendas
      ORDER BY
        COALESCE(agree_count / NULLIF(agree_count + disagree_count, 0), 0) DESC,
        agree_count DESC,
        created_at DESC
      LIMIT 5
    `),
    db.query(`
      SELECT category AS label, COUNT(*) AS value
      FROM agendas
      GROUP BY category
    `),
    db.query(`
      SELECT status AS label, COUNT(*) AS value
      FROM agendas
      GROUP BY status
    `),
    db.query(`
      SELECT category AS label, COUNT(*) AS value
      FROM inquiries
      GROUP BY category
    `),
  ]);

  return {
    metrics: normalizeMetrics(metricsRows[0]),
    pending_inquiries: pendingInquiryRows.map(normalizePendingInquiry),
    popular_agendas: popularAgendaRows.map(normalizePopularAgenda),
    charts: {
      agenda_categories: mergeChartRows(AGENDA_CATEGORIES, agendaCategoryRows),
      agenda_statuses: mergeChartRows(AGENDA_STATUSES, agendaStatusRows),
      inquiry_categories: mergeChartRows(INQUIRY_CATEGORIES, inquiryCategoryRows),
    },
  };
}

module.exports = {
  AGENDA_CATEGORIES,
  AGENDA_STATUSES,
  INQUIRY_CATEGORIES,
  buildDashboardData,
  calculateAgreementRate,
  mergeChartRows,
  normalizeMetrics,
  normalizePendingInquiry,
  normalizePopularAgenda,
};
