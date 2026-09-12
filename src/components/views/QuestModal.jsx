import React, { useState } from 'react';
import { Modal } from '../shared/Modal';
import { useTheme } from '../../context/ThemeContext';
import { PlusCircle, Sparkles } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export const QuestModal = ({ isOpen, onClose, onCreateQuest }) => {
  const { themeConfig } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('work');
  const [difficulty, setDifficulty] = useState('medium');
  const [isDaily, setIsDaily] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    sound.playClick();
    onCreateQuest({
      title: title.trim(),
      description: description.trim(),
      category,
      difficulty,
      isDaily
    });

    // Reset form & close
    setTitle('');
    setDescription('');
    setCategory('work');
    setDifficulty('medium');
    setIsDaily(false);
    onClose();
  };

  const difficultyRewards = {
    easy: { xp: 50, gold: 25 },
    medium: { xp: 100, gold: 50 },
    hard: { xp: 200, gold: 100 }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`ENLIST NEW ${themeConfig.terminology.quest}`}>
      <form onSubmit={handleSubmit} className="space-y-4 font-mono">
        <div>
          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
            CONTRACT OBJECTIVE
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., SHIP BACKEND API, SPRINT 5KM, RUNIC MEDITATION..."
            className="w-full px-3 py-2 bg-black/60 border border-neutral-700 text-white placeholder-neutral-600 text-xs focus:outline-none focus:border-amber-400 rounded-sm"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
            LORE & BRIEFING (OPTIONAL)
          </label>
          <textarea
            rows="2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Specific deliverables or tactical conditions..."
            className="w-full px-3 py-2 bg-black/60 border border-neutral-700 text-white placeholder-neutral-600 text-xs focus:outline-none focus:border-amber-400 rounded-sm resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
              DOMAIN
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 text-white text-xs focus:outline-none focus:border-amber-400 rounded-sm"
            >
              <option value="work">Work & Code</option>
              <option value="study">Study & Mind</option>
              <option value="fitness">Fitness & Body</option>
              <option value="health">Health & Vitality</option>
              <option value="epic">Epic Milestone</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
              DIFFICULTY RATING
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 text-white text-xs focus:outline-none focus:border-amber-400 rounded-sm"
            >
              <option value="easy">Easy (50 XP / 25g)</option>
              <option value="medium">Medium (100 XP / 50g)</option>
              <option value="hard">Hard (200 XP / 100g)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="isDaily"
            checked={isDaily}
            onChange={(e) => setIsDaily(e.target.checked)}
            className="w-4 h-4 rounded-xs border-neutral-700 bg-neutral-900 text-amber-500 focus:ring-0"
          />
          <label htmlFor="isDaily" className="text-xs text-neutral-300 select-none cursor-pointer">
            RECURRING DAILY DISCIPLINE (BUILDS STREAK FORTRESS)
          </label>
        </div>

        {/* Expected Rewards summary banner */}
        <div className="p-3 bg-black/60 border border-neutral-800 flex items-center justify-between text-xs rounded-sm">
          <span className="text-neutral-500 text-[10px] uppercase">AUTHORITATIVE PAYOUT:</span>
          <div className="flex items-center gap-3 font-bold">
            <span className="text-emerald-400">+{difficultyRewards[difficulty].xp} EXP</span>
            <span className="text-amber-400">+{difficultyRewards[difficulty].gold} GOLD</span>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="rpg-button px-4 py-2 text-xs font-bold text-neutral-300 uppercase tracking-wider"
          >
            DISMISS
          </button>
          <button
            type="submit"
            className="rpg-button-primary px-5 py-2 text-xs font-bold flex items-center gap-1.5 uppercase tracking-wider shadow-lg active:translate-y-0.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>DISPATCH CONTRACT</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
