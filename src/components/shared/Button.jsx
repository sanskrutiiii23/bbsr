import React from 'react';
import { sound } from '../../utils/soundEffects';

export const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  icon: Icon,
  ...props
}) => {
  const handleClick = (e) => {
    if (disabled) return;
    sound.playClick();
    if (onClick) onClick(e);
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2 text-xs sm:text-sm rounded-xl gap-2',
    lg: 'px-6 py-3 text-sm sm:text-base rounded-xl gap-2.5'
  };

  const variantClasses = {
    primary: 'theme-button-primary font-bold shadow-lg',
    secondary: 'bg-white/10 hover:bg-white/15 text-white border border-white/15 font-semibold',
    outline: 'border border-white/20 text-neutral-300 hover:text-white hover:bg-white/5 font-semibold',
    danger: 'bg-red-600/80 hover:bg-red-600 text-white border border-red-500/50 font-bold',
    ghost: 'text-neutral-400 hover:text-white hover:bg-white/5 font-medium'
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 stroke-[2.5]" />}
      <span>{children}</span>
    </button>
  );
};
