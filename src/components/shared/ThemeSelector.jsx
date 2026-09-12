import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { THEMES } from '../../themes/definitions';
import { Sparkles, Sword, Building2, Check, Palette } from 'lucide-react';
import { motion } from 'framer-motion';

export const ThemeSelector = ({ isOpen, onClose }) => {
  const { currentTheme, switchTheme, allThemes } = useTheme();

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
        className="relative z-10 w-full max-w-2xl bg-neutral-900 border border-neutral-700 rounded-2xl p-6 shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">Theme Matrix</h2>
              <p className="text-xs text-neutral-400">Select a master theme designed by Tech Member 2</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-xs px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium transition-colors"
          >
            Done
          </button>
        </div>

        {/* Theme Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.keys(allThemes).map((themeKey) => {
            const theme = allThemes[themeKey];
            const isSelected = currentTheme === theme.id;
            const visual = getThemeVisual(theme.id);
            const Icon = visual.icon;

            return (
              <button
                key={theme.id}
                onClick={() => {
                  switchTheme(theme.id);
                  onClose();
                }}
                className={`relative flex flex-col text-left rounded-xl p-4 transition-all duration-300 border overflow-hidden group ${
                  isSelected
                    ? 'border-white/80 ring-2 ring-white/30 shadow-xl scale-[1.02]'
                    : 'border-white/10 hover:border-white/30 hover:scale-[1.01]'
                } bg-gradient-to-b ${visual.gradient}`}
              >
                {/* Active check pill */}
                {isSelected && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white text-black text-[10px] font-extrabold tracking-wider">
                    <Check className="w-3 h-3 stroke-[3]" />
                    ACTIVE
                  </div>
                )}

                {/* Tag */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-black/40 text-white/90 border border-white/10">
                    {visual.tag}
                  </span>
                </div>

                {/* Theme Icon & Title */}
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div
                    className="p-2 rounded-lg text-white"
                    style={{ backgroundColor: `${visual.accentColor}25` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: visual.accentColor }} />
                  </div>
                  <h3 className="text-base font-bold text-white tracking-wide">
                    {theme.name}
                  </h3>
                </div>

                <p className="text-xs text-neutral-300/80 mb-4 line-clamp-1">
                  {visual.tagline}
                </p>

                {/* Micro Features list */}
                <ul className="mt-auto space-y-1.5 pt-3 border-t border-white/10 text-[11px] text-neutral-300">
                  {visual.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: visual.accentColor }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
