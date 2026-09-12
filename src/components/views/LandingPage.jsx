import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { THEMES } from '../../themes/definitions';
import { sound } from '../../utils/soundEffects';
import {
  Sparkles,
  Sword,
  Building2,
  CheckCircle2,
  Shield,
  Zap,
  Flame,
  ArrowRight,
  ChevronDown,
  Play,
  Award,
  Layers,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LandingPage = ({ onEnterApp, onOpenThemeSelector }) => {
  const { currentTheme, themeConfig } = useTheme();
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: 'How does the RPG progression and XP system work?',
      a: 'Every time you complete a real-world task—whether coding, exercising, or reading—our server-authoritative engine awards XP and Gold based on difficulty. As your XP grows, your level advances via Level = floor(sqrt(XP / 100)) + 1, granting Skill Points to unlock passive buffs.'
    },
    {
      q: 'Can I freely switch between the 3 Themes (Forest, Samurai, City)?',
      a: 'Yes! You can switch themes at any moment from the theme switcher. Your character stats, inventory, and completed quests remain completely synchronized across all three distinct visual worlds.'
    },
    {
      q: 'How do World Boss Raids work?',
      a: 'Each theme features a terrifying raid boss (such as Malakor the Blight Treant or Kurokage the Shadow Shogun). Every quest you complete inflicts 100% of the quest XP as direct critical damage against the boss. When the boss falls below 40% HP, it enters an enraged phase!'
    },
    {
      q: 'Is my data saved automatically?',
      a: 'Yes. All character attributes, quest streaks, inventory, and realm construction progress are persistently saved via localStorage with automatic fallback sync.'
    },
    {
      q: 'Is Life RPG mobile responsive?',
      a: 'Absolutely. Every view, character animation rig, and quest modal is engineered with responsive Tailwind CSS and touch-friendly controls across desktop, tablet, and mobile screens.'
    }
  ];

  return (
    <div className="space-y-16 py-6 max-w-5xl mx-auto">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-8 pb-12 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-neutral-200">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Gamified Productivity & Habit Tracking Engine</span>
        </div>

        <h1 className={`text-4xl sm:text-6xl font-black text-white tracking-tight max-w-3xl mx-auto leading-[1.15] ${themeConfig.fontHeading}`}>
          Turn Your Real-Life Goals into an <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-amber-300 to-cyan-400">Epic RPG</span>
        </h1>

        <p className="text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed">
          Level up your habits, conquer procrastination, slay colossal raid bosses, and expand your realm with three immersive master themes.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => {
              sound.playLevelUp();
              onEnterApp();
            }}
            className="theme-button-primary px-8 py-4 text-base font-black flex items-center gap-3 shadow-2xl hover:scale-105 active:scale-95"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>Enter The Realm (Launch App)</span>
          </button>

          <button
            onClick={onOpenThemeSelector}
            className="px-6 py-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm font-bold flex items-center gap-2 transition-all hover:scale-105"
          >
            <span>Explore Themes (D, E, F)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-neutral-400 pt-6">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Server-Authoritative Math
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Zero Audio Lag Synthesizer
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 60fps Vector Rig Animations
          </span>
        </div>
      </section>

      {/* 3 Master Themes Showcase */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
            Tech Member 2 Design System
          </span>
          <h2 className={`text-2xl sm:text-3xl font-black text-white ${themeConfig.fontHeading}`}>
            Three Distinct Master Worlds
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto">
            Switch between entirely different artistic aesthetics, soundscapes, typography, and visual perks at any time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Theme D */}
          <div className="theme-card p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                Theme D
              </span>
              <h3 className="text-lg font-bold text-white">Enchanted Forest</h3>
              <p className="text-xs text-neutral-300/80 mt-1">
                Druidic nature fantasy with ancient rune circles, bioluminescent spores, and the growing World Tree.
              </p>
            </div>
            <ul className="text-xs text-neutral-300 space-y-1.5 pt-2 border-t border-white/10">
              <li>• Hero: Sylva the Verdant Archdruid</li>
              <li>• Boss: Malakor the Blight Treant</li>
              <li>• SFX: Mystical woodwind chime</li>
            </ul>
          </div>

          {/* Theme E */}
          <div className="theme-card p-6 rounded-2xl border border-red-500/30 bg-red-950/20 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <Sword className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-red-400">
                Theme E
              </span>
              <h3 className="text-lg font-bold text-white">Last Samurai Standing</h3>
              <p className="text-xs text-neutral-300/80 mt-1">
                Bushido feudal Japan aesthetic with falling cherry blossom petals, sumi-e ink wash, and katana slashes.
              </p>
            </div>
            <ul className="text-xs text-neutral-300 space-y-1.5 pt-2 border-t border-white/10">
              <li>• Hero: Jin the Wandering Ronin</li>
              <li>• Boss: Kurokage Shadow Shogun</li>
              <li>• SFX: Razor-sharp Katana swoosh</li>
            </ul>
          </div>

          {/* Theme F */}
          <div className="theme-card p-6 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                Theme F
              </span>
              <h3 className="text-lg font-bold text-white">Build Your City</h3>
              <p className="text-xs text-neutral-300/80 mt-1">
                Isometric cyber-construction with blueprint gridlines, autonomous tower cranes, and rising skyscrapers.
              </p>
            </div>
            <ul className="text-xs text-neutral-300 space-y-1.5 pt-2 border-t border-white/10">
              <li>• Hero: Alex the Cyber Architect</li>
              <li>• Boss: Titan OVERLOAD-9</li>
              <li>• SFX: Hydraulic welding pulse</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className={`text-2xl sm:text-3xl font-black text-white ${themeConfig.fontHeading}`}>
            How Life RPG Transforms Productivity
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            Three simple steps to break the cycle of procrastination forever.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Forge Your Quests',
              desc: 'Log daily habits, deep work blocks, and epic fitness goals. Each quest is categorized with custom XP and gold stakes.'
            },
            {
              step: '02',
              title: 'Strike & Slay Bosses',
              desc: 'Check off your tasks in real life. Completing quests deals heavy damage to World Raid Bosses and fuels your daily streak.'
            },
            {
              step: '03',
              title: 'Ascend & Expand',
              desc: 'Spend Skill Points in branching trees, equip legendary relics, and watch your sacred grove or cyber city rise.'
            }
          ].map((item, idx) => (
            <div key={idx} className="theme-card p-6 rounded-2xl relative">
              <div className="text-3xl font-black text-white/20 mb-2 font-mono">
                {item.step}
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">
                {item.title}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className={`text-2xl sm:text-3xl font-black text-white ${themeConfig.fontHeading}`}>
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            Everything you need to know about the Life RPG system.
          </p>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="theme-card rounded-xl border border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 transition-colors hover:bg-white/5"
                >
                  <span className="text-sm font-bold text-white">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4 pt-1 text-xs text-neutral-300/80 leading-relaxed border-t border-white/5"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="theme-card p-8 sm:p-12 text-center rounded-3xl space-y-4 border border-amber-500/30">
        <h2 className={`text-3xl sm:text-4xl font-black text-white ${themeConfig.fontHeading}`}>
          Ready to Begin Your Adventure?
        </h2>
        <p className="text-sm text-neutral-300 max-w-md mx-auto">
          Take command of your hero, embark on sacred bounties, and conquer your goals today.
        </p>
        <button
          onClick={() => {
            sound.playLevelUp();
            onEnterApp();
          }}
          className="theme-button-primary px-8 py-4 text-base font-black inline-flex items-center gap-3 shadow-2xl hover:scale-105 active:scale-95"
        >
          <Play className="w-5 h-5 fill-white" />
          <span>Launch Life RPG</span>
        </button>
      </section>
    </div>
  );
};
