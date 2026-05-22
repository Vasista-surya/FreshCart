import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX, FiInfo, FiAlertTriangle } from 'react-icons/fi';
import { useToast } from '../context/ToastContext';

const iconMap = {
  success: <FiCheck size={18} />,
  error: <FiX size={18} />,
  info: <FiInfo size={18} />,
  warning: <FiAlertTriangle size={18} />,
};

const colorMap = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'bg-green-500 text-white',
    text: 'text-green-800',
    bar: 'bg-green-500',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: 'bg-red-500 text-white',
    text: 'text-red-800',
    bar: 'bg-red-500',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'bg-blue-500 text-white',
    text: 'text-blue-800',
    bar: 'bg-blue-500',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: 'bg-amber-500 text-white',
    text: 'text-amber-800',
    bar: 'bg-amber-500',
  },
};

const Toast = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const colors = colorMap[toast.type] || colorMap.success;
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 80, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className={`pointer-events-auto ${colors.bg} ${colors.border} border rounded-xl shadow-lg overflow-hidden`}
            >
              <div className="flex items-center gap-3 px-4 py-3">
                <div
                  className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${colors.icon}`}
                >
                  {iconMap[toast.type]}
                </div>
                <p className={`flex-1 text-sm font-medium ${colors.text}`}>
                  {toast.message}
                </p>
                <button
                  onClick={() => removeToast(toast.id)}
                  className={`flex-shrink-0 ${colors.text} hover:opacity-70 transition-opacity`}
                >
                  <FiX size={16} />
                </button>
              </div>
              <div className="h-1 w-full bg-gray-100">
                <motion.div
                  className={`h-full ${colors.bar}`}
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 3, ease: 'linear' }}
                />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
