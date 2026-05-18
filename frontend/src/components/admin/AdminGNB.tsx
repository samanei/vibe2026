// 관리자 화면 전용 상단 내비게이션을 렌더링하는 컴포넌트
import { NavLink } from 'react-router-dom';

export default function AdminGNB() {
  const tabClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-4 py-2 text-sm font-semibold border transition ${
      isActive
        ? 'bg-indigo-600 border-indigo-600 text-white'
        : 'border-transparent text-slate-400 hover:text-white hover:border-slate-600'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto h-[72px] px-6 lg:px-10 flex items-center gap-5">
        <NavLink to="/admin" className="flex items-center gap-3 mr-auto">
          <span className="text-xl font-extrabold tracking-tight">
            <span className="text-white">천마</span>
            <span className="text-indigo-400">광장</span>
          </span>
          <span className="text-xs font-semibold bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md">관리자</span>
        </NavLink>
        <nav className="flex items-center gap-2 overflow-x-auto">
          <NavLink to="/admin" end className={tabClass}>
            대시보드
          </NavLink>
          <NavLink to="/admin/agendas" className={tabClass}>
            안건 관리
          </NavLink>
          <NavLink to="/admin/inquiries" className={tabClass}>
            문의 관리
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
