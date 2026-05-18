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
    navigate('/admin', { replace: true });
  };

  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl ring-1 ring-slate-100">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">천마광장 관리자</p>
          <h1 className="text-2xl font-bold text-slate-900">관리자 로그인</h1>
        </div>

        <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="admin-code">
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
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition"
          autoComplete="off"
        />
        {error && <p className="mt-2 text-xs font-medium text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={!code.trim()}
          className="mt-6 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:bg-slate-200 disabled:cursor-not-allowed transition"
        >
          로그인
        </button>
      </form>
    </main>
  );
}
