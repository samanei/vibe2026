// 관리자 문의 관리 데이터 헬퍼를 검증하는 테스트
const assert = require('node:assert/strict');
const test = require('node:test');

const {
  ADMIN_INQUIRY_STATUSES,
  REPLY_STATUS_OPTIONS,
  buildInquiryStatusCounts,
  isReplyStatus,
  normalizeAdminInquiry,
} = require('../lib/adminInquiry');

test('ADMIN_INQUIRY_STATUSES matches inquiry status tabs', () => {
  assert.deepEqual(ADMIN_INQUIRY_STATUSES, ['답변 대기', '검토 중', '답변 완료']);
});

test('REPLY_STATUS_OPTIONS only includes statuses allowed while replying', () => {
  assert.deepEqual(REPLY_STATUS_OPTIONS, ['검토 중', '답변 완료']);
  assert.equal(isReplyStatus('검토 중'), true);
  assert.equal(isReplyStatus('답변 완료'), true);
  assert.equal(isReplyStatus('답변 대기'), false);
});

test('normalizeAdminInquiry returns detail fields for the admin split view', () => {
  assert.deepEqual(
    normalizeAdminInquiry({
      id: 7,
      category: '장학금',
      title: '학생회 예산 사용 내역 공개 요청',
      content: '예산 사용 내역을 확인하고 싶습니다.',
      department: '',
      status: '답변 대기',
      reply: null,
      created_at: '2026-05-18 10:00:00',
      replied_at: null,
    }),
    {
      id: 7,
      category: '장학금',
      title: '학생회 예산 사용 내역 공개 요청',
      content: '예산 사용 내역을 확인하고 싶습니다.',
      department: '익명',
      status: '답변 대기',
      reply: null,
      created_at: '2026-05-18 10:00:00',
      replied_at: null,
    }
  );
});

test('buildInquiryStatusCounts includes total and every status with zero defaults', () => {
  const counts = buildInquiryStatusCounts([
    { status: '답변 대기', value: '4' },
    { status: '답변 완료', value: 2 },
  ]);

  assert.deepEqual(counts, [
    { status: '전체', label: '전체', value: 6 },
    { status: '답변 대기', label: '답변 대기', value: 4 },
    { status: '검토 중', label: '검토 중', value: 0 },
    { status: '답변 완료', label: '답변 완료', value: 2 },
  ]);
});
