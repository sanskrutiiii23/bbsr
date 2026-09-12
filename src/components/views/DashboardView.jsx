import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { THEMES } from '../../themes/definitions';
import { CharacterStage } from '../character/CharacterStage';
import { ProgressBar } from '../shared/ProgressBar';
import { Badge } from '../shared/Badge';
import { sound } from '../../utils/soundEffects';
import {
  Flame,
  Zap,
  Coins,
  Gem,
  Skull,
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
  Sword,
  Building2,
  TrendingUp,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

export const DashboardView = ({
  character,
  quests,
  boss,
  realmProgress,
  onCompleteQuest,
  onNavigateTab,
  onOpenCreateQuest
}) => {
  const { currentTheme, themeConfig } = useTheme();

  const activeQuests = quests.filter((q) => !q.completed);
  const completedToday = quests.filter((q) => q.completed);
  const todayTasks = activeQuests.slice(0, 4);

  const currentBoss = boss || {
    name: themeConfig.boss.name,
    currentHp: 1200,
    maxHp: 1500,
    isEnraged: false
  };

  const progressPercent = realmProgress?.[currentTheme] || 45;

  return (
    <div className="space-y-6">
      {/* Top Hero Banner */}
      <div className="theme-card p-6 md:p-8 rounded-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-white/10 text-white border border-white/15">
                {themeConfig.code} Active Realm
              </span>
              <span className="text-xs text-neutral-300 font-semibold">
                {themeConfig.subtitle}
              </span>
            </div>
            <h1 className={`text-2xl sm:text-4xl font-black text-white tracking-wide ${themeConfig.fontHeading}`}>
              Welcome Back, {character?.name || 'Champion'}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-xl">
              Maintain your daily discipline to channel {themeConfig.terminology.xp}, level up your {themeConfig.hero.class}, and defeat {themeConfig.boss.name}.
            </p>
          </div>

          {/* Quick Metrics Capsule */}
          <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10 self-start md:self-auto">
            <div className="px-3 py-1.5 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center gap-2">
              <Flame className="w-5 h-5 fill-orange-500" />
              <div>
                <div className="text-[10px] uppercase font-bold text-orange-300/80">Streak</div>
                <div className="text-sm font-black">{character?.streak || 1} Days</div>
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center gap-2">
              <Coins className="w-5 h-5 fill-amber-400" />
              <div>
                <div className="text-[10px] uppercase font-bold text-amber-300/80">Treasury</div>
                <div className="text-sm font-black">{character?.gold || 0}</div>
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
              <Zap className="w-5 h-5 fill-emerald-400" />
              <div>
                <div className="text-[10px] uppercase font-bold text-emerald-300/80">Total Level</div>
                <div className="text-sm font-black">LVL {character?.level || 1}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column (Quests & World Progress) + Right Column (Hero Rig & Boss Raid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Today's Objectives Widget */}
          <div className="theme-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Today's Priority Objectives
                </h2>
                <p className="text-xs text-neutral-400">
                  {activeQuests.length} pending • {completedToday.length} completed today
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenCreateQuest}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition-colors"
                  title="Add Quest"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigateTab('quests')}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {todayTasks.length > 0 ? (
              <div className="space-y-2.5">
                {todayTasks.map((quest) => (
                  <div
                    key={quest.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-black/25 hover:bg-black/40 border border-white/5 transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => onCompleteQuest(quest.id)}
                        className="text-neutral-400 hover:text-emerald-400 transition-colors flex-shrink-0"
                        title="Mark Complete"
                      >
                        <Circle className="w-5 h-5 stroke-[2.5]" />
                      </button>
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-white truncate group-hover:text-emerald-200 transition-colors">
                          {quest.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold">
                            {quest.category}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-bold">
                            +{quest.xp} XP
                          </span>
                          {quest.streak > 0 && (
                            <span className="text-[10px] text-orange-400 font-bold flex items-center gap-0.5">
                              <Flame className="w-2.5 h-2.5 fill-orange-500" />
                              {quest.streak}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onCompleteQuest(quest.id)}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg theme-button-primary opacity-90 group-hover:opacity-100 flex-shrink-0"
                    >
                      Complete
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-xl bg-black/20 text-center border border-white/5">
                <p className="text-xs text-neutral-400">
                  All today's tasks completed! Create a new duty or rest in the sanctuary.
                </p>
              </div>
            )}
          </div>

          {/* World Progression Preview Widget */}
          <div className="theme-card p-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  Realm Expansion
                </span>
                <h3 className={`text-base font-bold text-white tracking-wide ${themeConfig.fontHeading}`}>
                  {themeConfig.worldProgress.title}
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('world')}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <span>Enter Realm</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-neutral-300/80 mb-3">
              {themeConfig.worldProgress.description}
            </p>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-neutral-300">{themeConfig.terminology.realmMetric}</span>
                <span className="text-emerald-400">{progressPercent}%</span>
              </div>
              <ProgressBar
                value={progressPercent}
                max={100}
                colorClass="bg-gradient-to-r from-emerald-500 to-amber-400"
              />
            </div>
          </div>

        </div>

        {/* Right Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Character Preview Rig Widget */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2 px-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Hero Presence
              </h3>
              <button
                onClick={() => onNavigateTab('character')}
                className="text-xs font-bold text-neutral-300 hover:text-white flex items-center gap-1"
              >
                <span>Gear & Stats</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <CharacterStage characterState={character} compact={true} />
          </div>

          {/* Boss Raid Alert Widget */}
          <div className="theme-card p-5 border border-red-500/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
                  <Skull className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {currentBoss.name}
                  </h4>
                  <p className="text-[11px] text-neutral-400">
                    World Raid Boss Active
                  </p>
                </div>
              </div>

              {currentBoss.isEnraged && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600/30 text-red-300 border border-red-500/50 animate-pulse">
                  ENRAGED
                </span>
              )}
            </div>

            <div className="space-y-1.5 mb-3">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-red-400 text-[11px]">HP</span>
                <span className="text-neutral-300 text-[11px]">
                  {currentBoss.currentHp} / {currentBoss.maxHp}
                </span>
              </div>
              <ProgressBar
                value={currentBoss.currentHp}
                max={currentBoss.maxHp}
                colorClass="bg-gradient-to-r from-red-600 to-red-400"
              />
            </div>

            <button
              onClick={() => onNavigateTab('boss')}
              className="w-full py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Sword className="w-3.5 h-3.5" />
              <span>Engage Boss Battle Arena</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
