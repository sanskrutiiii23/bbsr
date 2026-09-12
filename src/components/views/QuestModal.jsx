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
    <Modal isOpen={isOpen} onClose={onClose} title={`Forge New ${themeConfig.terminology.quest}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
            Quest Objective
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Code API endpoints for 60 min, Run 5k, Meditate..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
            Lore & Notes (Optional)
          </label>
          <textarea
            rows="2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Specific deliverables or conditions to achieve victory..."
            className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/15 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <option value="work">Work & Code</option>
              <option value="study">Study & Mind</option>
              <option value="fitness">Fitness & Body</option>
              <option value="health">Health & Vitality</option>
              <option value="epic">Epic Milestone</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/15 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
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
            className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-emerald-500 focus:ring-emerald-400 focus:ring-offset-0"
          />
          <label htmlFor="isDaily" className="text-xs text-neutral-300 select-none cursor-pointer">
            Recurring Daily Habit (builds streak counter)
          </label>
        </div>

        {/* Expected Rewards summary banner */}
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs font-medium">
          <span className="text-neutral-400">Authoritative Rewards:</span>
          <div className="flex items-center gap-3 font-bold">
            <span className="text-emerald-400">+{difficultyRewards[difficulty].xp} XP</span>
            <span className="text-amber-400">+{difficultyRewards[difficulty].gold} Gold</span>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="theme-button-primary px-5 py-2 text-xs font-bold flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Engrave Quest</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
