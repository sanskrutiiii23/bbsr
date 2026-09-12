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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-mono font-black uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5 rounded-sm">
              <GitFork className="w-3.5 h-3.5 text-amber-400" />
              PASSIVE MATRIX & KATA
            </span>
            <span className="text-[11px] font-mono text-neutral-400">
              AUTHORITATIVE ATTRIBUTE SYSTEM
            </span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-black text-white mt-1 tracking-wide uppercase ${themeConfig.fontHeading}`}>
            {themeConfig.terminology.skills}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
            Forge permanent combat passives, streak fortresses, and cognitive flow buffs.
          </p>
        </div>

        {/* Available Skill Points Indicator */}
        <div className="rpg-card px-5 py-2.5 flex items-center gap-3 border border-amber-500/40 shadow-lg">
          <div className="w-9 h-9 rounded-sm bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[9px] uppercase font-mono font-bold tracking-widest text-amber-400/90">Skill Points Available</div>
            <div className="text-base font-mono font-black text-white">{availablePoints} SP</div>
          </div>
        </div>
      </div>

      {/* Branch Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedBranch('all')}
          className={`px-3.5 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-all border ${
            selectedBranch === 'all'
              ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-md font-black'
              : 'text-neutral-400 hover:text-white bg-neutral-900/80 border-neutral-800 hover:border-neutral-700'
          }`}
        >
          All Disciplines
        </button>

        {Object.entries(branchMetadata).map(([key, meta]) => {
          const Icon = meta.icon;
          const isSelected = selectedBranch === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedBranch(key)}
              className={`flex items-center gap-2 px-3.5 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-all border ${
                isSelected
                  ? `${meta.bg} ${meta.color} border-current shadow-md font-black`
                  : 'text-neutral-400 hover:text-white bg-neutral-900/80 border-neutral-800 hover:border-neutral-700'
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
              className={`rpg-card p-5 relative overflow-hidden transition-all duration-200 ${
                skill.unlocked ? 'border-neutral-700/80' : 'opacity-60 bg-neutral-950/60 border-neutral-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-sm flex items-center justify-center border ${
                      skill.unlocked
                        ? `${meta.bg} ${meta.color} ${meta.border}`
                        : 'bg-neutral-900 text-neutral-600 border-neutral-800'
                    }`}
                  >
                    {skill.unlocked ? <Icon className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-mono font-black uppercase tracking-wider ${meta.color}`}>
                        {skill.branch}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">
                        RANK {skill.level} / {skill.maxLevel}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                      {skill.name}
                    </h3>
                  </div>
                </div>

                {/* Level Pips */}
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: skill.maxLevel }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-3 rounded-xs border ${
                        i < skill.level
                          ? 'bg-amber-400 border-amber-300 shadow-[0_0_6px_#f59e0b]'
                          : 'bg-black/60 border-neutral-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-neutral-300/80 mb-4 leading-relaxed font-sans">
                {skill.description}
              </p>

              {/* Action Controls */}
              <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
                <span className="text-[11px] font-mono font-semibold text-neutral-400">
                  {isMax ? (
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> MAXIMUM MASTERY
                    </span>
                  ) : (
                    <span>REQUIREMENT: 1 SP</span>
                  )}
                </span>

                <button
                  onClick={() => handleUpgrade(skill)}
                  disabled={!canUpgrade || upgradingId === skill.id}
                  className={`px-3.5 py-1.5 text-[11px] font-mono font-black uppercase tracking-wider transition-all ${
                    isMax
                      ? 'bg-neutral-900 text-neutral-600 cursor-not-allowed border border-neutral-800'
                      : canUpgrade
                      ? 'rpg-button-primary shadow-md active:translate-y-0.5'
                      : 'bg-neutral-900 text-neutral-500 cursor-not-allowed border border-neutral-800'
                  }`}
                >
                  {isMax ? 'MASTERED' : skill.level === 0 ? 'UNLOCK KATA' : 'UPGRADE +1'}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
