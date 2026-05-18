import { AGENDA_STATUS_COLORS } from '../../constants';
import type { AgendaStatus, AgendaCategory } from '../../types';

interface StatusBadgeProps {
  status: AgendaStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const color = AGENDA_STATUS_COLORS[status] ?? { bg: 'bg-gray-100', text: 'text-gray-500' };
  return (
    <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold ${color.bg} ${color.text}`}>
      {status}
    </span>
  );
}

interface CategoryBadgeProps {
  category: AgendaCategory | string;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <span className="inline-flex items-center rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-600">
      {category}
    </span>
  );
}

export function HotBadge() {
  return (
    <span className="inline-flex items-center rounded-md bg-rose-50 px-2.5 py-1 text-xs font-black text-rose-600 ring-1 ring-rose-100">
      🔥 HOT
    </span>
  );
}
