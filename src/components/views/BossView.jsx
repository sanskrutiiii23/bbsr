import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { THEMES } from '../../themes/definitions';
import { sound } from '../../utils/soundEffects';
import { ProgressBar } from '../shared/ProgressBar';
import { Skull, Zap, ShieldAlert, Award, Flame, Sword, Sparkles, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export const BossView = ({ boss, onAttackBoss, character }) => {
  const { currentTheme, themeConfig } = useTheme();
  const [isAttacking, setIsAttacking] = useState(false);
  const [floatingDamage, setFloatingDamage] = useState(null);
  const [battleLog, setBattleLog] = useState([
    `The battle against ${boss?.name || 'the Boss'} has commenced!`,
    `Complete your real-life quests to deal massive critical damage.`
  ]);

  const maxHp = boss?.maxHp || 1500;
  const currentHp = boss?.currentHp || 1000;
  const hpPercent = Math.round((currentHp / maxHp) * 100);
  const isEnraged = currentHp <= maxHp * 0.4 && currentHp > 0;
  const isDefeated = currentHp <= 0;

  const handleDirectAttack = async () => {
    if (isAttacking || isDefeated) return;
    setIsAttacking(true);

    sound.playAttack(currentTheme);
    sound.playBossHit();

    const damageDealt = 85;
    setFloatingDamage({ dmg: damageDealt, id: Date.now() });

    try {
      const res = await onAttackBoss(currentTheme, damageDealt);
      setBattleLog((prev) => [
        `⚔️ Hero focused will: dealt -${damageDealt} DMG to ${boss.name}!`,
        ...prev.slice(0, 4)
      ]);

      if (res?.boss?.defeated) {
        sound.playLevelUp();
        confetti({ particleCount: 80, spread: 80, origin: { y: 0.5 } });
      }
    } finally {
      setTimeout(() => setFloatingDamage(null), 1000);
      setTimeout(() => setIsAttacking(false), 500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">
              World Boss Raid
            </span>
            <span className="text-xs text-neutral-400 font-semibold">
              Authoritative Encounter
            </span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-black text-white mt-1 tracking-wide ${themeConfig.fontHeading}`}>
            {boss?.name}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
            {themeConfig.boss.flavor}
          </p>
        </div>

        {isEnraged && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-red-600/20 border border-red-500 text-red-300 text-xs font-extrabold animate-pulse">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>ENRAGED PHASE (40% HP)</span>
          </div>
        )}
      </div>

      {/* Main Boss Raid Arena Card */}
      <div className="theme-card p-6 md:p-8 flex flex-col items-center relative overflow-hidden">
        {/* Boss HP Bar */}
        <div className="w-full max-w-xl mb-6 z-10">
          <div className="flex justify-between items-center text-xs font-black mb-1.5">
            <span className="text-red-400 uppercase tracking-widest flex items-center gap-1.5">
              <Skull className="w-4 h-4" />
              Boss Vitality
            </span>
            <span className="text-neutral-200">
              {currentHp} / {maxHp} HP ({hpPercent}%)
            </span>
          </div>
          <ProgressBar
            value={currentHp}
            max={maxHp}
            heightClass="h-4"
            colorClass={
              isEnraged
                ? 'bg-gradient-to-r from-red-600 via-orange-500 to-red-500 animate-pulse'
                : 'bg-gradient-to-r from-red-700 to-red-500'
            }
          />
        </div>

        {/* Floating Damage Number */}
        <AnimatePresence>
          {floatingDamage && (
            <motion.div
              key={floatingDamage.id}
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: -40, scale: 1.6 }}
              exit={{ opacity: 0 }}
              className="absolute z-40 top-36 font-black text-3xl text-red-400 drop-shadow-[0_0_15px_#dc2626]"
            >
              -{floatingDamage.dmg} DMG!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Boss Avatar Visual (Theme-Specific Rig) */}
        <div className="relative w-72 h-72 flex items-center justify-center my-2">
          {/* Boss Aura / Ring */}
          <motion.div
            animate={{
              rotate: isEnraged ? 360 : -360,
              scale: isEnraged ? [1, 1.08, 1] : [0.98, 1.02, 0.98]
            }}
            transition={{
              rotate: { duration: isEnraged ? 10 : 25, repeat: Infinity, ease: 'linear' },
              scale: { duration: 2, repeat: Infinity }
            }}
            className={`absolute w-64 h-64 rounded-full border-2 border-dashed ${
              isEnraged ? 'border-red-500/50 bg-red-600/10' : 'border-neutral-700/50'
            }`}
          />

          {/* Theme Boss Graphic */}
          <motion.div
            animate={isAttacking ? { x: [-10, 15, -10, 0], y: [-5, 5, 0] } : { y: [0, -6, 0] }}
            transition={isAttacking ? { duration: 0.4 } : { duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative z-10 select-none"
          >
            {/* FOREST THEME BOSS: Malakor Blight Treant */}
            {currentTheme === THEMES.FOREST && (
              <svg viewBox="0 0 220 220" className="w-56 h-56 filter drop-shadow-[0_0_25px_rgba(220,38,38,0.4)]">
                <circle cx="110" cy="110" r="85" fill="#041f14" stroke="#166534" strokeWidth="3" />
                {/* Blighted Roots */}
                <path d="M40 180 Q 70 120 110 120 Q 150 120 180 180" stroke="#78350f" strokeWidth="12" fill="none" />
                <path d="M60 190 Q 90 140 110 130 Q 130 140 160 190" stroke="#451a03" strokeWidth="8" fill="none" />
                {/* Treant Face & Glowing Corrupted Core */}
                <ellipse cx="110" cy="95" rx="36" ry="42" fill="#1c1917" stroke="#b91c1c" strokeWidth="3" />
                {/* Glowing Crimson Eyes */}
                <ellipse cx="98" cy="85" rx="8" ry="4" fill="#ef4444" />
                <ellipse cx="122" cy="85" rx="8" ry="4" fill="#ef4444" />
                <path d="M96 112 Q 110 126 124 112" stroke="#dc2626" strokeWidth="4" fill="none" />
                {/* Antler Thorns */}
                <path d="M85 60 L 60 30 M75 42 L 55 46" stroke="#451a03" strokeWidth="6" strokeLinecap="round" />
                <path d="M135 60 L 160 30 M145 42 L 165 46" stroke="#451a03" strokeWidth="6" strokeLinecap="round" />
              </svg>
            )}

            {/* SAMURAI THEME BOSS: Kurokage Shadow Shogun */}
            {currentTheme === THEMES.SAMURAI && (
              <svg viewBox="0 0 220 220" className="w-56 h-56 filter drop-shadow-[0_0_25px_rgba(220,38,38,0.6)]">
                {/* Blood Moon Backdrop */}
                <circle cx="110" cy="110" r="85" fill="#18181b" stroke="#dc2626" strokeWidth="3" />
                {/* Horned Kabuto Helmet */}
                <path d="M65 80 Q 110 40 155 80 L 145 105 L 75 105 Z" fill="#09090b" stroke="#dc2626" strokeWidth="3" />
                {/* Massive Golden Crest Horns */}
                <path d="M110 55 Q 60 15 35 25 M110 55 Q 160 15 185 25" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" fill="none" />
                {/* Demon Oni Menpo Mask */}
                <ellipse cx="110" cy="110" rx="34" ry="28" fill="#7f1d1d" stroke="#ef4444" strokeWidth="2" />
                {/* Flaming Fangs */}
                <polygon points="98,118 103,130 108,118" fill="#ffffff" />
                <polygon points="112,118 117,130 122,118" fill="#ffffff" />
                {/* Fiery Eyes */}
                <line x1="94" y1="102" x2="104" y2="104" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
                <line x1="126" y1="102" x2="116" y2="104" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
                {/* Crossed Flaming Odachi */}
                <line x1="30" y1="180" x2="190" y2="40" stroke="#f87171" strokeWidth="5" strokeLinecap="round" />
                <line x1="190" y1="180" x2="30" y2="40" stroke="#f87171" strokeWidth="5" strokeLinecap="round" />
              </svg>
            )}

            {/* CITY THEME BOSS: Titan OVERLOAD-9 */}
            {currentTheme === THEMES.CITY && (
              <svg viewBox="0 0 220 220" className="w-56 h-56 filter drop-shadow-[0_0_25px_rgba(14,165,233,0.5)]">
                {/* Cyber Grid Base */}
                <circle cx="110" cy="110" r="85" fill="#0f172a" stroke="#0ea5e9" strokeWidth="3" />
                {/* Steel Piston Frame */}
                <rect x="70" y="65" width="80" height="90" rx="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="3" />
                {/* Danger Stripes */}
                <rect x="70" y="65" width="80" height="14" fill="#f59e0b" />
                <line x1="75" y1="65" x2="85" y2="79" stroke="#000" strokeWidth="2" />
                <line x1="95" y1="65" x2="105" y2="79" stroke="#000" strokeWidth="2" />
                <line x1="115" y1="65" x2="125" y2="79" stroke="#000" strokeWidth="2" />
                <line x1="135" y1="65" x2="145" y2="79" stroke="#000" strokeWidth="2" />
                {/* Sparking Overload Core */}
                <circle cx="110" cy="115" r="22" fill="#dc2626" stroke="#ef4444" strokeWidth="3" />
                <circle cx="110" cy="115" r="10" fill="#fef08a" />
                {/* Hydraulic Claws */}
                <path d="M50 110 L 70 110 M150 110 L 170 110" stroke="#38bdf8" strokeWidth="8" strokeLinecap="square" />
              </svg>
            )}
          </motion.div>
        </div>

        {/* Victory Screen if Defeated */}
        {isDefeated ? (
          <div className="p-4 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-center max-w-md z-10 animate-bounce">
            <Award className="w-10 h-10 text-amber-400 mx-auto mb-1" />
            <h3 className="text-lg font-bold text-white">BOSS SLAIN! VICTORY!</h3>
            <p className="text-xs text-amber-200 mt-1">
              Authoritative rewards credited: +250 Koban Gold & +10 Arcane Gems!
            </p>
          </div>
        ) : (
          /* Combat Controls */
          <div className="flex flex-col sm:flex-row items-center gap-3 z-10 mt-2">
            <button
              onClick={handleDirectAttack}
              disabled={isAttacking || isDefeated}
              className="theme-button-primary px-6 py-3 text-sm font-extrabold flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <Sword className="w-4 h-4 stroke-[2.5]" />
              <span>Direct Focus Strike (-85 HP)</span>
            </button>
            <span className="text-xs text-neutral-400 font-medium">
              Tip: Completing quests on your Quest Board deals 100% of Quest XP as boss damage!
            </span>
          </div>
        )}
      </div>

      {/* Battle Log Box */}
      <div className="theme-card p-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          Real-Time Battle Feed
        </h4>
        <div className="space-y-1.5 font-mono text-xs text-neutral-300">
          {battleLog.map((log, index) => (
            <div key={index} className="py-1 border-b border-white/5 last:border-0">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
