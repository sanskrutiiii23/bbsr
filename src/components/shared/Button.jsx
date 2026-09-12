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
    sm: 'px-2.5 py-1 text-[11px] font-mono rounded-xs gap-1.5',
    md: 'px-4 py-2 text-xs font-mono rounded-xs gap-2',
    lg: 'px-5 py-2.5 text-xs sm:text-sm font-mono rounded-xs gap-2.5'
  };

  const variantClasses = {
    primary: 'rpg-button-primary font-black uppercase tracking-wider shadow-lg active:translate-y-0.5',
    secondary: 'rpg-button font-bold uppercase tracking-wider active:translate-y-0.5',
    outline: 'border border-neutral-700 bg-neutral-950/80 text-neutral-300 hover:text-white hover:border-neutral-500 font-bold uppercase tracking-wider active:translate-y-0.5',
    danger: 'bg-red-950/90 hover:bg-red-900 text-red-200 border border-red-700 font-black uppercase tracking-wider shadow-md active:translate-y-0.5',
    ghost: 'text-neutral-400 hover:text-white hover:bg-white/5 font-bold uppercase tracking-wider'
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
