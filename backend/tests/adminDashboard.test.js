// 관리자 대시보드 데이터 헬퍼를 검증하는 테스트
const assert = require('node:assert/strict');
const test = require('node:test');

const {
  AGENDA_CATEGORIES,
  AGENDA_STATUSES,
  INQUIRY_CATEGORIES,
  calculateAgreementRate,
  mergeChartRows,
  normalizeMetrics,
  normalizePendingInquiry,
  normalizePopularAgenda,
  buildDashboardData,
} = require('../lib/adminDashboard');

test('calculateAgreementRate returns 0 when there are no votes', () => {
  assert.equal(calculateAgreementRate(0, 0), 0);
});

test('calculateAgreementRate rounds agree ratio to nearest integer', () => {
  assert.equal(calculateAgreementRate(7, 3), 70);
  assert.equal(calculateAgreementRate(2, 3), 40);
});

test('mergeChartRows includes every known label with zero defaults', () => {
  const rows = [
    { label: '시설', value: 3 },
    { label: '복지', value: 1 },
  ];

  const chartRows = mergeChartRows(AGENDA_CATEGORIES, rows);

  assert.deepEqual(chartRows.slice(0, 3), [
    { label: '시설', value: 3 },
    { label: '수업', value: 0 },
    { label: '행정', value: 0 },
  ]);
  assert.equal(chartRows.find((row) => row.label === '복지').value, 1);
});

test('known chart label lists match the admin specification', () => {
  assert.deepEqual(AGENDA_STATUSES, ['접수됨', '검토 중', '학교 전달 완료', '반영 완료', '반영 어려움']);
  assert.deepEqual(INQUIRY_CATEGORIES, ['장학금', '학비', '휴학', '복학', '행사', '부스 신청', '학생회 운영', '제보', '기타']);
});

test('normalizeMetrics converts null aggregate values to zero numbers', () => {
  assert.deepEqual(
    normalizeMetrics({
      total_agendas: '4',
      weekly_new_agendas: null,
      pending_inquiries: undefined,
      reviewing_agendas: 2,
      completed_agendas: '1',
    }),
    {
      total_agendas: 4,
      weekly_new_agendas: 0,
      pending_inquiries: 0,
      reviewing_agendas: 2,
      completed_agendas: 1,
    }
  );
});

test('normalizePendingInquiry returns the fields used by the admin dashboard', () => {
  assert.deepEqual(
    normalizePendingInquiry({
      id: 3,
      title: '장학금 문의',
      category: '장학금',
      department: '컴퓨터공학과',
      status: '답변 대기',
      created_at: '2026-05-18 10:30:00',
    }),
    {
      id: 3,
      title: '장학금 문의',
      category: '장학금',
      department: '컴퓨터공학과',
      status: '답변 대기',
      created_at: '2026-05-18 10:30:00',
    }
  );
});

test('normalizePopularAgenda adds agreement rate to agenda rows', () => {
  assert.deepEqual(
    normalizePopularAgenda({
      id: 7,
      title: '도서관 좌석 개선',
      category: '시설',
      department: '익명',
      status: '검토 중',
      agree_count: 9,
      disagree_count: 1,
      created_at: '2026-05-18 09:00:00',
    }),
    {
      id: 7,
      title: '도서관 좌석 개선',
      category: '시설',
      department: '익명',
      status: '검토 중',
      agree_count: 9,
      disagree_count: 1,
      agreement_rate: 90,
      created_at: '2026-05-18 09:00:00',
    }
  );
});

test('buildDashboardData returns normalized dashboard data from database rows', async () => {
  const responses = [
    [
      [
        {
          total_agendas: '2',
          weekly_new_agendas: '1',
          pending_inquiries: '1',
          reviewing_agendas: '1',
          completed_agendas: '0',
        },
      ],
    ],
    [
      [
        {
          id: 1,
          title: '장학금 지급 일정',
          category: '장학금',
          department: '익명',
          status: '답변 대기',
          created_at: '2026-05-17 09:00:00',
        },
      ],
    ],
    [
      [
        {
          id: 2,
          title: '학생식당 운영 시간 연장',
          category: '복지',
          department: '경영학과',
          status: '검토 중',
          agree_count: 8,
          disagree_count: 2,
          created_at: '2026-05-16 12:00:00',
        },
      ],
    ],
    [[{ label: '복지', value: '1' }]],
    [[{ label: '검토 중', value: '1' }]],
    [[{ label: '장학금', value: '1' }]],
  ];
  const db = {
    query: async () => responses.shift(),
  };

  const dashboard = await buildDashboardData(db);

  assert.deepEqual(dashboard.metrics, {
    total_agendas: 2,
    weekly_new_agendas: 1,
    pending_inquiries: 1,
    reviewing_agendas: 1,
    completed_agendas: 0,
  });
  assert.deepEqual(dashboard.pending_inquiries, [
    {
      id: 1,
      title: '장학금 지급 일정',
      category: '장학금',
      department: '익명',
      status: '답변 대기',
      created_at: '2026-05-17 09:00:00',
    },
  ]);
  assert.deepEqual(dashboard.popular_agendas, [
    {
      id: 2,
      title: '학생식당 운영 시간 연장',
      category: '복지',
      department: '경영학과',
      status: '검토 중',
      agree_count: 8,
      disagree_count: 2,
      agreement_rate: 80,
      created_at: '2026-05-16 12:00:00',
    },
  ]);
  assert.equal(dashboard.charts.agenda_categories.find((row) => row.label === '복지').value, 1);
  assert.equal(dashboard.charts.agenda_statuses.find((row) => row.label === '검토 중').value, 1);
  assert.equal(dashboard.charts.inquiry_categories.find((row) => row.label === '장학금').value, 1);
  assert.equal(responses.length, 0);
});
