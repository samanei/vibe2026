// 관리자 코드 로그인을 처리하는 페이지
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAdminSession, validateAdminCode } from '../lib/adminAuth';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateAdminCode(code)) {
      setError('관리자 코드가 올바르지 않습니다.');
      return;
    }

    setAdminSession();
    navigate('/admin/agendas', { replace: true });
  };

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white rounded-lg border border-gray-200 p-6 shadow-xl">
        <div className="mb-6">
          <p className="text-sm font-semibold text-blue-600 mb-2">천마광장 관리자</p>
          <h1 className="text-2xl font-bold text-gray-900">관리자 로그인</h1>
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="admin-code">
          관리자 코드
        </label>
        <input
          id="admin-code"
          type="password"
          value={code}
          onChange={(event) => {
            setCode(event.target.value);
            setError('');
          }}
          className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          autoComplete="off"
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={!code.trim()}
          className="mt-5 w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          로그인
        </button>
      </form>
    </main>
  );
}
