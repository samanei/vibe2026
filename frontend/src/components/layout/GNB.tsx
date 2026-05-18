import { useLocation, useNavigate } from 'react-router-dom';

export default function GNB() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAgenda = location.pathname.startsWith('/agendas');
  const isInquiry = location.pathname.startsWith('/inquiries') || location.pathname.startsWith('/my-inquiries');

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-5 px-6">
        <button
          onClick={() => navigate('/agendas')}
          className="mr-4 flex items-center gap-2 text-left"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-black text-white">
            천
          </span>
          <span>
            <span className="block text-base font-black tracking-tight text-slate-900">천마광장</span>
            <span className="block text-[11px] font-medium text-slate-400">Campus Voice</span>
          </span>
        </button>

        <nav className="flex flex-1 items-center gap-1">
          <button
            onClick={() => navigate('/agendas')}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              isAgenda ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            공개 안건
          </button>
          <button
            onClick={() => navigate('/my-inquiries')}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              isInquiry ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            내 문의함
          </button>
        </nav>

        <button
          onClick={() => navigate('/inquiries/new')}
          className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition"
        >
          비공개 문의
        </button>
        <button
          onClick={() => navigate('/agendas/new')}
          className="rounded-full bg-indigo-600 px-4 py-1.5 text-sm font-bold text-white hover:bg-indigo-700 transition"
        >
          + 안건 등록
        </button>
      </div>
    </header>
  );
}
