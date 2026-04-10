import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  type = 'danger' 
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: 'bg-red-600 hover:bg-red-700 shadow-red-500/20',
    primary: 'bg-primary-600 hover:bg-primary-700 shadow-primary-500/20',
    warning: 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20'
  };

  const iconStyles = {
    danger: 'text-red-600 bg-red-50 dark:bg-red-900/20',
    primary: 'text-primary-600 bg-primary-50 dark:bg-primary-900/20',
    warning: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20'
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-900 rounded-[32px] p-8 max-w-md w-full shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in duration-300 relative overflow-hidden">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center space-y-4">
          <div className={`p-4 rounded-2xl ${iconStyles[type]} transition-colors`}>
            <AlertCircle size={32} />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              {title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              {message}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-4 text-gray-500 dark:text-gray-400 font-black uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl transition-all order-2 sm:order-1"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 py-4 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 order-1 sm:order-2 ${typeStyles[type]}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
