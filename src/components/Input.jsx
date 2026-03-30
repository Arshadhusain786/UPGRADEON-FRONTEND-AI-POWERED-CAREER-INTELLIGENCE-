import React from 'react';

const Input = ({ label, type = 'text', value, onChange, placeholder, required = false, disabled = false, error }) => {
  return (
    <div className="space-y-1 w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1 transition-colors">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`
          w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border rounded-2xl transition-all duration-200 outline-none
          placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white
          ${error ? 'border-red-500 ring-2 ring-red-100 dark:ring-red-900/20' : 'border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:bg-white dark:focus:bg-gray-800'}
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      />
      {error && <p className="text-xs text-red-500 mt-1 ml-1 font-medium">{error}</p>}
    </div>
  );
};

export default Input;
