
import React from 'react';
import type { ButtonVariant } from '../types';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: ButtonVariant;
  className?: string;
  ariaLabel?: string;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, variant = 'number', className = '', ariaLabel }) => {
  let baseStyle = "font-['Press_Start_2P'] text-lg sm:text-xl p-3 sm:p-4 rounded-none border-2 transition-all duration-100 ease-in-out transform active:translate-y-px focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-800";
  
  switch (variant) {
    case 'number':
      baseStyle += ' bg-stone-600 hover:bg-stone-500 text-gray-100 border-stone-700 hover:border-stone-600 focus:ring-red-500';
      break;
    case 'operator':
      baseStyle += ' bg-red-700 hover:bg-red-600 text-red-100 border-red-800 hover:border-red-700 focus:ring-orange-400';
      break;
    case 'action':
      baseStyle += ' bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-800 hover:border-gray-700 focus:ring-gray-400';
      break;
    case 'equals':
      baseStyle += ' bg-orange-600 hover:bg-orange-500 text-white border-orange-700 hover:border-orange-600 focus:ring-yellow-400';
      break;
  }

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${className}`}
      aria-label={ariaLabel || label}
    >
      {label}
    </button>
  );
};

export default Button;
