import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/common/Modal';
import Toast from '../components/common/Toast';
import { AGENDA_CATEGORIES } from '../constants';
import { createAgenda } from '../lib/api';
import { getUserDepartment } from '../lib/session';
import type { AgendaCategory } from '../types';

const FORM_CATEGORIES = AGENDA_CATEGORIES.filter((category) => category !== '전체') as AgendaCategory[];

export default function AgendaNewPage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<AgendaCategory | null>(null);
  const [title, setTitle] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [improvementRequest, setImprovementRequest] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const dirty = Boolean(category || title || problemDescription || improvementRequest);
  const canSubmit = useMemo(
    () =>
      Boolean(
        category &&
          title.trim() &&
          title.trim().length <= 50 &&
          problemDescription.trim() &&
          improvementRequest.trim(),
      ),
    [category, improvementRequest, problemDescription, title],
  );

  const handleCancel = () => {
    if (dirty) {
      setShowCancelModal(true);
      return;
    }
    navigate('/agendas');
  };

  const handleSubmit = async () => {
    if (!category || !canSubmit || submitting) return;

    setSubmitting(true);
    try {
      await createAgenda({
        category,
        title: title.trim(),
        problem_description: problemDescription.trim(),
        improvement_request: improvementRequest.trim(),
        department: getUserDepartment(),
      });
      navigate('/agendas', { state: { toast: '안건이 등록되었습니다.' } });
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : '안건 등록에 실패했습니다.',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-7">
      <div className="mb-5 flex items-center justify-between">
        <button onClick={handleCancel} className="text-sm font-black text-slate-600 hover:text-slate-950">
          ← 취소
        </button>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || submitting}
          className="rounded-md bg-slate-950 px-4 py-2 text-sm font-black text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          등록하기
        </button>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="border-b border-slate-200 px-7 py-6">
          <p className="text-xs font-black uppercase text-blue-700">NEW AGENDA</p>
          <h1 className="mt-1 text-2xl font-black text-slate-950">안건 등록</h1>
          <p className="mt-1 text-sm text-slate-500">공개적으로 논의할 학교생활 개선 의견을 작성해주세요.</p>
        </div>

        <div className="mx-7 mt-6 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-800">
          🔒 익명으로 등록됩니다 — 이름·학번은 절대 공개되지 않아요. 학과 정보만 표시됩니다.
        </div>

        <div className="space-y-7 p-7">
          <div>
            <label className="mb-3 block text-sm font-black text-slate-950">카테고리 선택 *</label>
            <div className="flex flex-wrap gap-2">
              {FORM_CATEGORIES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`rounded-md border px-4 py-2 text-sm font-bold transition ${
                    category === item
                      ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="agenda-title" className="text-sm font-black text-slate-950">
                안건 제목 *
              </label>
              <span className={`text-xs font-bold ${title.length > 50 ? 'text-red-600' : 'text-slate-400'}`}>
                {title.length}/50
              </span>
            </div>
            <input
              id="agenda-title"
              value={title}
              maxLength={50}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="안건 제목을 입력해주세요"
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <TextArea
            id="problem-description"
            label="문제 상황 *"
            value={problemDescription}
            onChange={setProblemDescription}
            placeholder="현재 불편하거나 개선이 필요한 상황을 작성해주세요"
          />

          <TextArea
            id="improvement-request"
            label="개선 요청 *"
            value={improvementRequest}
            onChange={setImprovementRequest}
            placeholder="원하는 개선 방향을 작성해주세요"
          />

          <div className="rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
            ⚠ 욕설·비방·허위사실이 포함된 안건은 관리자가 비공개 처리할 수 있습니다.
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="w-full rounded-lg bg-blue-600 py-3.5 text-sm font-black text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            안건 등록하기
          </button>
        </div>
      </section>

      {showCancelModal && (
        <Modal
          message="작성 중인 내용이 있습니다. 등록하지 않고 나가시겠습니까?"
          onCancel={() => setShowCancelModal(false)}
          onConfirm={() => navigate('/agendas')}
        />
      )}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}

function TextArea({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-black text-slate-950">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={6}
        className="w-full resize-y rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium leading-6 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
    </div>
  );
}
