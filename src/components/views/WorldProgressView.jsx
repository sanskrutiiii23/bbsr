import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { THEMES } from '../../themes/definitions';
import { ProgressBar } from '../shared/ProgressBar';
import {
  Globe,
  Sparkles,
  Building2,
  CheckCircle2,
  Flame,
  Award,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

export const WorldProgressView = ({ realmProgress, character }) => {
  const { currentTheme, themeConfig } = useTheme();

  const progressPercent = realmProgress?.[currentTheme] ?? 45;

  const getMilestones = () => {
    switch (currentTheme) {
      case THEMES.FOREST:
        return [
          { percent: 20, title: 'Purify Blighted Soil', desc: 'Ancient seeds awaken as roots clear corrupted thorns.', unlocked: progressPercent >= 20 },
          { percent: 40, title: 'Bioluminescent Spore Awakening', desc: 'Canopy fills with golden fireflies and glowing blue flora.', unlocked: progressPercent >= 40 },
          { percent: 60, title: 'Crown of Yggdrasil Blooms', desc: 'Immense spirit blossoms unfurl across the sacred boughs.', unlocked: progressPercent >= 60 },
          { percent: 80, title: 'Font of Eternal Anima', desc: 'Holy dew flows from ancient bark, healing the entire grove.', unlocked: progressPercent >= 80 },
          { percent: 100, title: 'Sanctuary of the World Tree', desc: 'Immortal equilibrium attained. Forest completely cleansed.', unlocked: progressPercent >= 100 }
        ];
      case THEMES.SAMURAI:
        return [
          { percent: 20, title: 'Light Ancestral Stone Lanterns', desc: 'The pathway through bamboo mist is illuminated by honor.', unlocked: progressPercent >= 20 },
          { percent: 40, title: 'Torii Gate Consecration', desc: 'Crimson vermilion gates stand tall against shadow forces.', unlocked: progressPercent >= 40 },
          { percent: 60, title: 'Dojo Inner Sanctum Rebuilt', desc: 'Martial discipline and tatami halls restored for disciples.', unlocked: progressPercent >= 60 },
          { percent: 80, title: 'Sacred Koi Stream & Bridge', desc: 'Pure alpine waters flow beneath the arched moon bridge.', unlocked: progressPercent >= 80 },
          { percent: 100, title: 'Ethereal Cherry Blossom Zenith', desc: 'Eternal sakura rain blesses the mountain with peace.', unlocked: progressPercent >= 100 }
        ];
      case THEMES.CITY:
        return [
          { percent: 20, title: 'Grid Substation Activation', desc: 'High-voltage quantum transformers boot up power lines.', unlocked: progressPercent >= 20 },
          { percent: 40, title: 'Autonomous Tower Cranes Deployed', desc: 'Robotic scaffolding constructs steel skyscraper cores.', unlocked: progressPercent >= 40 },
          { percent: 60, title: 'Neon High-Rise Habitation', desc: 'Cyber residential sectors illuminate the nighttime skyline.', unlocked: progressPercent >= 60 },
          { percent: 80, title: 'Mag-Lev Transit & Drone Highway', desc: 'Aerodynamic sky-trains link the high-density districts.', unlocked: progressPercent >= 80 },
          { percent: 100, title: 'Apex Megastructure Completion', desc: 'Tier-1 Utopian Cyber Metropolis fully energized.', unlocked: progressPercent >= 100 }
        ];
      default:
        return [];
    }
  };

  const milestones = getMilestones();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-white/10 text-white border border-white/15">
              Realm Architecture
            </span>
            <span className="text-xs text-neutral-400 font-semibold">
              Live Environmental Synthesis
            </span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-black text-white mt-1 tracking-wide ${themeConfig.fontHeading}`}>
            {themeConfig.worldProgress.title}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
            {themeConfig.worldProgress.description}
          </p>
        </div>

        {/* Current Realm Progress Capsule */}
        <div className="theme-card px-5 py-3 rounded-2xl flex items-center gap-4 min-w-[220px]">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-black text-lg">
            {progressPercent}%
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-neutral-400">
              {themeConfig.terminology.realmMetric}
            </div>
            <div className="text-sm font-black text-white">
              Tier {Math.min(5, Math.floor(progressPercent / 20) + 1)} / 5 Complete
            </div>
          </div>
        </div>
      </div>

      {/* Main Visual Display Stage */}
      <div className="theme-card p-6 md:p-8 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Aura */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-black/60 pointer-events-none" />

        {/* Theme-Specific Interactive Realm Diorama */}
        <div className="relative w-full max-w-2xl h-80 flex items-center justify-center my-4 select-none">
          
          {/* THEME D: Forest Spirit Tree Stage */}
          {currentTheme === THEMES.FOREST && (
            <svg viewBox="0 0 600 320" className="w-full h-full filter drop-shadow-[0_15px_25px_rgba(5,150,105,0.3)]">
              {/* Starry Night Canopy */}
              <rect width="600" height="320" rx="16" fill="#02150d" />
              {/* Moon Glow */}
              <circle cx="480" cy="70" r="45" fill="#fef08a" opacity="0.15" />
              <circle cx="480" cy="70" r="25" fill="#fef9c3" opacity="0.4" />

              {/* Distant mystical mountains */}
              <polygon points="0,260 120,180 250,260" fill="#032617" />
              <polygon points="180,260 320,160 460,260" fill="#04321f" />
              <polygon points="380,260 500,190 600,260" fill="#032617" />

              {/* Mossy Ground */}
              <path d="M0 260 Q 300 240 600 260 L 600 320 L 0 320 Z" fill="#064e3b" />

              {/* Trunk of the World Tree */}
              <path
                d="M260 260 C 270 200, 250 140, 270 100 C 290 80, 310 80, 330 100 C 350 140, 330 200, 340 260 Z"
                fill="#78350f"
                stroke="#92400e"
                strokeWidth="4"
              />

              {/* Glowing Ancient Roots */}
              <path
                d="M270 240 Q 210 270 160 280 M330 240 Q 390 270 440 280"
                stroke="#10b981"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
                opacity={progressPercent > 20 ? 1 : 0.3}
              />

              {/* Canopy Foliage Layers (Expands with progressPercent) */}
              <ellipse
                cx="300"
                cy="90"
                rx={100 + (progressPercent / 100) * 40}
                ry={65 + (progressPercent / 100) * 25}
                fill="#059669"
                opacity="0.85"
              />
              <ellipse
                cx="240"
                cy="95"
                rx={70 + (progressPercent / 100) * 20}
                ry={50 + (progressPercent / 100) * 15}
                fill="#10b981"
                opacity="0.75"
              />
              <ellipse
                cx="360"
                cy="95"
                rx={70 + (progressPercent / 100) * 20}
                ry={50 + (progressPercent / 100) * 15}
                fill="#047857"
                opacity="0.75"
              />

              {/* Bioluminescent Blooming Spirit Flowers */}
              {progressPercent >= 40 && (
                <g>
                  <circle cx="280" cy="70" r="8" fill="#fbbf24" filter="drop-shadow(0 0 6px #f59e0b)" />
                  <circle cx="330" cy="85" r="7" fill="#67e8f9" filter="drop-shadow(0 0 6px #06b6d4)" />
                  <circle cx="240" cy="90" r="8" fill="#fbbf24" filter="drop-shadow(0 0 6px #f59e0b)" />
                  <circle cx="360" cy="75" r="9" fill="#f472b6" filter="drop-shadow(0 0 6px #ec4899)" />
                  <circle cx="300" cy="115" r="6" fill="#a7f3d0" />
                </g>
              )}

              {/* Floating Fireflies */}
              {progressPercent >= 60 && (
                <g>
                  <circle cx="180" cy="140" r="3" fill="#34d399" className="animate-ping" />
                  <circle cx="420" cy="130" r="3" fill="#fbbf24" className="animate-ping" />
                  <circle cx="300" cy="40" r="4" fill="#a7f3d0" className="animate-ping" />
                </g>
              )}
            </svg>
          )}

          {/* THEME E: Samurai Dojo & Mountain Shrine Stage */}
          {currentTheme === THEMES.SAMURAI && (
            <svg viewBox="0 0 600 320" className="w-full h-full filter drop-shadow-[0_15px_25px_rgba(220,38,38,0.35)]">
              <rect width="600" height="320" rx="16" fill="#09090b" />
              {/* Crimson Blood Moon */}
              <circle cx="460" cy="80" r="50" fill="#dc2626" opacity="0.3" />
              <circle cx="460" cy="80" r="35" fill="#ef4444" opacity="0.8" />

              {/* Mount Fuji silhouette */}
              <polygon points="120,260 280,120 440,260" fill="#18181b" />
              <polygon points="230,165 280,120 330,165" fill="#f4f4f5" />

              {/* Mountain Cliff Ground */}
              <path d="M0 260 L 600 260 L 600 320 L 0 320 Z" fill="#121216" />

              {/* Traditional Dojo Pavilion */}
              <rect x="80" y="190" width="130" height="70" fill="#27272a" stroke="#52525b" strokeWidth="2" />
              {/* Pagoda Roof */}
              <path d="M60 190 Q 145 160 230 190 L 210 175 Q 145 155 80 175 Z" fill="#b91c1c" stroke="#dc2626" strokeWidth="2" />
              {/* Dojo Paper Doors */}
              <rect x="120" y="215" width="22" height="45" fill="#fef08a" opacity={progressPercent >= 40 ? 0.9 : 0.2} />
              <rect x="150" y="215" width="22" height="45" fill="#fef08a" opacity={progressPercent >= 40 ? 0.9 : 0.2} />

              {/* Grand Crimson Torii Gate */}
              <g opacity={progressPercent >= 20 ? 1 : 0.4}>
                {/* Posts */}
                <rect x="330" y="150" width="14" height="110" fill="#dc2626" />
                <rect x="420" y="150" width="14" height="110" fill="#dc2626" />
                {/* Upper curved lintel */}
                <path d="M310 150 Q 382 135 455 150 L 450 162 Q 382 147 315 162 Z" fill="#dc2626" />
                {/* Tie-beam */}
                <rect x="320" y="172" width="124" height="8" fill="#18181b" />
              </g>

              {/* Restored Stone Lanterns */}
              <g opacity={progressPercent >= 60 ? 1 : 0.3}>
                <rect x="290" y="235" width="10" height="25" fill="#52525b" />
                <rect x="286" y="222" width="18" height="14" rx="2" fill="#fbbf24" filter="drop-shadow(0 0 6px #f59e0b)" />
                <rect x="460" y="235" width="10" height="25" fill="#52525b" />
                <rect x="456" y="222" width="18" height="14" rx="2" fill="#fbbf24" filter="drop-shadow(0 0 6px #f59e0b)" />
              </g>

              {/* Sakura Tree */}
              <path d="M500 260 C 490 200, 520 180, 510 140" stroke="#78350f" strokeWidth="6" strokeLinecap="round" />
              <ellipse cx="515" cy="130" rx="35" ry="25" fill="#f472b6" opacity="0.9" />
              <ellipse cx="485" cy="145" rx="25" ry="18" fill="#fda4af" opacity="0.8" />
            </svg>
          )}

          {/* THEME F: Cyber-Architect Isometric Skyline Stage */}
          {currentTheme === THEMES.CITY && (
            <svg viewBox="0 0 600 320" className="w-full h-full filter drop-shadow-[0_15px_25px_rgba(14,165,233,0.35)]">
              <rect width="600" height="320" rx="16" fill="#050d1a" />
              
              {/* Cyber Grid Lines */}
              <line x1="0" y1="260" x2="600" y2="260" stroke="#0ea5e9" strokeWidth="2" opacity="0.4" />
              <line x1="100" y1="260" x2="20" y2="320" stroke="#0ea5e9" strokeWidth="1" opacity="0.3" />
              <line x1="200" y1="260" x2="160" y2="320" stroke="#0ea5e9" strokeWidth="1" opacity="0.3" />
              <line x1="300" y1="260" x2="300" y2="320" stroke="#0ea5e9" strokeWidth="1" opacity="0.3" />
              <line x1="400" y1="260" x2="440" y2="320" stroke="#0ea5e9" strokeWidth="1" opacity="0.3" />
              <line x1="500" y1="260" x2="580" y2="320" stroke="#0ea5e9" strokeWidth="1" opacity="0.3" />

              {/* Skyscraper 1: Left Telecom Tower */}
              <rect x="80" y={260 - (progressPercent / 100) * 140} width="60" height={(progressPercent / 100) * 140} fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
              {/* Spire */}
              <line x1="110" y1={260 - (progressPercent / 100) * 140} x2="110" y2={230 - (progressPercent / 100) * 140} stroke="#38bdf8" strokeWidth="3" />
              <circle cx="110" cy={230 - (progressPercent / 100) * 140} r="4" fill="#f59e0b" className="animate-ping" />

              {/* Skyscraper 2: Central Megatower */}
              <rect x="220" y={260 - (progressPercent / 100) * 180} width="90" height={(progressPercent / 100) * 180} fill="#1e293b" stroke="#0ea5e9" strokeWidth="2" />
              {/* Glowing Neon Windows in Central Tower */}
              {Array.from({ length: Math.floor((progressPercent / 100) * 6) }).map((_, i) => (
                <g key={i}>
                  <rect x="235" y={240 - i * 26} width="16" height="12" fill="#38bdf8" opacity="0.8" />
                  <rect x="260" y={240 - i * 26} width="16" height="12" fill="#38bdf8" opacity="0.8" />
                  <rect x="285" y={240 - i * 26} width="16" height="12" fill="#f59e0b" opacity="0.9" />
                </g>
              ))}

              {/* Skyscraper 3: Right Corporate Arc */}
              <rect x="380" y={260 - (progressPercent / 100) * 120} width="70" height={(progressPercent / 100) * 120} fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />

              {/* Active Robotic Construction Crane */}
              {progressPercent < 100 && (
                <g>
                  {/* Crane Mast */}
                  <line x1="330" y1="260" x2="330" y2="70" stroke="#f59e0b" strokeWidth="4" />
                  {/* Crane Jib */}
                  <line x1="280" y1="70" x2="380" y2="70" stroke="#f59e0b" strokeWidth="4" />
                  {/* Counterweight */}
                  <rect x="365" y="65" width="16" height="12" fill="#d97706" />
                  {/* Crane Cable */}
                  <line x1="300" y1="70" x2="300" y2="120" stroke="#ffffff" strokeWidth="1" strokeDasharray="3 3" />
                  {/* Steel Beam Being Lifted */}
                  <rect x="285" y="120" width="30" height="6" fill="#38bdf8" />
                </g>
              )}

              {/* Flying Hover Drone */}
              <circle cx="480" cy="110" r="8" fill="#0ea5e9" />
              <line x1="465" y1="110" x2="495" y2="110" stroke="#38bdf8" strokeWidth="2" />
              <line x1="480" y1="118" x2="480" y2="140" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.7" />
            </svg>
          )}

        </div>

        {/* Global Progress Bar */}
        <div className="w-full max-w-xl mt-4">
          <div className="flex justify-between items-center text-xs font-bold mb-1.5">
            <span className="text-neutral-300 uppercase tracking-wider">
              {themeConfig.terminology.realmProgress}
            </span>
            <span className="text-emerald-400">
              {progressPercent}% Purification / Construction
            </span>
          </div>
          <ProgressBar
            value={progressPercent}
            max={100}
            heightClass="h-3"
            colorClass="bg-gradient-to-r from-emerald-500 via-cyan-400 to-amber-400"
          />
        </div>
      </div>

      {/* Progressive Milestones Road Map */}
      <div className="theme-card p-6">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          Realm Tier Milestones & Perks
        </h3>

        <div className="space-y-3">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex items-start justify-between gap-4 transition-all ${
                m.unlocked
                  ? 'bg-white/10 border-white/20'
                  : 'bg-black/30 border-white/5 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-xs border ${
                    m.unlocked
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-white/5 text-neutral-500 border-white/10'
                  }`}
                >
                  {m.unlocked ? <CheckCircle2 className="w-5 h-5" /> : `${m.percent}%`}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {m.title}
                  </h4>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {m.desc}
                  </p>
                </div>
              </div>

              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full whitespace-nowrap ${
                  m.unlocked
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-white/5 text-neutral-400 border border-white/10'
                }`}
              >
                {m.unlocked ? 'Unlocked' : `Requires ${m.percent}%`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
