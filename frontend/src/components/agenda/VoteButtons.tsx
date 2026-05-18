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
        className={`rounded-lg px-4 py-3 text-sm font-black shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
          selected === 'agree'
            ? 'bg-blue-700 text-white ring-4 ring-blue-100'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        👍 찬성하기
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onVote('disagree')}
        className={`rounded-lg px-4 py-3 text-sm font-black shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
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
