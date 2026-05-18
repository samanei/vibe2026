// 관리자 화면 전용 상단 내비게이션을 렌더링하는 컴포넌트
import { NavLink } from 'react-router-dom';

export default function AdminGNB() {
  const tabClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-1.5 rounded-md text-sm font-medium transition ${
      isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-50 h-14 bg-gray-950 border-b border-gray-800 px-6 flex items-center gap-5">
      <NavLink to="/admin" className="flex items-center gap-2 mr-auto">
        <span className="font-bold text-lg text-white">천마광장</span>
        <span className="text-xs font-semibold bg-blue-600 text-white px-2 py-0.5 rounded">관리자</span>
      </NavLink>
      <nav className="flex items-center gap-2">
        <NavLink to="/admin" end className={tabClass}>
          대시보드
        </NavLink>
        <span className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-500 cursor-not-allowed">
          안건 관리
        </span>
        <span className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-500 cursor-not-allowed">
          문의 관리
        </span>
      </nav>
    </header>
  );
}
