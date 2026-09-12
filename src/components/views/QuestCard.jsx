import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Badge } from '../shared/Badge';
import { sound, audioEngine } from '../../utils/soundEffects';
import { CheckCircle2, Circle, Flame, Coins, Zap, Trash2, Star, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const QuestCard = ({ quest, onComplete, onDelete }) => {
  const { themeConfig } = useTheme();
  const [isCompleting, setIsCompleting] = useState(false);
  const [rewardPopup, setRewardPopup] = useState(null);

  const handleComplete = async () => {
    if (quest.completed || isCompleting) return;
    setIsCompleting(true);

    try {
      audioEngine.playQuestComplete(themeConfig.id);
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

  const difficultyStars = {
    easy: 1,
    medium: 2,
    hard: 3,
    epic: 4
  }[quest.difficulty] || 1;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`theme-card p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 relative group ${
        quest.completed
          ? 'opacity-60 bg-black/40 border-neutral-800'
          : 'hover:-translate-y-1 hover:border-white/30'
      }`}
    >
      {/* Floating Reward Animation */}
      <AnimatePresence>
        {rewardPopup && (
          <motion.div
            key={rewardPopup.id}
            initial={{ opacity: 0, y: 5, scale: 0.8 }}
            animate={{ opacity: 1, y: -45, scale: 1.15 }}
            exit={{ opacity: 0 }}
            className="absolute z-30 top-2 right-4 flex items-center gap-3 px-3 py-1 rounded-sm bg-black border border-amber-400 text-xs font-black shadow-2xl"
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
        {/* Top Header: Category & Difficulty Stars */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Badge variant={quest.category} size="sm">
              {quest.category}
            </Badge>

            {/* Difficulty Rating Stars */}
            <div className="flex items-center gap-0.5 text-amber-400" title={`Difficulty: ${quest.difficulty}`}>
              {Array.from({ length: difficultyStars }).map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
              ))}
            </div>

            {quest.isDaily && (
              <span className="text-[9px] font-mono uppercase font-bold text-sky-300 bg-sky-950/60 px-2 py-0.5 rounded-sm border border-sky-500/30">
                Daily Duty
              </span>
            )}
          </div>

          {quest.streak > 0 && (
            <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-orange-400 bg-orange-950/40 px-2 py-0.5 rounded-sm border border-orange-500/30">
              <Flame className="w-3 h-3 fill-orange-500" />
              <span>{quest.streak} STREAK</span>
            </div>
          )}
        </div>

        {/* Quest Title */}
        <h4 className={`text-base font-bold text-white mb-1.5 leading-snug tracking-wide ${
          quest.completed ? 'line-through text-neutral-400' : ''
        }`}>
          {quest.title}
        </h4>

        {/* Description */}
        {quest.description && (
          <p className="text-xs text-neutral-300/80 mb-4 line-clamp-2 leading-relaxed font-normal">
            {quest.description}
          </p>
        )}
      </div>

      {/* Footer: Tangible Reward Chips & Seal Action */}
      <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-auto">
        {/* Rewards pill */}
        <div className="flex items-center gap-3 text-xs font-mono font-bold">
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
          {onDelete && !quest.completed && (
            <button
              onClick={() => onDelete(quest.id)}
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:text-red-400 text-neutral-500 transition-opacity"
              title="Abandon Quest"
              aria-label="Delete quest"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={handleComplete}
            disabled={quest.completed || isCompleting}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-all ${
              quest.completed
                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 rounded-sm cursor-default'
                : 'theme-button-primary'
            }`}
          >
            {quest.completed ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>CLEARED</span>
              </>
            ) : (
              <>
                <Circle className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>CLAIM</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
