import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { THEMES } from '../../themes/definitions';
import { WalkingHeroSprite } from '../character/WalkingHeroSprite';
import { CharacterStage } from '../character/CharacterStage';
import { ProgressBar } from '../shared/ProgressBar';
import { Modal } from '../shared/Modal';
import { sound, audioEngine } from '../../utils/soundEffects';
import {
  Compass,
  MapPin,
  CheckCircle2,
  Lock,
  Sparkles,
  Sword,
  Building2,
  Award,
  Zap,
  Gift,
  Flame,
  ArrowRight,
  Shield,
  Coins,
  Gem,
  Play,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const JourneyView = ({ character, onSwitchTheme }) => {
  const { currentTheme, themeConfig } = useTheme();
  const [selectedWaypoint, setSelectedWaypoint] = useState(null);
  const [isHeroWalking, setIsHeroWalking] = useState(true);

  const currentLevel = character?.level || 1;
  const currentXp = character?.xp || 0;
  const progressPercent = character?.progressPercent || 20;

  // 8 Progressive Waypoints along the Adventure Track
  const waypoints = [
    {
      level: 1,
      name: 'The Sacred Grove of Beginnings',
      realm: 'Enchanted Forest',
      themeId: THEMES.FOREST,
      isThemeUnlock: true,
      rewardTitle: 'Starter Realm: Theme D Unlocked',
      description: 'The ancient roots awaken. Sylva the Druid takes up the Runed Elder Staff to cleanse the corrupted blighted lands.',
      rewards: ['Theme D: Enchanted Forest', 'Elder Staff of Yggdrasil', 'Rookie Adventurer Title'],
      icon: Sparkles,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/20',
      border: 'border-emerald-500/40'
    },
    {
      level: 2,
      name: 'Whispering Bramble Path',
      realm: 'Enchanted Forest',
      isThemeUnlock: false,
      rewardTitle: 'Elixir of Clarity & Flow State',
      description: 'Deep within the thorn thicket, ancient spirits bestow heightened focus and cognitive clarity upon diligent champions.',
      rewards: ['+1 Skill Point', 'Elixir of Clarity Consumable', '+50 Spirit Dew Gold'],
      icon: Zap,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/20',
      border: 'border-cyan-500/40'
    },
    {
      level: 3,
      name: 'Summit of the Vermilion Torii',
      realm: 'Last Samurai Standing',
      themeId: THEMES.SAMURAI,
      isThemeUnlock: true,
      rewardTitle: 'GRAND UNLOCK: Theme E (Last Samurai)',
      description: 'You cross the blood moon threshold into feudal Japan. Unlocks Jin the Master Ronin and the path of Bushido honor.',
      rewards: ['Theme E: Last Samurai Standing', 'Twin Muramasa Katana Blades', 'Wandering Ronin Title'],
      icon: Sword,
      color: 'text-red-400',
      bg: 'bg-red-500/20',
      border: 'border-red-500/50'
    },
    {
      level: 4,
      name: 'Ancestral Bamboo Dojo Sanctum',
      realm: 'Last Samurai Standing',
      isThemeUnlock: false,
      rewardTitle: 'Crimson Menpo & Streak Fortress',
      description: 'Disciplined training in the mountain dojo grants legendary defense against procrastination and missed habits.',
      rewards: ['Crimson Menpo War Mask', 'Streak Fortress Shield Perk', '+100 Koban Gold'],
      icon: Shield,
      color: 'text-amber-400',
      bg: 'bg-amber-500/20',
      border: 'border-amber-500/40'
    },
    {
      level: 5,
      name: 'Cyber Frontier Metropolis Megagrid',
      realm: 'Build Your City',
      themeId: THEMES.CITY,
      isThemeUnlock: true,
      rewardTitle: 'GRAND UNLOCK: Theme F (Build Your City)',
      description: 'A colossal quantum skyline unfolds. Unlocks Alex the Cyber Architect, holographic tablet tools, and skyscraper construction.',
      rewards: ['Theme F: Build Your City', 'Autonomous Hover Drone Companion', 'Lead Grid Engineer Title'],
      icon: Building2,
      color: 'text-cyan-300',
      bg: 'bg-cyan-500/25',
      border: 'border-cyan-500/60'
    },
    {
      level: 6,
      name: 'Neon Skyway Megatower Spire',
      realm: 'Build Your City',
      isThemeUnlock: false,
      rewardTitle: 'Plasma Beam Welder & Arcane Gems',
      description: 'Connecting high-density urban sectors with superconductor mag-lev rails, boosting city output and energy reserves.',
      rewards: ['Plasma Beam Welder', '+15 Arcane Gems', '+1 Skill Point'],
      icon: Award,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/20',
      border: 'border-yellow-500/40'
    },
    {
      level: 7,
      name: 'Titan Overload Power Mainframe',
      realm: 'All Realms',
      isThemeUnlock: false,
      rewardTitle: 'Titan Overdrive Boss Slayer Perk',
      description: 'Harness the industrial pulse of fallen titans to deal 200% critical damage across all World Raid Encounters.',
      rewards: ['2x Boss Critical Multiplier', 'Titan Reactor Relic', '+200 Gold'],
      icon: Flame,
      color: 'text-orange-400',
      bg: 'bg-orange-500/20',
      border: 'border-orange-500/40'
    },
    {
      level: 8,
      name: 'Mastery Citadel of Realms',
      realm: 'All Realms',
      isThemeUnlock: false,
      rewardTitle: 'Archon of Multiverse Title',
      description: 'The convergence point where forest druidry, samurai honor, and cybernetic architecture harmonize in perfect unison.',
      rewards: ['Archon Grandmaster Title', '+3 Skill Points', '+25 Arcane Gems'],
      icon: Gift,
      color: 'text-purple-400',
      bg: 'bg-purple-500/20',
      border: 'border-purple-500/40'
    }
  ];

  const handleWaypointClick = (wp) => {
    sound.playClick();
    setSelectedWaypoint(wp);
  };

  const nextThemeWaypoint = waypoints.find((w) => w.isThemeUnlock && w.level > currentLevel);

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-mono font-black uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5 rounded-sm">
              <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
              EXPEDITION CARTOGRAPHY
            </span>
            <span className="text-[11px] font-mono text-neutral-400">
              SECTOR ROADMAP • LEVEL GATED
            </span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-black text-white mt-1 tracking-wide uppercase ${themeConfig.fontHeading}`}>
            Ascension Road & Realm Gates
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
            Your vanguard hero advances with every completed quest, unlocking high-tier realms and armaments.
          </p>
        </div>

        {/* Step Controls */}
        <button
          onClick={() => {
            sound.playClick();
            setIsHeroWalking(!isHeroWalking);
          }}
          className="rpg-button px-4 py-2 text-xs font-mono font-bold text-white flex items-center gap-2 self-start sm:self-auto uppercase tracking-wider"
        >
          <span>{isHeroWalking ? '🚶 MARCHING [ACTIVE]' : '🧍 STANCE [HOLD]'}</span>
        </button>
      </div>

      {/* PROMINENT HERO STAGE SHOWCASE BANNER */}
      <div className="rpg-card p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl pointer-events-none" />
        <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6 relative z-10">
          
          {/* Left: Walking Character Live Rig */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-5 rounded-md bg-black/60 border border-neutral-700/60 shadow-inner relative">
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 mb-2 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Vanguard Hero In Transit</span>
            </div>

            {/* Character Stage with Walking Sprite */}
            <div className="relative py-2 flex items-center justify-center">
              <WalkingHeroSprite
                level={currentLevel}
                isWalking={isHeroWalking}
                scale={1.3}
                direction="right"
              />
            </div>

            <div className="text-center mt-3 pt-2 border-t border-neutral-800 w-full">
              <h4 className="text-sm font-bold text-white tracking-wider uppercase">
                {themeConfig.hero.name}
              </h4>
              <p className="text-[11px] font-mono text-neutral-400">
                {themeConfig.hero.class} • {themeConfig.name}
              </p>
            </div>
          </div>

          {/* Right: Adventure Stats & Next Unlock Info */}
          <div className="md:col-span-7 space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-mono font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-sm">
                  WAYPOINT {currentLevel} OF {waypoints.length}
                </span>
                <span className="text-[11px] font-mono text-neutral-400">
                  {character?.xp || 0} CUMULATIVE EXP
                </span>
              </div>
              <h3 className={`text-xl sm:text-2xl font-black text-white mt-1.5 ${themeConfig.fontHeading}`}>
                {waypoints[Math.min(waypoints.length - 1, currentLevel - 1)]?.name}
              </h3>
              <p className="text-xs text-neutral-300/90 mt-1 leading-relaxed">
                {waypoints[Math.min(waypoints.length - 1, currentLevel - 1)]?.description}
              </p>
            </div>

            {/* Progress to next checkpoint */}
            <div className="p-4 rounded-md bg-black/50 border border-neutral-700/60 space-y-2">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-neutral-400 uppercase tracking-wider">Waypoint {currentLevel} Sector Sync</span>
                <span className="text-amber-400">{progressPercent}%</span>
              </div>
              <ProgressBar
                value={progressPercent}
                max={100}
                heightClass="h-3"
                colorClass="bg-gradient-to-r from-emerald-500 via-amber-500 to-amber-400"
              />
              {nextThemeWaypoint && (
                <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-amber-300/90">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Next Realm: <strong className="text-white">{nextThemeWaypoint.realm}</strong></span>
                  </span>
                  <span className="font-bold text-amber-400">GATE OPENS AT LVL {nextThemeWaypoint.level}</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Main Interactive Adventure Path */}
      <div className="rpg-card p-6 md:p-8 relative">
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400" />
            <h2 className={`text-base sm:text-lg font-bold text-white tracking-wide uppercase ${themeConfig.fontHeading}`}>
              Expedition Sector Checkpoints (Lvl 1 — 8)
            </h2>
          </div>
          <span className="text-[11px] font-mono text-neutral-400">
            [TAP NODE TO INSPECT LOOT]
          </span>
        </div>

        {/* Winding Road */}
        <div className="relative max-w-2xl mx-auto py-4 space-y-10">
          {/* Glowing Center Trail Line */}
          <div className="absolute left-8 sm:left-1/2 top-4 bottom-4 w-1 -translate-x-1/2 bg-gradient-to-b from-emerald-500 via-red-500 to-cyan-500 opacity-30 rounded-full" />

          {waypoints.map((wp, index) => {
            const isCompleted = currentLevel > wp.level;
            const isCurrent = currentLevel === wp.level;
            const isLocked = currentLevel < wp.level;
            const Icon = wp.icon;
            const isEven = index % 2 === 0;

            return (
              <div
                key={wp.level}
                className={`relative flex items-center gap-6 sm:gap-10 ${
                  isEven ? 'sm:flex-row' : 'sm:flex-row-reverse'
                }`}
              >
                {/* Node Checkpoint Monolith */}
                <div className="relative z-10 flex-shrink-0 left-8 sm:left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <button
                    onClick={() => handleWaypointClick(wp)}
                    className={`w-14 h-14 sm:w-16 sm:h-16 flex flex-col items-center justify-center transition-all duration-200 shadow-xl border-2 active:translate-y-0.5 ${
                      isCurrent
                        ? 'bg-neutral-900 border-amber-400 scale-110 shadow-[0_0_20px_rgba(245,158,11,0.5)] ring-2 ring-amber-400/30'
                        : isCompleted
                        ? 'bg-neutral-900 border-emerald-500 text-emerald-400 hover:border-emerald-400'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-600 hover:border-neutral-600'
                    }`}
                    style={{ clipPath: 'polygon(12% 0, 88% 0, 100% 12%, 100% 88%, 88% 100%, 12% 100%, 0 88%, 0 12%)' }}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : isCurrent ? (
                      <Icon className={`w-6 h-6 ${wp.color} animate-pulse`} />
                    ) : (
                      <Lock className="w-4 h-4 text-neutral-600" />
                    )}
                    <span className="text-[9px] font-mono font-black mt-0.5 tracking-wider">
                      LV.{wp.level}
                    </span>
                  </button>

                  {/* Beacon Pill under current node */}
                  {isCurrent && (
                    <div className="mt-2 px-2 py-0.5 bg-amber-500 text-neutral-950 text-[9px] font-mono font-black uppercase tracking-widest shadow-lg whitespace-nowrap animate-bounce rounded-xs">
                      CURRENT
                    </div>
                  )}
                </div>

                {/* Milestone Info Card */}
                <div
                  onClick={() => handleWaypointClick(wp)}
                  className={`flex-1 p-4 border transition-all cursor-pointer group ml-14 sm:ml-0 ${
                    isCurrent
                      ? 'bg-neutral-900/90 border-amber-500/60 shadow-xl'
                      : isCompleted
                      ? 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-600'
                      : 'bg-neutral-950/40 border-neutral-900 opacity-60 hover:opacity-85'
                  }`}
                  style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[9px] font-mono font-black uppercase tracking-wider px-2 py-0.5 border ${
                        wp.isThemeUnlock ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                      }`}>
                        {wp.isThemeUnlock ? '⭐ REALM GATE UNLOCK' : `WAYPOINT ${wp.level}`}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">
                        {wp.realm}
                      </span>
                    </div>

                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                      isCompleted ? 'text-emerald-400' : isCurrent ? 'text-amber-400' : 'text-neutral-600'
                    }`}>
                      {isCompleted ? '[CLEARED]' : isCurrent ? '[ACTIVE]' : `[LOCK L.${wp.level}]`}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors uppercase tracking-wide">
                    {wp.name}
                  </h3>

                  <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                    {wp.description}
                  </p>

                  <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-neutral-800 text-xs">
                    <span className="text-emerald-400 font-mono font-bold flex items-center gap-1.5 text-[11px]">
                      <Gift className="w-3.5 h-3.5" />
                      {wp.rewardTitle}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Waypoint Detail Modal */}
      <Modal
        isOpen={!!selectedWaypoint}
        onClose={() => setSelectedWaypoint(null)}
        title={selectedWaypoint?.name || 'Waypoint Details'}
      >
        {selectedWaypoint && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs text-neutral-400">
                Required Level: <strong className="text-amber-400">LVL {selectedWaypoint.level}</strong>
              </span>
              <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                currentLevel >= selectedWaypoint.level ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-neutral-400'
              }`}>
                {currentLevel >= selectedWaypoint.level ? '✓ Unlocked' : '🔒 Locked'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {selectedWaypoint.description}
            </p>

            {/* Unlocked Rewards List */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Gift className="w-4 h-4" />
                Checkpoint Rewards
              </h4>
              <ul className="space-y-1.5 text-xs text-neutral-200">
                {selectedWaypoint.rewards.map((r, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Action if it's an unlocked theme */}
            {selectedWaypoint.isThemeUnlock && currentLevel >= selectedWaypoint.level && (
              <button
                onClick={() => {
                  onSwitchTheme(selectedWaypoint.themeId);
                  setSelectedWaypoint(null);
                }}
                className="theme-button-primary w-full py-2.5 text-xs font-bold shadow-lg"
              >
                Switch to {selectedWaypoint.realm} Realm Now
              </button>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
