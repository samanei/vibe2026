import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/common/Toast';
import { INQUIRY_CATEGORIES } from '../constants';
import { createInquiry } from '../lib/api';
import { getUserDepartment, getUserToken } from '../lib/session';
import type { InquiryCategory } from '../types';

const MAX_CONTENT_LENGTH = 1000;

export default function InquiryNewPage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<InquiryCategory | ''>('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const canSubmit = useMemo(
    () => Boolean(category && title.trim() && content.trim() && content.length <= MAX_CONTENT_LENGTH),
    [category, content, title],
  );

  const handleContentChange = (value: string) => {
    setContent(value.slice(0, MAX_CONTENT_LENGTH));
  };

  const handleSubmit = async () => {
    if (!category || !canSubmit || submitting) return;

    setSubmitting(true);
    try {
      await createInquiry({
        category,
        title: title.trim(),
        content: content.trim(),
        department: getUserDepartment(),
        user_token: getUserToken(),
      });
      navigate('/my-inquiries', { state: { toast: '문의가 등록되었습니다.' } });
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : '문의 등록에 실패했습니다.',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-7">
      <div className="mb-5 flex items-center justify-between">
        <button onClick={() => navigate('/agendas')} className="text-sm font-black text-slate-600 hover:text-slate-950">
          ← 돌아가기
        </button>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || submitting}
          className="rounded-md bg-slate-950 px-4 py-2 text-sm font-black text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          문의 제출하기
        </button>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="border-b border-slate-200 px-7 py-6">
          <p className="text-xs font-black uppercase text-emerald-700">PRIVATE INQUIRY</p>
          <h1 className="mt-1 text-2xl font-black text-slate-950">비공개 문의 작성</h1>
          <p className="mt-1 text-sm text-slate-500">공개하기 어려운 문의는 학생회에 비공개로 전달됩니다.</p>
        </div>

        <div className="mx-7 mt-6 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          🔒 학생회/관리자만 확인할 수 있습니다. 다른 학생에게는 절대 공개되지 않습니다.
        </div>

        <div className="space-y-7 p-7">
          <div>
            <label htmlFor="inquiry-category" className="mb-2 block text-sm font-black text-slate-950">
              문의 유형 *
            </label>
            <select
              id="inquiry-category"
              value={category}
              onChange={(event) => setCategory(event.target.value as InquiryCategory | '')}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            >
              <option value="">문의 유형을 선택해주세요</option>
              {INQUIRY_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="inquiry-title" className="mb-2 block text-sm font-black text-slate-950">
              제목 *
            </label>
            <input
              id="inquiry-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="문의 제목을 입력해주세요"
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="inquiry-content" className="text-sm font-black text-slate-950">
                문의 내용 *
              </label>
              <span className="text-xs font-bold text-slate-400">
                {content.length}/{MAX_CONTENT_LENGTH}
              </span>
            </div>
            <textarea
              id="inquiry-content"
              value={content}
              onChange={(event) => handleContentChange(event.target.value)}
              placeholder="문의 내용을 자세히 작성해주세요"
              rows={9}
              maxLength={MAX_CONTENT_LENGTH}
              className="w-full resize-y rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium leading-6 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h2 className="mb-3 text-sm font-black text-slate-950">안내 사항</h2>
            <ul className="grid gap-2 text-sm font-medium text-slate-600">
              <li>📬 제출 후 내 문의함에서 답변 확인 가능</li>
              <li>⏱ 평균 답변 기간 3~5 영업일 이내</li>
              <li>🔒 담당자 외 열람 불가</li>
              <li>⚠ 허위·악의적 문의는 처리 거부 가능</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="w-full rounded-lg bg-emerald-600 py-3.5 text-sm font-black text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            문의 제출하기
          </button>
        </div>
      </section>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
