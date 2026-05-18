import { Outlet } from 'react-router-dom';
import GNB from './GNB';

export default function Layout() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <GNB />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
