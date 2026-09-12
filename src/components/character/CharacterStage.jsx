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

    // Auto reset to idle after animation
    const duration = actionName === 'celebrate' || actionName === 'meditate' ? 1400 : 750;
    setTimeout(() => {
      setCurrentAction('idle');
    }, duration);
  };

  return (
    <div className={`theme-card p-6 flex flex-col items-center relative overflow-hidden ${compact ? 'max-w-md' : 'w-full'}`}>
      {/* Red Flash Vignette on Hit */}
      {currentAction === 'hit' && (
        <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 bg-red-600/30 z-30 pointer-events-none"
        />
      )}

      {/* Theme Watermark / Header Badge */}
      <div className="w-full flex items-center justify-between mb-2 z-10">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 border border-white/10 text-neutral-200">
            {themeConfig.code}
          </span>
          <span className="text-xs text-neutral-400 font-medium tracking-wide">
            {hero.class}
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
          <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>LVL {level}</span>
        </div>
      </div>

      {/* Floating Damage / Combat Text */}
      <AnimatePresence>
        {floatingDamage && (
          <motion.div
            key={floatingDamage.id}
            initial={{ opacity: 0, y: 15, scale: 0.8 }}
            animate={{ opacity: 1, y: -30, scale: 1.25 }}
            exit={{ opacity: 0, y: -50 }}
            className={`absolute z-40 top-14 font-black text-sm tracking-widest drop-shadow-[0_0_12px_currentColor] ${floatingDamage.color}`}
          >
            {floatingDamage.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Rig Stage Container */}
      <div className="relative py-2 flex items-center justify-center">
        {currentTheme === THEMES.FOREST && <ForestDruid action={currentAction} />}
        {currentTheme === THEMES.SAMURAI && <SamuraiRonin action={currentAction} />}
        {currentTheme === THEMES.CITY && <CyberArchitect action={currentAction} />}
      </div>

      {/* Character Name & Weapon */}
      <div className="text-center z-10 mt-1 mb-3">
        <h3 className={`text-xl font-bold text-white tracking-wide ${themeConfig.fontHeading}`}>
          {hero.name}
        </h3>
        <p className="text-xs text-neutral-400 flex items-center justify-center gap-1.5 mt-0.5">
          <Sword className="w-3 h-3 text-neutral-500" />
          {hero.weapon}
        </p>
      </div>

      {/* Equipped Gear Slots Preview */}
      <div className="w-full flex items-center justify-center gap-2 mb-3 z-10 overflow-x-auto pb-1">
        <div className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] text-neutral-300 flex items-center gap-1" title={equipped.head}>
          <span>👑</span>
          <span className="truncate max-w-[70px]">{equipped.head}</span>
        </div>
        <div className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] text-neutral-300 flex items-center gap-1" title={equipped.chest}>
          <span>🛡️</span>
          <span className="truncate max-w-[70px]">{equipped.chest}</span>
        </div>
        <div className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] text-neutral-300 flex items-center gap-1" title={equipped.relic}>
          <span>🔮</span>
          <span className="truncate max-w-[70px]">{equipped.relic}</span>
        </div>
      </div>

      {/* Interactive Action Control Pad (All 5 Animation States) */}
      <div className="w-full grid grid-cols-5 gap-1.5 z-10 pt-2 border-t border-white/10">
        <button
          onClick={() => triggerAction('attack')}
          disabled={currentAction !== 'idle'}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-semibold text-neutral-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          title="Trigger weapon strike action"
        >
          <Sword className="w-3.5 h-3.5 text-red-400 mb-0.5" />
          <span>{currentTheme === THEMES.SAMURAI ? 'Slash' : currentTheme === THEMES.CITY ? 'Weld' : 'Strike'}</span>
        </button>

        <button
          onClick={() => triggerAction('ability')}
          disabled={currentAction !== 'idle'}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-semibold text-neutral-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          title="Cast theme spell or scan"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 mb-0.5" />
          <span>{currentTheme === THEMES.CITY ? 'Scan' : currentTheme === THEMES.FOREST ? 'Bloom' : 'Kata'}</span>
        </button>

        <button
          onClick={() => triggerAction('meditate')}
          disabled={currentAction !== 'idle'}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-semibold text-neutral-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          title="Deep focus / Meditation charge"
        >
          <Heart className="w-3.5 h-3.5 text-cyan-400 mb-0.5" />
          <span>Meditate</span>
        </button>

        <button
          onClick={() => triggerAction('celebrate')}
          disabled={currentAction !== 'idle'}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-semibold text-neutral-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          title="Celebration / Level-up salute"
        >
          <Zap className="w-3.5 h-3.5 text-amber-400 mb-0.5" />
          <span>Victory</span>
        </button>

        <button
          onClick={() => triggerAction('hit')}
          disabled={currentAction !== 'idle'}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-semibold text-neutral-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          title="Simulate boss recoil hit"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-orange-400 mb-0.5" />
          <span>Recoil</span>
        </button>
      </div>
    </div>
  );
};
