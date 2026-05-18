import { useNavigate } from 'react-router-dom';

export default function GNB() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 h-14 flex items-center px-6 gap-4">
      <button
        onClick={() => navigate('/agendas')}
        className="font-bold text-lg text-blue-600 mr-auto"
      >
        캠퍼스보이스
      </button>
      <button
        onClick={() => navigate('/my-inquiries')}
        className="text-sm text-gray-600 hover:text-gray-900"
      >
        내 문의함
      </button>
      <button
        onClick={() => navigate('/inquiries/new')}
        className="text-sm text-gray-600 hover:text-gray-900"
      >
        비공개 문의
      </button>
      <button
        onClick={() => navigate('/agendas/new')}
        className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700"
      >
        + 안건 등록
      </button>
    </header>
  );
}
