import React from 'react';
import { RiLoaderLine } from "react-icons/ri";

const Spinner = ({ 
  size = 'small', 
  className = '',
  color = 'text-white' 
}) => {
  const sizeClasses = {
    tiny: 'text-xs',
    small: 'text-sm',
    default: 'text-base',
    large: 'text-lg'
  };

  return (
    <RiLoaderLine 
      className={`${sizeClasses[size]} font-bold animate-spin ${color} ${className}`} 
    />
  );
};

export default Spinner;
