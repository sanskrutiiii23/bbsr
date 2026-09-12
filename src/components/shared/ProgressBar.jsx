import React from 'react';
import { motion } from 'framer-motion';

export const ProgressBar = ({
  value = 0,
  max = 100,
  label = '',
  colorClass = 'bg-gradient-to-r from-emerald-600 to-emerald-400',
  heightClass = 'h-3',
  showValue = false
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return (
    <div className="w-full select-none">
      {(label || showValue) && (
        <div className="flex justify-between items-center text-[11px] mb-1 font-semibold tracking-wide text-neutral-300">
          <span>{label}</span>
          {showValue && <span className="font-mono text-neutral-400">{value} / {max} ({percentage}%)</span>}
        </div>
      )}
      
      {/* RPG Inset Gauge Frame */}
      <div className={`w-full bg-black/75 rounded-sm p-[2px] border border-white/15 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] relative overflow-hidden ${heightClass}`}>
        
        {/* Fill Bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={`h-full rounded-sm ${colorClass} transition-all relative overflow-hidden`}
        >
          {/* Top Glass Highlight */}
          <div className="absolute top-0 left-0 right-0 h-[45%] bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
          
          {/* Subtle edge pulse glow */}
          <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-[2px]" />
        </motion.div>

        {/* Gauge Segment Ticks (25%, 50%, 75%) */}
        <div className="absolute inset-0 flex justify-between pointer-events-none px-1">
          <div className="w-[1px] h-full bg-black/40" style={{ marginLeft: '25%' }} />
          <div className="w-[1px] h-full bg-black/50" style={{ marginLeft: '25%' }} />
          <div className="w-[1px] h-full bg-black/40" style={{ marginLeft: '25%' }} />
        </div>
      </div>
    </div>
  );
};
