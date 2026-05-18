import { formatDate, getTimelineSteps } from '../../lib/agenda';
import type { AgendaStatus, AgendaTimeline } from '../../types';

interface StatusTimelineProps {
  status: AgendaStatus;
  timeline: AgendaTimeline[];
}

export default function StatusTimeline({ status, timeline }: StatusTimelineProps) {
  const steps = getTimelineSteps(status);
  const currentIndex = steps.indexOf(status);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <h2 className="mb-5 text-base font-black text-slate-950">처리 현황</h2>
      <ol className="space-y-5">
        {steps.map((step, index) => {
          const item = timeline.find((entry) => entry.status === step);
          const completed = index <= currentIndex;
          const current = step === status;

          return (
            <li key={step} className="relative flex gap-3">
              {index < steps.length - 1 && (
                <span className="absolute left-2 top-5 h-[calc(100%+0.25rem)] w-px bg-slate-200" />
              )}
              <span
                className={`relative mt-1 h-4 w-4 rounded-full border-2 ${
                  current
                    ? 'border-blue-600 bg-blue-600'
                    : completed
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-slate-300 bg-white'
                }`}
              />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <strong className={current ? 'text-blue-700' : 'text-slate-800'}>{step}</strong>
                  {item && <span className="text-xs font-medium text-slate-400">{formatDate(item.created_at)}</span>}
                </div>
                {current && item?.comment && (
                  <p className="mt-1 text-sm leading-6 text-slate-600">{item.comment}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
