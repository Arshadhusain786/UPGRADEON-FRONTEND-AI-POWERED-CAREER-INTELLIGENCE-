import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 flex items-start space-x-3 animate-in fade-in slide-in-from-top-2 duration-300">
      <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={18} />
      <p className="text-sm text-red-700">{message}</p>
    </div>
  );
};

export default ErrorMessage;
