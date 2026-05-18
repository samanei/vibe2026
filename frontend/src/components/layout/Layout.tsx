import { Outlet } from 'react-router-dom';
import GNB from './GNB';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <GNB />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
