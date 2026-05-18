interface ModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function Modal({ message, onConfirm, onCancel }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="w-96 rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-100">
        <p className="mb-6 text-sm leading-relaxed text-slate-600">{message}</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="rounded-lg border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700 transition"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
