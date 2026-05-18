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

  const bg = type === 'success' ? 'bg-gray-900' : 'bg-red-600';

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 ${bg} text-white px-4 py-2.5 rounded-lg shadow-lg text-sm`}>
      {message}
    </div>
  );
}
