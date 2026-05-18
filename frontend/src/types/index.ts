export type AgendaStatus =
  | '접수됨'
  | '검토 중'
  | '학교 전달 완료'
  | '반영 완료'
  | '반영 어려움';

export type AgendaCategory =
  | '시설'
  | '수업'
  | '행정'
  | '복지'
  | '학식'
  | '행사'
  | '학생회'
  | '기타';

export type VoteType = 'agree' | 'disagree';

export interface Agenda {
  id: number;
  category: AgendaCategory;
  title: string;
  problem_description: string;
  improvement_request: string;
  status: AgendaStatus;
  department: string;
  agree_count: number;
  disagree_count: number;
  created_at: string;
}

export interface AgendaTimeline {
  id: number;
  agenda_id: number;
  status: AgendaStatus;
  comment: string | null;
  created_at: string;
}

export interface Vote {
  agenda_id: number;
  vote_type: VoteType;
}

export type InquiryStatus = '답변 대기' | '답변 완료';

export interface Inquiry {
  id: number;
  category: string;
  title: string;
  content: string;
  department: string;
  status: InquiryStatus;
  reply: string | null;
  created_at: string;
  replied_at: string | null;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
