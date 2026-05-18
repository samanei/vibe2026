import { AGENDA_STATUS_COLORS } from '../../constants';
import type { AgendaStatus, AgendaCategory } from '../../types';

interface StatusBadgeProps {
  status: AgendaStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const color = AGENDA_STATUS_COLORS[status] ?? { bg: 'bg-gray-100', text: 'text-gray-500' };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${color.bg} ${color.text}`}>
      {status}
    </span>
  );
}

interface CategoryBadgeProps {
  category: AgendaCategory | string;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
      {category}
    </span>
  );
}

export function HotBadge() {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-600">
      🔥 HOT
    </span>
  );
}
