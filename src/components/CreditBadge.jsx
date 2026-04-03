import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const CreditBadge = () => {
  const { credits } = useAuth();
  const navigate = useNavigate();

  if (credits === null) {
    return (
      <div className="w-24 h-7 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />
    );
  }

  const { totalCredits } = credits;
  
  let colorClass = "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400";
  if (totalCredits <= 10) {
    colorClass = "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 animate-pulse";
  } else if (totalCredits <= 20) {
    colorClass = "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400";
  }

  return (
    <div 
      onClick={() => navigate('/credits')}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all hover:scale-105 active:scale-95 ${colorClass}`}
    >
      <span className="text-sm">💎</span>
      <span>{totalCredits} credits</span>
    </div>
  );
};

export default CreditBadge;
