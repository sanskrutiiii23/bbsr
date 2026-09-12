import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Badge } from '../shared/Badge';
import { sound } from '../../utils/soundEffects';
import { CheckCircle2, Circle, Flame, Coins, Zap, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const QuestCard = ({ quest, onComplete, onDelete }) => {
  const { themeConfig } = useTheme();
  const [isCompleting, setIsCompleting] = useState(false);
  const [rewardPopup, setRewardPopup] = useState(null);

  const handleComplete = async () => {
    if (quest.completed || isCompleting) return;
    setIsCompleting(true);

    try {
      sound.playQuestComplete();
      setRewardPopup({
        xp: quest.xp,
        gold: quest.gold,
        id: Date.now()
      });

      await onComplete(quest.id);

      setTimeout(() => {
        setRewardPopup(null);
        setIsCompleting(false);
      }, 1500);
    } catch (e) {
      console.error(e);
      setIsCompleting(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`theme-card p-4 flex flex-col justify-between transition-all duration-300 relative group ${
        quest.completed ? 'opacity-65 bg-black/20' : 'hover:-translate-y-0.5'
      }`}
    >
      {/* Floating Reward Animation */}
      <AnimatePresence>
        {rewardPopup && (
          <motion.div
            key={rewardPopup.id}
            initial={{ opacity: 0, y: 0, scale: 0.7 }}
            animate={{ opacity: 1, y: -45, scale: 1.15 }}
            exit={{ opacity: 0 }}
            className="absolute z-30 top-3 right-6 flex items-center gap-3 px-3 py-1.5 rounded-full bg-neutral-900 border border-amber-400/60 shadow-2xl text-xs font-black"
          >
            <span className="text-emerald-400 flex items-center gap-1">
              +{rewardPopup.xp} {themeConfig.terminology.xp}
            </span>
            <span className="text-amber-400 flex items-center gap-1">
              +{rewardPopup.gold} 🪙
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        {/* Top Header: Category & Difficulty Badges */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant={quest.category} size="sm">
              {quest.category}
            </Badge>
            <Badge variant={quest.difficulty} size="sm">
              {quest.difficulty}
            </Badge>
            {quest.isDaily && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                Daily Habit
              </span>
            )}
          </div>

          {quest.streak > 0 && (
            <div className="flex items-center gap-1 text-[11px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
              <Flame className="w-3 h-3 fill-orange-500" />
              <span>{quest.streak} streak</span>
            </div>
          )}
        </div>

        {/* Quest Title */}
        <h4 className={`text-base font-bold text-white mb-1.5 ${quest.completed ? 'line-through text-neutral-400' : ''}`}>
          {quest.title}
        </h4>

        {/* Description */}
        {quest.description && (
          <p className="text-xs text-neutral-300/80 mb-3 line-clamp-2 leading-relaxed">
            {quest.description}
          </p>
        )}
      </div>

      {/* Footer: Rewards & Complete Trigger */}
      <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-2">
        {/* Rewards pill */}
        <div className="flex items-center gap-3 text-xs font-bold">
          <span className="text-emerald-400 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" />
            {quest.xp} XP
          </span>
          <span className="text-amber-400 flex items-center gap-1">
            <Coins className="w-3.5 h-3.5 fill-amber-400" />
            {quest.gold}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {onDelete && (
            <button
              onClick={() => onDelete(quest.id)}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
              title="Delete Quest"
              aria-label="Delete quest"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleComplete}
            disabled={quest.completed || isCompleting}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              quest.completed
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                : 'theme-button-primary'
            }`}
          >
            {quest.completed ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Completed</span>
              </>
            ) : (
              <>
                <Circle className="w-4 h-4 stroke-[2.5]" />
                <span>Complete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
