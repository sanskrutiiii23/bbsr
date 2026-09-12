import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { THEMES } from '../../themes/definitions';
import { ForestDruid } from './ForestDruid';
import { SamuraiRonin } from './SamuraiRonin';
import { CyberArchitect } from './CyberArchitect';
import { audioEngine } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { Sparkles, Sword, Shield, Zap, Flame, ShieldAlert, Heart } from 'lucide-react';

export const CharacterStage = ({ characterState, onActionTriggered, compact = false }) => {
  const { currentTheme, themeConfig } = useTheme();
  const [currentAction, setCurrentAction] = useState('idle');
  const [floatingDamage, setFloatingDamage] = useState(null);

  const hero = themeConfig.hero;
  const level = characterState?.level || 1;
  const equipped = characterState?.equipped || {
    head: hero.gearSlots[0] || 'Crown of Focus',
    chest: hero.gearSlots[1] || 'Mantle of Discipline',
    weapon: hero.weapon,
    relic: hero.gearSlots[3] || 'Ancestral Crest'
  };

  const triggerAction = (actionName) => {
    setCurrentAction(actionName);

    if (actionName === 'attack') {
      audioEngine.playAttack(currentTheme);
      setFloatingDamage({ text: 'CRITICAL STRIKE!', color: 'text-amber-400', id: Date.now() });
    } else if (actionName === 'ability') {
      audioEngine.playQuestComplete(currentTheme);
      const abilityName = currentTheme === THEMES.CITY ? 'GRID SCAN OVERDRIVE' : currentTheme === THEMES.SAMURAI ? 'SHADOW STANCE KATA' : 'ANIMA BLOOM VINES';
      setFloatingDamage({ text: abilityName, color: 'text-cyan-400', id: Date.now() });
    } else if (actionName === 'meditate') {
      audioEngine.playMeditate();
      setFloatingDamage({ text: 'FOCUS ENERGY +100%', color: 'text-emerald-400', id: Date.now() });
    } else if (actionName === 'celebrate') {
      audioEngine.playLevelUp();
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.6 }
      });
      setFloatingDamage({ text: 'VICTORY ASCENSION!', color: 'text-amber-300', id: Date.now() });
    } else if (actionName === 'hit') {
      audioEngine.playHit();
      setFloatingDamage({ text: '-35 BOSS DAMAGE', color: 'text-red-400', id: Date.now() });
    } else {
      audioEngine.playClick();
    }

    if (onActionTriggered) {
      onActionTriggered(actionName);
    }

    setTimeout(() => {
      setFloatingDamage(null);
    }, 1200);

    const duration = actionName === 'celebrate' || actionName === 'meditate' ? 1400 : 750;
    setTimeout(() => {
      setCurrentAction('idle');
    }, duration);
  };

  const hotbarActions = [
    { id: 'attack', hotkey: '1', name: currentTheme === THEMES.SAMURAI ? 'Slash' : currentTheme === THEMES.CITY ? 'Weld' : 'Strike', icon: Sword, color: 'text-red-400', border: 'border-red-500/40' },
    { id: 'ability', hotkey: '2', name: currentTheme === THEMES.CITY ? 'Scan' : currentTheme === THEMES.FOREST ? 'Bloom' : 'Kata', icon: Sparkles, color: 'text-emerald-400', border: 'border-emerald-500/40' },
    { id: 'meditate', hotkey: '3', name: 'Focus', icon: Heart, color: 'text-cyan-400', border: 'border-cyan-500/40' },
    { id: 'celebrate', hotkey: '4', name: 'Salute', icon: Zap, color: 'text-amber-400', border: 'border-amber-500/40' },
    { id: 'hit', hotkey: '5', name: 'Recoil', icon: ShieldAlert, color: 'text-orange-400', border: 'border-orange-500/40' }
  ];

  return (
    <div className={`theme-card p-5 flex flex-col items-center relative overflow-hidden select-none ${compact ? 'max-w-md' : 'w-full'}`}>
      {/* Red Flash Vignette on Hit */}
      {currentAction === 'hit' && (
        <motion.div
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 bg-red-600/30 z-30 pointer-events-none"
        />
      )}

      {/* Hero Header Strip */}
      <div className="w-full flex items-center justify-between mb-2 z-10">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold uppercase tracking-wider bg-black/60 border border-white/15 text-neutral-300">
            {themeConfig.code}
          </span>
          <span className="text-xs text-neutral-300 font-semibold tracking-wide">
            {hero.class}
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold">
          <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>RANK {level}</span>
        </div>
      </div>

      {/* Floating Damage / Combat Text */}
      <AnimatePresence>
        {floatingDamage && (
          <motion.div
            key={floatingDamage.id}
            initial={{ opacity: 0, y: 15, scale: 0.8 }}
            animate={{ opacity: 1, y: -30, scale: 1.2 }}
            exit={{ opacity: 0, y: -50 }}
            className={`absolute z-40 top-14 font-black font-mono text-sm tracking-widest drop-shadow-[0_0_12px_currentColor] ${floatingDamage.color}`}
          >
            {floatingDamage.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Summoning Pedestal Stage */}
      <div className="relative py-3 flex items-center justify-center">
        {/* Ground Dais Platform */}
        <div className="absolute bottom-2 w-48 h-10 rounded-[100%] bg-black/60 border border-white/10 shadow-[0_10px_20px_rgba(0,0,0,0.8)] pointer-events-none" />

        {currentTheme === THEMES.FOREST && <ForestDruid action={currentAction} />}
        {currentTheme === THEMES.SAMURAI && <SamuraiRonin action={currentAction} />}
        {currentTheme === THEMES.CITY && <CyberArchitect action={currentAction} />}
      </div>

      {/* Character Name & Weapon */}
      <div className="text-center z-10 mt-1 mb-3">
        <h3 className={`text-xl font-bold text-white tracking-wide ${themeConfig.fontHeading}`}>
          {hero.name}
        </h3>
        <p className="text-xs text-neutral-400 flex items-center justify-center gap-1.5 mt-0.5 font-mono">
          <Sword className="w-3 h-3 text-neutral-500" />
          {hero.weapon}
        </p>
      </div>

      {/* Equipped Relic Slots Display */}
      <div className="w-full flex items-center justify-center gap-2 mb-4 z-10 overflow-x-auto pb-1">
        <div className="px-2 py-1 rounded-sm bg-black/60 border border-amber-500/40 text-[10px] text-amber-200 flex items-center gap-1 shadow-sm" title={equipped.head}>
          <span>👑</span>
          <span className="truncate max-w-[75px] font-medium">{equipped.head}</span>
        </div>
        <div className="px-2 py-1 rounded-sm bg-black/60 border border-sky-500/40 text-[10px] text-sky-200 flex items-center gap-1 shadow-sm" title={equipped.chest}>
          <span>🛡️</span>
          <span className="truncate max-w-[75px] font-medium">{equipped.chest}</span>
        </div>
        <div className="px-2 py-1 rounded-sm bg-black/60 border border-purple-500/40 text-[10px] text-purple-200 flex items-center gap-1 shadow-sm" title={equipped.relic}>
          <span>🔮</span>
          <span className="truncate max-w-[75px] font-medium">{equipped.relic}</span>
        </div>
      </div>

      {/* Tactical Game Hotbar (5 Action Slots) */}
      <div className="w-full grid grid-cols-5 gap-1.5 z-10 pt-3 border-t border-white/10">
        {hotbarActions.map((act) => {
          const Icon = act.icon;
          const isBusy = currentAction !== 'idle';
          return (
            <button
              key={act.id}
              onClick={() => triggerAction(act.id)}
              disabled={isBusy}
              className={`flex flex-col items-center justify-center p-2 rounded-sm bg-black/60 hover:bg-white/10 border transition-all relative group ${
                act.border
              } hover:border-white/40 active:translate-y-0.5 disabled:opacity-40`}
            >
              {/* Hotkey Tag */}
              <span className="absolute top-1 left-1 text-[8px] font-mono text-neutral-500 group-hover:text-neutral-300">
                {act.hotkey}
              </span>

              <Icon className={`w-4 h-4 ${act.color} mt-1 mb-1 group-hover:scale-110 transition-transform`} />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-300">
                {act.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
