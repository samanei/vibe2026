// 관리자 화면 전용 상단 내비게이션을 렌더링하는 컴포넌트
import { NavLink } from 'react-router-dom';

export default function AdminGNB() {
  const tabClass = ({ isActive }: { isActive: boolean }) =>
    `px-5 py-2.5 rounded-lg text-sm font-semibold border transition ${
      isActive
        ? 'bg-blue-600 border-blue-600 text-white'
        : 'bg-transparent border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-[#1d1c19] border-b border-[#2b2a26]">
      <div className="max-w-7xl mx-auto h-[72px] px-6 lg:px-10 flex items-center gap-5">
        <NavLink to="/admin" className="flex items-center gap-3 mr-auto">
          <span className="text-xl font-extrabold tracking-tight">
            <span className="text-white">천마</span>
            <span className="text-blue-400">광장</span>
          </span>
          <span className="text-xs font-bold bg-gray-700 text-gray-100 px-2.5 py-1 rounded-md">관리자</span>
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
