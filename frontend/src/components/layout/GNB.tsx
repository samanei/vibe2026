import { useLocation, useNavigate } from 'react-router-dom';

export default function GNB() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAgenda = location.pathname.startsWith('/agendas');
  const isInquiry = location.pathname.startsWith('/inquiries') || location.pathname.startsWith('/my-inquiries');

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-5 px-6">
        <button
          onClick={() => navigate('/agendas')}
          className="mr-4 flex items-center gap-2 text-left"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-sm font-black text-white">
            천
          </span>
          <span>
            <span className="block text-base font-black tracking-normal text-slate-950">천마광장</span>
            <span className="block text-[11px] font-medium text-slate-500">Campus Voice</span>
          </span>
        </button>

        <nav className="flex flex-1 items-center gap-1">
          <button
            onClick={() => navigate('/agendas')}
            className={`rounded-md px-3 py-2 text-sm font-semibold ${
              isAgenda ? 'bg-slate-100 text-slate-950' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            공개 안건
          </button>
          <button
            onClick={() => navigate('/my-inquiries')}
            className={`rounded-md px-3 py-2 text-sm font-semibold ${
              isInquiry ? 'bg-slate-100 text-slate-950' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            내 문의함
          </button>
        </nav>

        <button
          onClick={() => navigate('/inquiries/new')}
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50"
        >
          비공개 문의
        </button>
        <button
          onClick={() => navigate('/agendas/new')}
          className="rounded-md bg-slate-950 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-slate-800"
        >
          + 안건 등록
        </button>
      </div>
    </header>
  );
}
