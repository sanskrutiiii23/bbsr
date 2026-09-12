import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { THEMES } from '../../themes/definitions';
import { audioEngine, sound } from '../../utils/soundEffects';
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
  Sliders
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

  // If theme changes while BGM is playing, switch BGM track dynamically
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
    { id: 'quests', label: 'Quests', icon: CheckSquare },
    { id: 'character', label: 'Hero', icon: User },
    { id: 'boss', label: 'Boss Raid', icon: Skull },
    { id: 'skills', label: 'Skill Tree', icon: GitFork },
    { id: 'world', label: themeConfig.terminology.realmProgress, icon: Globe },
    { id: 'landing', label: 'Public SEO', icon: Sparkles }
  ];

  const getThemeIcon = () => {
    if (currentTheme === THEMES.SAMURAI) return <Sword className="w-4 h-4 text-red-400" />;
    if (currentTheme === THEMES.CITY) return <Building2 className="w-4 h-4 text-cyan-400" />;
    return <Sparkles className="w-4 h-4 text-emerald-400" />;
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl border-b border-white/10 bg-black/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Theme Identifier */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 text-left focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/10 border border-white/15 shadow-inner">
                {getThemeIcon()}
              </div>
              <div>
                <span className={`text-lg font-black tracking-wider text-white ${themeConfig.fontHeading}`}>
                  LIFE RPG
                </span>
                <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded text-[10px] font-bold tracking-widest bg-white/10 text-neutral-300 border border-white/10">
                  {themeConfig.code}
                </span>
              </div>
            </button>
          </div>

          {/* Player Mini Status HUD (Authoritative Display) */}
          <div className="hidden lg:flex items-center gap-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
            {/* Level & XP Bar */}
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-xs font-black bg-amber-500/20 text-amber-400 border border-amber-500/30">
                LVL {character?.level || 1}
              </span>
              <div className="w-24 bg-black/50 rounded-full h-2 overflow-hidden border border-white/10" title={`XP: ${character?.xp || 0}`}>
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-500"
                  style={{ width: `${character?.progressPercent || 20}%` }}
                />
              </div>
            </div>

            {/* Currency: Gold */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
              <Coins className="w-3.5 h-3.5 fill-amber-400" />
              <span>{character?.gold || 0}</span>
            </div>

            {/* Currency: Gems */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
              <Gem className="w-3.5 h-3.5 fill-cyan-400" />
              <span>{character?.gems || 0}</span>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400">
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-white/15 text-white shadow-sm border border-white/20'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Buttons: Procedural BGM, Volume Slider, Audio & Theme Switcher */}
          <div className="flex items-center gap-2">
            
            {/* Procedural BGM Toggle */}
            <button
              onClick={handleToggleBgm}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                isBgmPlaying
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)] animate-pulse'
                  : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border-white/10'
              }`}
              title={isBgmPlaying ? 'Stop Procedural BGM' : `Play ${themeConfig.name} BGM`}
            >
              <Music className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isBgmPlaying ? 'BGM ON' : 'BGM'}</span>
            </button>

            {/* Volume Control / Slider Popup */}
            <div className="relative">
              <button
                onClick={() => setShowVolSlider(!showVolSlider)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition-colors"
                title="BGM Volume Slider (0% - 200%)"
              >
                <Sliders className="w-4 h-4 text-cyan-400" />
              </button>

              {showVolSlider && (
                <div className="absolute right-0 top-12 z-50 p-3 rounded-2xl bg-neutral-900 border border-white/20 shadow-2xl w-48 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-300">
                    <span>BGM Volume</span>
                    <span className="text-cyan-400 font-mono">{Math.round(bgmVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2.0"
                    step="0.05"
                    value={bgmVolume}
                    onChange={handleVolumeChange}
                    className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-neutral-700 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-500">
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
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition-colors"
              title={isMuted ? 'Unmute Audio SFX' : 'Mute Audio SFX'}
              aria-label="Toggle Sound Effects"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Theme Selector Trigger */}
            <button
              onClick={() => {
                audioEngine.playClick();
                onOpenThemeSelector();
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-bold tracking-wide transition-all hover:scale-105 active:scale-95"
              title="Change RPG Theme (D/E/F)"
            >
              <Palette className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">{themeConfig.name}</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/5 text-neutral-300 hover:text-white border border-white/10"
              aria-label="Open mobile navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-neutral-950/95 backdrop-blur-2xl px-4 pt-3 pb-5 space-y-2">
          {/* Mobile HUD Status */}
          <div className="flex items-center justify-between py-2 px-3 mb-2 rounded-lg bg-white/5 border border-white/10 text-xs">
            <span className="font-bold text-amber-400">LVL {character?.level || 1}</span>
            <div className="flex items-center gap-3">
              <span className="text-amber-300">🪙 {character?.gold || 0}</span>
              <span className="text-cyan-300">💎 {character?.gems || 0}</span>
              <span className="text-orange-400">🔥 {character?.streak || 0}d</span>
            </div>
          </div>

          {/* BGM Mobile Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
            <span className="text-white font-bold flex items-center gap-2">
              <Music className="w-4 h-4 text-emerald-400" />
              Procedural {themeConfig.name} BGM
            </span>
            <button
              onClick={handleToggleBgm}
              className={`px-3 py-1 rounded-lg font-bold text-xs ${
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
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-white/20 text-white border border-white/20'
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
