import React from 'react';
import { motion } from 'framer-motion';

export const ProgressBar = ({
  value = 0,
  max = 100,
  label = '',
  colorClass = 'bg-emerald-500',
  heightClass = 'h-2.5',
  showValue = false
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center text-xs mb-1 font-medium text-neutral-300">
          <span>{label}</span>
          {showValue && <span>{value} / {max} ({percentage}%)</span>}
        </div>
      )}
      <div className={`w-full bg-black/40 rounded-full overflow-hidden border border-white/10 ${heightClass}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`h-full rounded-full ${colorClass} transition-all duration-300 relative overflow-hidden`}
        >
          {/* Shimmer light bar */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full animate-shimmer" />
        </motion.div>
      </div>
    </div>
  );
};
