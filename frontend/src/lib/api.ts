import axios from 'axios';
import type {
  Agenda,
  AgendaCategory,
  AgendaDetail,
  AgendaListResponse,
  ApiResponse,
  VoteType,
  WeeklyAgendaStats,
} from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || '서버 오류가 발생했습니다.';
    return Promise.reject(new Error(message));
  }
);

export interface AgendaListParams {
  category?: string;
  sort?: 'popular' | 'latest' | 'rate';
  page?: number;
  limit?: number;
}

export interface CreateAgendaPayload {
  category: AgendaCategory;
  title: string;
  problem_description: string;
  improvement_request: string;
  department: string;
}

export async function getAgendas(params: AgendaListParams) {
  const { data } = await api.get<AgendaListResponse>('/agendas', { params });
  return data;
}

export async function getAgenda(id: number, userToken: string) {
  const { data } = await api.get<ApiResponse<AgendaDetail>>(`/agendas/${id}`, {
    params: { user_token: userToken },
  });
  return data.data;
}

export async function createAgenda(payload: CreateAgendaPayload) {
  const { data } = await api.post<ApiResponse<{ id: number }>>('/agendas', payload);
  return data;
}

export async function voteAgenda(id: number, voteType: VoteType, userToken: string) {
  const { data } = await api.post<ApiResponse<AgendaDetail>>(`/agendas/${id}/vote`, {
    vote_type: voteType,
    user_token: userToken,
  });
  return data;
}

export async function getWeeklyAgendaStats() {
  const { data } = await api.get<ApiResponse<WeeklyAgendaStats>>('/agendas/stats/weekly');
  return data.data;
}

export type { Agenda };
export default api;
