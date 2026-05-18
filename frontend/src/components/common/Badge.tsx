import { AGENDA_STATUS_COLORS } from '../../constants';
import type { AgendaStatus, AgendaCategory } from '../../types';

interface StatusBadgeProps {
  status: AgendaStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const color = AGENDA_STATUS_COLORS[status] ?? { bg: 'bg-gray-100', text: 'text-gray-500' };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${color.bg} ${color.text}`}>
      {status}
    </span>
  );
}

interface CategoryBadgeProps {
  category: AgendaCategory | string;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
      {category}
    </span>
  );
}

export function HotBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-bold text-orange-600 ring-1 ring-orange-200">
      🔥 HOT
    </span>
  );
}
