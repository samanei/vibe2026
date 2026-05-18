interface ModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function Modal({ message, onConfirm, onCancel }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl p-6 w-80">
        <p className="text-sm text-gray-700 mb-5 leading-relaxed">{message}</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-md border border-gray-200 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
