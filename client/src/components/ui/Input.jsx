import React from 'react';

const Input = ({ 
  label, 
  error, 
  className = '', 
  containerClassName = '',
  glass = false,
  ...props 
}) => {
  const baseClasses = 'w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm sm:text-base';
  
  const backgroundClasses = glass 
    ? 'glass-effect bg-slate-900/60 backdrop-blur-lg border-white/10 text-white placeholder-slate-400'
    : 'bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:bg-slate-750';
    
  const inputClasses = `${baseClasses} ${backgroundClasses} ${error ? 'border-red-500 focus:ring-red-500/50' : ''} ${className}`;

  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && (
        <label className="block text-xs sm:text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <input
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="text-xs sm:text-sm text-red-400 flex items-center gap-1">
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
