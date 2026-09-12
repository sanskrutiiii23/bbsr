import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { THEMES } from '../../themes/definitions';
import { CharacterStage } from '../character/CharacterStage';
import { WalkingHeroSprite } from '../character/WalkingHeroSprite';
import { ProgressBar } from '../shared/ProgressBar';
import { Badge } from '../shared/Badge';
import { sound, audioEngine } from '../../utils/soundEffects';
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
  Plus,
  Compass,
  ShieldCheck,
  Award
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
      {/* Authentic RPG War Room & Expedition Dispatch Header */}
      <div className="theme-card p-6 md:p-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-sm text-[10px] font-mono font-bold uppercase tracking-wider bg-black/60 text-amber-300 border border-amber-500/30">
                {themeConfig.code} DISPATCH
              </span>
              <span className="text-xs text-neutral-400 font-semibold tracking-wide">
                {themeConfig.subtitle}
              </span>
            </div>

            <h1 className={`text-2xl sm:text-4xl font-black text-white tracking-wide ${themeConfig.fontHeading}`}>
              {character?.name || themeConfig.hero.name}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-xl font-normal">
              Active Class: <strong className="text-amber-300">{themeConfig.hero.class}</strong> • Strike down active duties to channel {themeConfig.terminology.xp} and slay {themeConfig.boss.name}.
            </p>
          </div>

          {/* Authentic Game HUD Status Chips */}
          <div className="flex items-center gap-2.5 bg-black/60 p-2.5 rounded-md border border-white/15 self-start md:self-auto shadow-xl">
            <div className="px-3 py-1.5 rounded-sm bg-orange-950/60 border border-orange-500/40 text-orange-400 flex items-center gap-2 shadow-inner">
              <Flame className="w-4 h-4 fill-orange-500" />
              <div>
                <div className="text-[9px] uppercase font-mono font-bold text-orange-300/80">Streak</div>
                <div className="text-xs font-mono font-black">{character?.streak || 1} Days</div>
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-sm bg-amber-950/60 border border-amber-500/40 text-amber-300 flex items-center gap-2 shadow-inner">
              <Coins className="w-4 h-4 fill-amber-400" />
              <div>
                <div className="text-[9px] uppercase font-mono font-bold text-amber-300/80">{themeConfig.terminology.currency}</div>
                <div className="text-xs font-mono font-black">{character?.gold || 0}</div>
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-sm bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 flex items-center gap-2 shadow-inner">
              <Gem className="w-4 h-4 fill-cyan-400" />
              <div>
                <div className="text-[9px] uppercase font-mono font-bold text-cyan-300/80">Gems</div>
                <div className="text-xs font-mono font-black">{character?.gems || 0}</div>
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-sm bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center gap-2 shadow-inner">
              <Zap className="w-4 h-4 fill-emerald-400" />
              <div>
                <div className="text-[9px] uppercase font-mono font-bold text-emerald-300/80">Tier</div>
                <div className="text-xs font-mono font-black">LVL {character?.level || 1}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Adventure Track Mini-Trail Widget */}
      <div className="theme-card p-4 sm:p-5 relative overflow-hidden border border-amber-500/30 bg-gradient-to-r from-amber-950/20 via-black/40 to-emerald-950/20">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3.5">
            {/* Live Walking Character Sprite */}
            <div className="p-1 rounded-md bg-black/60 border border-white/20 flex-shrink-0 shadow-lg">
              <WalkingHeroSprite
                level={character?.level || 1}
                isWalking={true}
                scale={0.8}
                direction="right"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-sm bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Level {character?.level || 1} Station
                </span>
                <span className="text-xs text-neutral-300 font-semibold font-mono">
                  {themeConfig.hero.name}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                Hero's Active Adventure Track
              </h3>
              <p className="text-[11px] text-neutral-300 font-normal">
                {character?.level < 3
                  ? `⚔️ Marching to Level 3: Unlock Theme E (Last Samurai Standing)! Only ${(character?.level === 1 ? 200 : 300) - (character?.xp || 0)} XP needed.`
                  : character?.level < 5
                  ? `🏙️ Marching to Level 5: Unlock Theme F (Build Your City)! Only ${500 - (character?.xp || 0)} XP needed.`
                  : '✨ Master Sovereign: All primary realms unlocked! Continue climbing the Apex Track.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('journey')}
            className="theme-button-primary px-4 py-2 text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap shadow-lg self-end sm:self-center"
          >
            <span>Open Track Road</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Horizontal Mini Trail with Steps */}
        <div className="relative pt-6 pb-2 px-2">
          <ProgressBar
            value={Math.min(100, (((character?.level || 1) - 1) / 4) * 100 + ((character?.progressPercent || 0) / 4))}
            max={100}
            heightClass="h-2.5"
            colorClass="bg-gradient-to-r from-emerald-500 via-amber-400 to-red-500"
          />

          {/* Milestone Flags on the Track */}
          <div className="relative flex justify-between -mt-4 text-xs font-bold pointer-events-none">
            {[
              { lvl: 1, label: 'Forest (D)', icon: '🌿' },
              { lvl: 2, label: 'Brambles', icon: '⚡' },
              { lvl: 3, label: 'Samurai (E)', icon: '⚔️' },
              { lvl: 4, label: 'Dojo', icon: '🛡️' },
              { lvl: 5, label: 'City (F)', icon: '🏙️' }
            ].map((m) => {
              const reached = (character?.level || 1) >= m.lvl;
              return (
                <div key={m.lvl} className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-sm flex items-center justify-center text-xs shadow-md border ${
                      reached
                        ? 'bg-amber-500 text-black border-amber-300 ring-2 ring-amber-400/40'
                        : 'bg-neutral-900 text-neutral-500 border-neutral-700'
                    }`}
                  >
                    <span>{m.icon}</span>
                  </div>
                  <span className={`text-[10px] font-mono mt-1 whitespace-nowrap ${reached ? 'text-amber-300 font-bold' : 'text-neutral-500'}`}>
                    {m.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column (Quests & World Progress) + Right Column (Hero Rig & Boss Raid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Today's Objectives Widget */}
          <div className="theme-card p-6">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2 tracking-wide">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Active Bounties & Daily Decrees
                </h2>
                <p className="text-xs text-neutral-400 font-mono">
                  {activeQuests.length} PENDING • {completedToday.length} CLEARED TODAY
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenCreateQuest}
                  className="p-1.5 rounded-sm bg-white/10 hover:bg-white/15 text-neutral-200 border border-white/20 transition-colors"
                  title="Forge New Quest"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigateTab('quests')}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors font-mono"
                >
                  <span>ALL BOUNTIES</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {todayTasks.length > 0 ? (
              <div className="space-y-2.5">
                {todayTasks.map((quest) => (
                  <div
                    key={quest.id}
                    className="flex items-center justify-between p-3 rounded-sm bg-black/40 hover:bg-white/[0.04] border border-white/10 transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => onCompleteQuest(quest.id)}
                        className="text-neutral-500 hover:text-emerald-400 transition-colors flex-shrink-0"
                        title="Seal as Complete"
                      >
                        <Circle className="w-5 h-5 stroke-[2]" />
                      </button>
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-white truncate group-hover:text-amber-200 transition-colors">
                          {quest.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5 font-mono text-[10px]">
                          <Badge variant={quest.category} size="sm">
                            {quest.category}
                          </Badge>
                          <span className="text-emerald-400 font-bold">
                            +{quest.xp} XP
                          </span>
                          <span className="text-amber-400 font-bold">
                            +{quest.gold} Gold
                          </span>
                          {quest.streak > 0 && (
                            <span className="text-orange-400 font-bold flex items-center gap-0.5">
                              <Flame className="w-2.5 h-2.5 fill-orange-500" />
                              {quest.streak}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onCompleteQuest(quest.id)}
                      className="text-xs font-bold px-3 py-1.5 theme-button-primary flex-shrink-0"
                    >
                      CLAIM
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-sm bg-black/40 text-center border border-white/10">
                <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                <h4 className="text-sm font-bold text-white">All Active Rites Completed</h4>
                <p className="text-xs text-neutral-400 mt-1">
                  You have cleared all pending bounties. Rest in the sanctuary or forge a new quest.
                </p>
              </div>
            )}
          </div>

          {/* World Progression Preview Widget */}
          <div className="theme-card p-6">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
              <div>
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-neutral-400">
                  REALM PROGRESSION
                </span>
                <h3 className={`text-base font-bold text-white tracking-wide ${themeConfig.fontHeading}`}>
                  {themeConfig.worldProgress.title}
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('world')}
                className="text-xs font-mono font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <span>ENTER REALM</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <p className="text-xs text-neutral-300/80 mb-4 leading-relaxed font-normal">
              {themeConfig.worldProgress.description}
            </p>

            <ProgressBar
              value={progressPercent}
              max={100}
              label={themeConfig.terminology.realmMetric}
              showValue={true}
              heightClass="h-3"
              colorClass="bg-gradient-to-r from-emerald-600 via-cyan-500 to-amber-400"
            />
          </div>

        </div>

        {/* Right Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Character Preview Rig Widget */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2 px-1">
              <h3 className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                ACTIVE HERO RIG
              </h3>
              <button
                onClick={() => onNavigateTab('character')}
                className="text-xs font-mono font-bold text-neutral-300 hover:text-white flex items-center gap-1"
              >
                <span>GEAR & STATS</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <CharacterStage characterState={character} compact={true} />
          </div>

          {/* Boss Raid Alert Widget */}
          <div className="theme-card p-5 border border-red-500/40 bg-gradient-to-b from-red-950/20 to-black/60">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-red-500/20">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-sm bg-red-950 text-red-400 border border-red-500/50">
                  <Skull className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {currentBoss.name}
                  </h4>
                  <p className="text-[10px] font-mono text-neutral-400 uppercase">
                    World Raid Boss Active
                  </p>
                </div>
              </div>

              {currentBoss.isEnraged && (
                <span className="px-2 py-0.5 rounded-sm text-[9px] font-mono font-black bg-red-600/40 text-red-300 border border-red-500/60 animate-pulse">
                  ENRAGED PHASE
                </span>
              )}
            </div>

            <div className="space-y-1.5 mb-3">
              <ProgressBar
                value={currentBoss.currentHp}
                max={currentBoss.maxHp}
                label="BOSS VITALITY"
                showValue={true}
                heightClass="h-3"
                colorClass="bg-gradient-to-r from-red-700 via-orange-600 to-red-500"
              />
            </div>

            <button
              onClick={() => onNavigateTab('boss')}
              className="w-full py-2.5 rounded-sm bg-red-950/80 hover:bg-red-900/80 border border-red-500/40 text-red-200 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors shadow-lg"
            >
              <Sword className="w-3.5 h-3.5" />
              <span>ENGAGE BOSS ARENA</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
