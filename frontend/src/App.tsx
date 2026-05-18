import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AgendaDetailPage from './pages/AgendaDetailPage';
import AgendaListPage from './pages/AgendaListPage';
import AgendaNewPage from './pages/AgendaNewPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/agendas" replace />} />
          {/* 공개 안건 */}
          <Route path="/agendas" element={<AgendaListPage />} />
          <Route path="/agendas/new" element={<AgendaNewPage />} />
          <Route path="/agendas/:id" element={<AgendaDetailPage />} />
          {/* 비공개 문의 */}
          <Route path="/inquiries/new" element={<div className="p-8 text-gray-400">문의 작성 페이지 (구현 예정)</div>} />
          <Route path="/my-inquiries" element={<div className="p-8 text-gray-400">내 문의함 페이지 (구현 예정)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
