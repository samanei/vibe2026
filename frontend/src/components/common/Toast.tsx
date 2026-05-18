import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

export default function Toast({ message, type = 'success', onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bg = type === 'success' ? 'bg-slate-900' : 'bg-red-600';

  return (
    <div className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl ${bg} px-5 py-3 text-sm font-semibold text-white shadow-2xl ring-1 ring-white/10`}>
      {message}
    </div>
  );
}
