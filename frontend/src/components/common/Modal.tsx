interface ModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function Modal({ message, onConfirm, onCancel }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45">
      <div className="w-80 rounded-lg bg-white p-6 shadow-2xl">
        <p className="mb-5 text-sm font-medium leading-relaxed text-slate-700">{message}</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="rounded-md border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
