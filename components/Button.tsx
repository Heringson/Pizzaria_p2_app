import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  // Mapping variant props to CSS classes defined in index.css
  const variantClass = `btn-${variant}`;
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button 
      className={`btn ${variantClass} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};