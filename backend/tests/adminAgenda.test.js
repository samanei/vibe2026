// 관리자 안건 관리 데이터 헬퍼를 검증하는 테스트
const assert = require('node:assert/strict');
const test = require('node:test');

const {
  ADMIN_AGENDA_STATUSES,
  buildStatusCounts,
  calculateAgreementRate,
  normalizeAdminAgenda,
} = require('../lib/adminAgenda');

test('ADMIN_AGENDA_STATUSES matches the admin agenda status options', () => {
  assert.deepEqual(ADMIN_AGENDA_STATUSES, ['접수됨', '검토 중', '학교 전달 완료', '반영 완료', '반영 어려움']);
});

test('normalizeAdminAgenda returns table fields with agreement rate', () => {
  assert.deepEqual(
    normalizeAdminAgenda({
      id: 10,
      title: '도서관 콘센트 부족 문제 개선 요청',
      category: '시설',
      department: '컴퓨터공학과',
      status: '검토 중',
      agree_count: 128,
      disagree_count: 12,
      created_at: '2026-05-18 12:00:00',
    }),
    {
      id: 10,
      title: '도서관 콘센트 부족 문제 개선 요청',
      category: '시설',
      department: '컴퓨터공학과',
      status: '검토 중',
      agree_count: 128,
      disagree_count: 12,
      agreement_rate: 91,
      created_at: '2026-05-18 12:00:00',
    }
  );
});

test('calculateAgreementRate returns 0 for zero participation', () => {
  assert.equal(calculateAgreementRate(0, 0), 0);
});

test('buildStatusCounts includes total and every status with zero defaults', () => {
  const counts = buildStatusCounts([
    { status: '접수됨', value: '24' },
    { status: '검토 중', value: 9 },
  ]);

  assert.deepEqual(counts, [
    { status: '전체', label: '전체', value: 33 },
    { status: '접수됨', label: '접수됨', value: 24 },
    { status: '검토 중', label: '검토 중', value: 9 },
    { status: '학교 전달 완료', label: '전달 완료', value: 0 },
    { status: '반영 완료', label: '반영 완료', value: 0 },
    { status: '반영 어려움', label: '반영 어려움', value: 0 },
  ]);
});
