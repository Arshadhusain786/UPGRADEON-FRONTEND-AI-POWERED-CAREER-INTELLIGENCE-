import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', loading = false, disabled = false, fullWidth = false, icon: Icon }) => {
  const baseStyles = "px-6 py-3 rounded-2xl font-bold transition-all duration-200 flex items-center justify-center space-x-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 transition-colors transition-transform";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-700 dark:to-primary-900 text-white shadow-lg shadow-primary-500/20 dark:shadow-primary-900/30 hover:shadow-primary-500/40 hover:-translate-y-0.5",
    secondary: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600",
    danger: "bg-red-500 dark:bg-red-900 text-white shadow-lg shadow-red-500/20 dark:shadow-red-900/40 hover:bg-red-600 dark:hover:bg-red-800 hover:shadow-red-500/40",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
      `}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      ) : (
        <>
          {Icon && <Icon size={18} />}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

export default Button;
