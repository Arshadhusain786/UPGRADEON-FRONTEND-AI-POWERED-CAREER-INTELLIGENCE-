import React from 'react';

const Loader = ({ fullScreen = false }) => {
  const spinner = (
    <div className="flex items-center justify-center space-x-2">
      <div className="w-4 h-4 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-4 h-4 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-4 h-4 bg-primary-500 rounded-full animate-bounce"></div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return <div className="p-4 flex justify-center">{spinner}</div>;
};

export default Loader;
