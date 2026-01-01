import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = true,
  glass = false,
  ...props 
}) => {
  const baseClasses = 'rounded-xl border overflow-hidden';
  
  const backgroundClasses = glass 
    ? 'glass-effect bg-slate-900/60 backdrop-blur-lg border-white/10'
    : 'bg-slate-800 border-slate-700';
    
  const hoverClasses = hover 
    ? 'hover-lift hover:border-blue-500/50 hover:shadow-blue-500/10'
    : '';
    
  const cardClasses = `${baseClasses} ${backgroundClasses} ${hoverClasses} ${className}`;

  return (
    <motion.div
      className={cardClasses}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={hover ? { y: -4 } : {}}
      {...props}
    >
      {children}
    </motion.div>
  );
};

const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`p-6 border-b border-slate-700 ${className}`} {...props}>
    {children}
  </div>
);

const CardBody = ({ children, className = '', ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`p-6 border-t border-slate-700 bg-slate-900/50 ${className}`} {...props}>
    {children}
  </div>
);

export { Card, CardHeader, CardBody, CardFooter };
