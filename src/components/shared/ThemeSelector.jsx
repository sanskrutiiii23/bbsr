import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { THEMES } from '../../themes/definitions';
import { Sparkles, Sword, Building2, Check, Palette, Lock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ThemeSelector = ({ isOpen, onClose, playerLevel = 1 }) => {
  const { currentTheme, switchTheme, allThemes } = useTheme();
  const [lockedNotice, setLockedNotice] = useState(null);

  const getThemeVisual = (themeId) => {
    switch (themeId) {
      case THEMES.FOREST:
        return {
          icon: Sparkles,
          gradient: 'from-emerald-950 via-emerald-800 to-green-900',
          accentColor: '#34d399',
          tag: 'Theme D',
          tagline: 'Druidic Grove & Ancient Runes',
          features: ['Bioluminescent spores', 'Elder staff druid rig', 'World Tree blooming']
        };
      case THEMES.SAMURAI:
        return {
          icon: Sword,
          gradient: 'from-zinc-950 via-neutral-900 to-red-950',
          accentColor: '#ef4444',
          tag: 'Theme E',
          tagline: 'Path of Bushido & Blood Moon',
          features: ['Falling sakura petals', 'Katana quick-draw rig', 'Torii shrine restoration']
        };
      case THEMES.CITY:
        return {
          icon: Building2,
          gradient: 'from-slate-950 via-sky-950 to-blue-900',
          accentColor: '#38bdf8',
          tag: 'Theme F',
          tagline: 'Cyber-Architect Metropolis Engine',
          features: ['Blueprint grid CAD', 'Hovering drone rig', 'Skyscraper construction']
        };
      default:
        return {
          icon: Palette,
          gradient: 'from-gray-900 to-gray-800',
          accentColor: '#ffffff',
          tag: 'Theme',
          tagline: '',
          features: []
        };
    }
  };

  const handleSelectTheme = (theme) => {
    const isLocked = playerLevel < (theme.unlockLevel || 1);
    if (isLocked) {
      setLockedNotice(`🔒 ${theme.name} is locked! Advance along the Adventure Track to Level ${theme.unlockLevel} to unlock this realm.`);
      setTimeout(() => setLockedNotice(null), 3000);
      return;
    }
    switchTheme(theme.id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Selector Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative z-10 w-full max-w-2xl rpg-card p-6 shadow-2xl overflow-hidden border border-neutral-700"
      >
        {/* Locked Alert Notice */}
        <AnimatePresence>
          {lockedNotice && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold flex items-center gap-2 rounded-sm"
            >
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>{lockedNotice}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-sm bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide uppercase">Planar Realm Matrix</h2>
              <p className="text-xs font-mono text-neutral-400">LEVEL-GATED REALM PROGRESSION • HERO LEVEL: <strong className="text-amber-400">LVL {playerLevel}</strong></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rpg-button px-3.5 py-1.5 text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider"
          >
            DISMISS [X]
          </button>
        </div>

        {/* Theme Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.keys(allThemes).map((themeKey) => {
            const theme = allThemes[themeKey];
            const isSelected = currentTheme === theme.id;
            const requiredLevel = theme.unlockLevel || 1;
            const isLocked = playerLevel < requiredLevel;
            const visual = getThemeVisual(theme.id);
            const Icon = visual.icon;

            return (
              <button
                key={theme.id}
                onClick={() => handleSelectTheme(theme)}
                className={`relative flex flex-col text-left p-4 transition-all duration-200 border overflow-hidden group active:translate-y-0.5 ${
                  isLocked
                    ? 'opacity-55 bg-black/80 border-neutral-800 hover:border-amber-500/40 cursor-pointer'
                    : isSelected
                    ? 'border-amber-400 bg-neutral-900 ring-1 ring-amber-400/40 shadow-xl'
                    : 'border-neutral-800 bg-neutral-950/80 hover:border-neutral-600'
                }`}
                style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}
              >
                {/* Active check badge */}
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-1.5 py-0.5 bg-amber-400 text-neutral-950 text-[9px] font-mono font-black uppercase tracking-wider">
                    <Check className="w-3 h-3 stroke-[3]" />
                    ACTIVE
                  </div>
                )}

                {/* Locked indicator badge */}
                {isLocked && (
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-1.5 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[9px] font-mono font-bold tracking-wider">
                    <Lock className="w-2.5 h-2.5" />
                    LVL {requiredLevel}
                  </div>
                )}

                {/* Tag & Unlock status */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 bg-neutral-900 text-neutral-300 border border-neutral-700">
                    {visual.tag}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">
                    {theme.unlockRequirement}
                  </span>
                </div>

                {/* Theme Icon & Title */}
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div
                    className="p-2 rounded-sm text-white border border-white/10"
                    style={{ backgroundColor: `${visual.accentColor}20` }}
                  >
                    {isLocked ? (
                      <Lock className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Icon className="w-4 h-4" style={{ color: visual.accentColor }} />
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                    {theme.name}
                  </h3>
                </div>

                <p className="text-xs text-neutral-400 mb-4 line-clamp-1">
                  {visual.tagline}
                </p>

                {/* Micro Features or Lock Status */}
                {isLocked ? (
                  <div className="mt-auto pt-3 border-t border-neutral-800 text-[10px] font-mono text-amber-300/90">
                    🔒 Progress to Level {requiredLevel} to unseal!
                  </div>
                ) : (
                  <ul className="mt-auto space-y-1 pt-3 border-t border-neutral-800 text-[10px] font-mono text-neutral-400">
                    {visual.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full" style={{ backgroundColor: visual.accentColor }} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
