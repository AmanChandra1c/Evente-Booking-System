import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  onClick,
  type = 'button',
  ...props 
}) => {
  const baseClasses = 'relative overflow-hidden font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg hover:shadow-blue-500/25 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0',
    secondary: 'bg-slate-800 text-slate-100 border border-slate-600 hover:bg-slate-700 hover:border-slate-500 hover:-translate-y-0.5',
    outline: 'border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white hover:shadow-blue-500/25',
    ghost: 'text-slate-300 hover:bg-slate-800 hover:text-white',
    danger: 'bg-gradient-to-r from-red-500 to-red-700 text-white shadow-lg hover:shadow-red-500/25 hover:shadow-xl hover:-translate-y-0.5'
  };
  
  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-xs sm:text-sm',
    md: 'px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base',
    lg: 'px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg',
    xl: 'px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl'
  };

  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

  return (
    <motion.button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {/* Button shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
      {children}
    </motion.button>
  );
};

export default Button;
