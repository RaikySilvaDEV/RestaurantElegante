import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';

const icons = {
  success: <CheckCircle className="h-5 w-5" />,
  error: <XCircle className="h-5 w-5" />,
  info: <Info className="h-5 w-5" />,
};

const bgColors = {
  success: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200',
  error: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
};

const AdminAlert = ({ alert, onDismiss }) => {
  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(onDismiss, 5000); // O alerta some após 5 segundos
      return () => clearTimeout(timer);
    }
  }, [alert, onDismiss]);

  if (!alert.message) return null;

  return (
    <div className={`fixed top-20 right-6 z-50 flex items-center gap-3 rounded-lg p-4 shadow-lg ${bgColors[alert.type] || bgColors.info}`}>
      {icons[alert.type] || icons.info}
      <span className="text-sm font-medium">{alert.message}</span>
    </div>
  );
};

export default AdminAlert;
