import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const icons = {
  success: <CheckCircle className="h-6 w-6 text-green-500" />,
  error: <XCircle className="h-6 w-6 text-red-500" />,
  info: <Info className="h-6 w-6 text-blue-500" />,
};

const StatusAlert = ({ message, type, duration = 5000, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300); // Aguarda a animação de saída
  };

  if (!message) return null;

  return (
    <div className={`fixed top-6 right-6 w-full max-w-sm bg-white dark:bg-zinc-800 shadow-2xl rounded-xl p-4 z-[100] transition-all duration-300 ease-in-out ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{icons[type] || icons.info}</div>
        <div className="flex-1 text-sm text-zinc-700 dark:text-zinc-200">{message}</div>
        <button onClick={handleClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"><X className="h-5 w-5" /></button>
      </div>
    </div>
  );
};

export default StatusAlert;
