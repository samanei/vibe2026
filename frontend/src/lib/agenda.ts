import type { Agenda, AgendaStatus } from '../types';

export function getTotalVotes(agenda: Pick<Agenda, 'agree_count' | 'disagree_count'>) {
  return agenda.agree_count + agenda.disagree_count;
}

export function getAgreeRate(agenda: Pick<Agenda, 'agree_count' | 'disagree_count'>) {
  const total = getTotalVotes(agenda);
  if (total === 0) return 0;
  return Math.round((agenda.agree_count / total) * 100);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(new Date(value))
    .replace(/\. /g, '.')
    .replace(/\.$/, '');
}

export function getTimelineSteps(status: AgendaStatus) {
  if (status === '반영 어려움') {
    return ['접수됨', '검토 중', '학교 전달 완료', '반영 어려움'] as AgendaStatus[];
  }

  return ['접수됨', '검토 중', '학교 전달 완료', '반영 완료'] as AgendaStatus[];
}
