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

export interface AgendaDetail extends Agenda {
  timeline: AgendaTimeline[];
  user_vote: VoteType | null;
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

export type InquiryStatus = '답변 대기' | '검토 중' | '답변 완료';

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

export interface AdminMetrics {
  total_agendas: number;
  weekly_new_agendas: number;
  pending_inquiries: number;
  reviewing_agendas: number;
  completed_agendas: number;
}

export interface AdminPendingInquiry {
  id: number;
  title: string;
  category: string;
  department: string;
  status: InquiryStatus;
  created_at: string;
}

export interface AdminPopularAgenda {
  id: number;
  title: string;
  category: AgendaCategory | string;
  department: string;
  status: AgendaStatus;
  agree_count: number;
  disagree_count: number;
  agreement_rate: number;
  created_at: string;
}

export interface AdminChartRow {
  label: string;
  value: number;
}

export interface AdminDashboardData {
  metrics: AdminMetrics;
  pending_inquiries: AdminPendingInquiry[];
  popular_agendas: AdminPopularAgenda[];
  charts: {
    agenda_categories: AdminChartRow[];
    agenda_statuses: AdminChartRow[];
    inquiry_categories: AdminChartRow[];
  };
}

export interface AdminAgenda {
  id: number;
  title: string;
  category: AgendaCategory | string;
  department: string;
  status: AgendaStatus;
  agree_count: number;
  disagree_count: number;
  agreement_rate: number;
  created_at: string;
}

export interface AdminAgendaStatusCount {
  status: AgendaStatus | '전체';
  label: string;
  value: number;
}

export interface AdminAgendaListResponse {
  data: AdminAgenda[];
  status_counts: AdminAgendaStatusCount[];
}

export interface AgendaListResponse extends PaginatedResponse<Agenda> {
  category_counts: Record<string, number>;
}

export interface WeeklyAgendaStats {
  new_count: number;
  done_count: number;
  reviewing_count: number;
  total_votes: number;
}
