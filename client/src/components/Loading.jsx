import React from 'react';
import { RiLoaderLine } from "react-icons/ri";

const Loading = ({ 
  size = 'default', 
  text = 'Loading...', 
  fullScreen = true,
  className = '',
  showText = true 
}) => {
  const sizeClasses = {
    small: 'text-2xl',
    default: 'text-4xl',
    large: 'text-6xl'
  };

  const containerClasses = fullScreen 
    ? 'w-full h-screen flex items-center justify-center'
    : 'flex items-center justify-center';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="text-center">
        <RiLoaderLine className={`${sizeClasses[size]} font-bold animate-spin text-blue-500 mx-auto`} />
        {showText && (
          <p className="mt-4 text-slate-400 text-sm sm:text-base">{text}</p>
        )}
      </div>
    </div>
  );
};

export default Loading;