import type { VoteType } from '../../types';

interface VoteButtonsProps {
  selected: VoteType | null;
  disabled?: boolean;
  onVote: (voteType: VoteType) => void;
}

export default function VoteButtons({ selected, disabled = false, onVote }: VoteButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onVote('agree')}
        className={`rounded-xl px-4 py-3.5 text-sm font-bold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${
          selected === 'agree'
            ? 'bg-indigo-700 text-white ring-4 ring-indigo-100'
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
      >
        👍 찬성하기
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onVote('disagree')}
        className={`rounded-xl px-4 py-3.5 text-sm font-bold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${
          selected === 'disagree'
            ? 'bg-rose-700 text-white ring-4 ring-rose-100'
            : 'bg-rose-500 text-white hover:bg-rose-600'
        }`}
      >
        👎 반대하기
      </button>
    </div>
  );
}
