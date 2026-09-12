import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { THEMES } from '../../themes/definitions';
import { audioEngine, sound } from '../../utils/soundEffects';
import { ProgressBar } from './ProgressBar';
import {
  Sparkles,
  Sword,
  Building2,
  Volume2,
  VolumeX,
  Palette,
  Flame,
  Coins,
  Gem,
  Menu,
  X,
  LayoutDashboard,
  CheckSquare,
  User,
  Skull,
  GitFork,
  Globe,
  Music,
  Sliders,
  Compass
} from 'lucide-react';

export const Navbar = ({
  activeTab,
  setActiveTab,
  character,
  onOpenThemeSelector
}) => {
  const { currentTheme, themeConfig } = useTheme();
  const [isMuted, setIsMuted] = useState(audioEngine.isMuted());
  const [isBgmPlaying, setIsBgmPlaying] = useState(audioEngine.isBgmPlaying());
  const [bgmVolume, setBgmVolumeState] = useState(audioEngine.getBgmVolume());
  const [showVolSlider, setShowVolSlider] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (audioEngine.isBgmPlaying()) {
      audioEngine.startBGM(currentTheme);
    }
  }, [currentTheme]);

  const toggleAudio = () => {
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
    if (!muted) audioEngine.playClick();
  };

  const handleToggleBgm = () => {
    const playing = audioEngine.toggleBGM(currentTheme);
    setIsBgmPlaying(playing);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setBgmVolumeState(val);
    audioEngine.setBgmVolume(val);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'journey', label: 'Track Road', icon: Compass },
    { id: 'quests', label: 'Bounties', icon: CheckSquare },
    { id: 'character', label: 'Hero Sanctum', icon: User },
    { id: 'boss', label: 'Boss Raid', icon: Skull },
    { id: 'skills', label: 'Skill Tree', icon: GitFork },
    { id: 'world', label: themeConfig.terminology.realmProgress, icon: Globe },
    { id: 'landing', label: 'Overview', icon: Sparkles }
  ];

  const getThemeIcon = () => {
    if (currentTheme === THEMES.SAMURAI) return <Sword className="w-4 h-4 text-red-400" />;
    if (currentTheme === THEMES.CITY) return <Building2 className="w-4 h-4 text-cyan-400" />;
    return <Sparkles className="w-4 h-4 text-emerald-400" />;
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-2xl border-b border-white/10 bg-black/60 transition-colors select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Realm Insignia */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <div className="w-9 h-9 rounded-md flex items-center justify-center bg-black/80 border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] group-hover:border-amber-400/50 transition-colors">
                {getThemeIcon()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-base font-black tracking-widest text-white ${themeConfig.fontHeading}`}>
                    LIFE RPG
                  </span>
                  <span className="px-1.5 py-0.2 rounded-sm text-[9px] font-mono font-bold tracking-widest bg-black/60 text-amber-300 border border-amber-500/30">
                    {themeConfig.code}
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Authentic Game HUD Status Bar (Level, Segmented XP, Currencies) */}
          <div className="hidden lg:flex items-center gap-3.5 px-3.5 py-1.5 rounded-sm bg-black/70 border border-white/15 shadow-inner">
            {/* Level Rank Badge */}
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-sm text-[10px] font-mono font-black bg-amber-950/80 text-amber-300 border border-amber-500/50 shadow-sm">
                LVL {character?.level || 1}
              </span>
              
              {/* Segmented XP Bar */}
              <div className="w-28 space-y-0.5">
                <div className="flex justify-between text-[9px] font-mono text-neutral-400 font-bold">
                  <span>XP</span>
                  <span className="text-emerald-400">{character?.progressPercent || 20}%</span>
                </div>
                <ProgressBar
                  value={character?.progressPercent || 20}
                  max={100}
                  heightClass="h-1.5"
                  colorClass="bg-gradient-to-r from-emerald-500 to-amber-400"
                />
              </div>
            </div>

            <div className="h-4 w-[1px] bg-white/10" />

            {/* Currency: Gold */}
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-300" title="Gold Currency">
              <Coins className="w-3.5 h-3.5 fill-amber-400" />
              <span>{character?.gold || 0}</span>
            </div>

            {/* Currency: Gems */}
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-300" title="Arcane Gems">
              <Gem className="w-3.5 h-3.5 fill-cyan-400" />
              <span>{character?.gems || 0}</span>
            </div>

            {/* Streak Flame */}
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-orange-400" title="Daily Streak">
              <Flame className="w-3.5 h-3.5 fill-orange-500" />
              <span>{character?.streak || 0}d</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    audioEngine.playClick();
                    setActiveTab(item.id);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold tracking-wide transition-all relative ${
                    isActive
                      ? 'bg-white/15 text-white border-b-2 border-amber-400 shadow-sm'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Buttons: Procedural BGM, Volume, Mute & Theme Switcher */}
          <div className="flex items-center gap-2">
            
            {/* Procedural BGM Toggle */}
            <button
              onClick={handleToggleBgm}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border text-xs font-mono font-bold transition-all ${
                isBgmPlaying
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)] animate-pulse'
                  : 'bg-black/60 hover:bg-white/10 text-neutral-400 hover:text-white border-white/10'
              }`}
              title={isBgmPlaying ? 'Pause Procedural BGM' : `Play ${themeConfig.name} BGM`}
            >
              <Music className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isBgmPlaying ? 'BGM ON' : 'BGM'}</span>
            </button>

            {/* Volume Control / Slider Popup */}
            <div className="relative">
              <button
                onClick={() => setShowVolSlider(!showVolSlider)}
                className="p-2 rounded-sm bg-black/60 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition-colors"
                title="Audio Volume Slider (0% - 200%)"
              >
                <Sliders className="w-4 h-4 text-cyan-400" />
              </button>

              {showVolSlider && (
                <div className="absolute right-0 top-12 z-50 p-3.5 rounded-sm bg-black/95 border border-white/20 shadow-2xl w-48 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-neutral-300">
                    <span>BGM GAIN</span>
                    <span className="text-cyan-400">{Math.round(bgmVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2.0"
                    step="0.05"
                    value={bgmVolume}
                    onChange={handleVolumeChange}
                    className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-neutral-800 rounded-sm"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-neutral-500">
                    <span>0%</span>
                    <span>100%</span>
                    <span>200%</span>
                  </div>
                </div>
              )}
            </div>

            {/* Audio SFX Mute/Unmute */}
            <button
              onClick={toggleAudio}
              className="p-2 rounded-sm bg-black/60 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition-colors"
              title={isMuted ? 'Unmute Audio SFX' : 'Mute Audio SFX'}
              aria-label="Toggle Sound Effects"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Theme Matrix Trigger */}
            <button
              onClick={() => {
                audioEngine.playClick();
                onOpenThemeSelector();
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-black/60 hover:bg-white/15 text-white border border-amber-500/40 text-xs font-bold tracking-wide transition-all shadow-md"
              title="Switch RPG Theme"
            >
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline font-mono">{themeConfig.name}</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-sm bg-black/60 text-neutral-300 hover:text-white border border-white/10"
              aria-label="Open mobile navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/95 backdrop-blur-3xl px-4 pt-3 pb-5 space-y-2">
          {/* Mobile HUD Status */}
          <div className="flex items-center justify-between py-2 px-3 mb-2 rounded-sm bg-white/5 border border-white/10 text-xs font-mono">
            <span className="font-bold text-amber-400">LVL {character?.level || 1}</span>
            <div className="flex items-center gap-3 font-bold">
              <span className="text-amber-300">🪙 {character?.gold || 0}</span>
              <span className="text-cyan-300">💎 {character?.gems || 0}</span>
              <span className="text-orange-400">🔥 {character?.streak || 0}d</span>
            </div>
          </div>

          {/* BGM Mobile Toggle */}
          <div className="flex items-center justify-between p-3 rounded-sm bg-white/5 border border-white/10 text-xs">
            <span className="text-white font-bold flex items-center gap-2 font-mono">
              <Music className="w-4 h-4 text-emerald-400" />
              Procedural {themeConfig.name} BGM
            </span>
            <button
              onClick={handleToggleBgm}
              className={`px-3 py-1 rounded-sm font-mono font-bold text-xs ${
                isBgmPlaying ? 'bg-emerald-500 text-black' : 'bg-white/10 text-white'
              }`}
            >
              {isBgmPlaying ? 'ON' : 'OFF'}
            </button>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  audioEngine.playClick();
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-white/20 text-white border-l-4 border-amber-400'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
