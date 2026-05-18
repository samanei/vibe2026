interface PaginationProps {
  page: number;
  total: number;
  limit: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, total, limit, onChange }: PaginationProps) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1 py-4">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-1.5 text-sm rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
      >
        이전
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`px-3 py-1.5 text-sm rounded border ${
            p === page
              ? 'bg-blue-600 text-white border-blue-600'
              : 'border-gray-200 hover:bg-gray-50'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1.5 text-sm rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
      >
        다음
      </button>
    </div>
  );
}
