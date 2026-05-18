export const AGENDA_CATEGORIES = [
  '전체',
  '시설',
  '수업',
  '행정',
  '복지',
  '학식',
  '행사',
  '학생회',
  '기타',
] as const;

export const AGENDA_STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  '접수됨':        { bg: 'bg-blue-100',   text: 'text-blue-700' },
  '검토 중':       { bg: 'bg-orange-100', text: 'text-orange-700' },
  '학교 전달 완료': { bg: 'bg-purple-100', text: 'text-purple-700' },
  '반영 완료':     { bg: 'bg-green-100',  text: 'text-green-700' },
  '반영 어려움':   { bg: 'bg-gray-100',   text: 'text-gray-500' },
};

export const AGENDA_TIMELINE_STEPS = [
  '접수됨',
  '검토 중',
  '학교 전달 완료',
  '반영 완료',
] as const;

export const HOT_THRESHOLD = 10;

export const PAGE_SIZE = 10;
