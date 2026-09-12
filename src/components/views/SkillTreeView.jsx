import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { sound } from '../../utils/soundEffects';
import {
  GitFork,
  Sparkles,
  Shield,
  Zap,
  Sword,
  Heart,
  Lock,
  Check,
  ChevronRight,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export const SkillTreeView = ({ skills, character, onAllocateSkill }) => {
  const { themeConfig } = useTheme();
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [upgradingId, setUpgradingId] = useState(null);

  const availablePoints = character?.skillPoints || 0;

  const branchMetadata = {
    strength: {
      name: 'Iron Will & Might',
      icon: Sword,
      color: 'text-red-400',
      border: 'border-red-500/30',
      bg: 'bg-red-500/10'
    },
    intelligence: {
      name: 'Flow State & Mind',
      icon: Sparkles,
      color: 'text-cyan-400',
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-500/10'
    },
    vitality: {
      name: 'Streak Fortress & Endurance',
      icon: Heart,
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/10'
    },
    agility: {
      name: 'Speed Surge & Critical Strike',
      icon: Zap,
      color: 'text-amber-400',
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/10'
    }
  };

  const handleUpgrade = async (skill) => {
    if (availablePoints <= 0 || skill.level >= skill.maxLevel || upgradingId) return;
    setUpgradingId(skill.id);
    sound.playLevelUp();
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.6 }
    });

    try {
      await onAllocateSkill(skill.id);
    } catch (e) {
      console.error(e);
    } finally {
      setUpgradingId(null);
    }
  };

  const filteredSkills = selectedBranch === 'all'
    ? skills
    : skills.filter((s) => s.branch === selectedBranch);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-white/10 text-white border border-white/15">
              Passives & Kata
            </span>
            <span className="text-xs text-neutral-400 font-semibold">
              Server-Authoritative Tree
            </span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-black text-white mt-1 tracking-wide ${themeConfig.fontHeading}`}>
            {themeConfig.terminology.skills}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
            Channel your discipline into permanent passive modifiers and attributes.
          </p>
        </div>

        {/* Available Skill Points Indicator */}
        <div className="theme-card px-5 py-3 rounded-2xl flex items-center gap-3 border border-amber-500/30 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-amber-300/80">Skill Points</div>
            <div className="text-lg font-black text-white">{availablePoints} Available</div>
          </div>
        </div>
      </div>

      {/* Branch Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedBranch('all')}
          className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
            selectedBranch === 'all'
              ? 'bg-white/20 text-white border border-white/20 shadow-md'
              : 'text-neutral-400 hover:text-white bg-black/30 border border-white/5'
          }`}
        >
          All Branches
        </button>

        {Object.entries(branchMetadata).map(([key, meta]) => {
          const Icon = meta.icon;
          const isSelected = selectedBranch === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedBranch(key)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? `${meta.bg} ${meta.color} border ${meta.border} shadow-md`
                  : 'text-neutral-400 hover:text-white bg-black/30 border border-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{meta.name}</span>
            </button>
          );
        })}
      </div>

      {/* Skill Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSkills.map((skill) => {
          const meta = branchMetadata[skill.branch] || branchMetadata.strength;
          const Icon = meta.icon;
          const isMax = skill.level >= skill.maxLevel;
          const canUpgrade = availablePoints > 0 && !isMax;

          return (
            <motion.div
              key={skill.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`theme-card p-5 relative overflow-hidden transition-all duration-200 ${
                skill.unlocked ? 'border-white/20' : 'opacity-70 bg-black/40 border-white/5'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                      skill.unlocked
                        ? `${meta.bg} ${meta.color} ${meta.border}`
                        : 'bg-white/5 text-neutral-500 border-white/10'
                    }`}
                  >
                    {skill.unlocked ? <Icon className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${meta.color}`}>
                        {skill.branch}
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        Tier {skill.level} / {skill.maxLevel}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white">
                      {skill.name}
                    </h3>
                  </div>
                </div>

                {/* Level Pips */}
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: skill.maxLevel }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2.5 h-2.5 rounded-full border ${
                        i < skill.level
                          ? 'bg-amber-400 border-amber-300 shadow-[0_0_6px_#f59e0b]'
                          : 'bg-black/50 border-white/20'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-neutral-300/80 mb-4 leading-relaxed">
                {skill.description}
              </p>

              {/* Action Controls */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <span className="text-xs font-semibold text-neutral-400">
                  {isMax ? (
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Max Mastery Reached
                    </span>
                  ) : (
                    <span>Cost: 1 Skill Point</span>
                  )}
                </span>

                <button
                  onClick={() => handleUpgrade(skill)}
                  disabled={!canUpgrade || upgradingId === skill.id}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isMax
                      ? 'bg-white/5 text-neutral-500 cursor-not-allowed border border-white/5'
                      : canUpgrade
                      ? 'theme-button-primary shadow-md hover:scale-105 active:scale-95'
                      : 'bg-white/10 text-neutral-400 cursor-not-allowed border border-white/10'
                  }`}
                >
                  {isMax ? 'Mastered' : skill.level === 0 ? 'Unlock Skill' : 'Upgrade +1'}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
