import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import Layout from './components/layout/Layout';
import { isAdminAuthenticated } from './lib/adminAuth';
import AdminAgendaPage from './pages/AdminAgendaPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminLoginPage from './pages/AdminLoginPage';

function RequireAdmin({ children }: { children: ReactNode }) {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<RequireAdmin><AdminDashboardPage /></RequireAdmin>} />
        <Route path="/admin/agendas" element={<RequireAdmin><AdminAgendaPage /></RequireAdmin>} />
        <Route path="/admin/inquiries" element={<RequireAdmin><AdminDashboardPage /></RequireAdmin>} />
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/agendas" replace />} />
          {/* 공개 안건 */}
          <Route path="/agendas" element={<div className="p-8 text-gray-400">안건 목록 페이지 (구현 예정)</div>} />
          <Route path="/agendas/new" element={<div className="p-8 text-gray-400">안건 작성 페이지 (구현 예정)</div>} />
          <Route path="/agendas/:id" element={<div className="p-8 text-gray-400">안건 상세 페이지 (구현 예정)</div>} />
          {/* 비공개 문의 */}
          <Route path="/inquiries/new" element={<div className="p-8 text-gray-400">문의 작성 페이지 (구현 예정)</div>} />
          <Route path="/my-inquiries" element={<div className="p-8 text-gray-400">내 문의함 페이지 (구현 예정)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
