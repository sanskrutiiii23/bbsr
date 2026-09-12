import React from 'react';

export const Badge = ({ children, variant = 'neutral', size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3 py-1.5 text-sm font-bold'
  };

  const variantClasses = {
    easy: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
    medium: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    hard: 'bg-red-500/15 text-red-300 border border-red-500/30',
    study: 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30',
    fitness: 'bg-orange-500/15 text-orange-300 border border-orange-500/30',
    work: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30',
    health: 'bg-teal-500/15 text-teal-300 border border-teal-500/30',
    epic: 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.3)]',
    gold: 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/30',
    neutral: 'bg-white/10 text-neutral-300 border border-white/10'
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full uppercase tracking-wider ${sizeClasses[size]} ${variantClasses[variant] || variantClasses.neutral}`}
    >
      {children}
    </span>
  );
};
