import React from 'react';

export const Badge = ({ children, variant = 'neutral', size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[9px]',
    md: 'px-2.5 py-0.5 text-[10px] font-bold',
    lg: 'px-3 py-1 text-xs font-bold'
  };

  const variantClasses = {
    easy: 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 shadow-[inset_0_1px_0_rgba(52,211,153,0.2)]',
    medium: 'bg-amber-950/60 text-amber-300 border border-amber-500/40 shadow-[inset_0_1px_0_rgba(245,158,11,0.2)]',
    hard: 'bg-red-950/60 text-red-300 border border-red-500/50 shadow-[inset_0_1px_0_rgba(239,68,68,0.2)]',
    study: 'bg-indigo-950/60 text-indigo-300 border border-indigo-500/40 shadow-[inset_0_1px_0_rgba(99,102,241,0.2)]',
    fitness: 'bg-orange-950/60 text-orange-300 border border-orange-500/40 shadow-[inset_0_1px_0_rgba(249,115,22,0.2)]',
    work: 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 shadow-[inset_0_1px_0_rgba(6,182,212,0.2)]',
    health: 'bg-teal-950/60 text-teal-300 border border-teal-500/40 shadow-[inset_0_1px_0_rgba(20,184,166,0.2)]',
    epic: 'bg-purple-950/70 text-purple-200 border border-purple-400/60 shadow-[0_0_12px_rgba(168,85,247,0.35),inset_0_1px_0_rgba(255,255,255,0.3)]',
    gold: 'bg-yellow-950/60 text-yellow-300 border border-yellow-500/40 shadow-[inset_0_1px_0_rgba(234,179,8,0.2)]',
    neutral: 'bg-neutral-900/80 text-neutral-300 border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-sm uppercase tracking-wider font-mono ${sizeClasses[size]} ${variantClasses[variant] || variantClasses.neutral} ${className}`}
    >
      {children}
    </span>
  );
};
