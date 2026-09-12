import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { CharacterStage } from '../character/CharacterStage';
import { ProgressBar } from '../shared/ProgressBar';
import { sound } from '../../utils/soundEffects';
import {
  Shield,
  Zap,
  Sword,
  Sparkles,
  Heart,
  Activity,
  Package,
  Award,
  Flame,
  CheckCircle2,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CharacterView = ({ character, onActionTriggered }) => {
  const { themeConfig } = useTheme();
  const [selectedItem, setSelectedItem] = useState(null);
  const [consumedMessage, setConsumedMessage] = useState(null);

  const hero = themeConfig.hero;
  const attributes = character?.attributes || {
    strength: 14,
    agility: 12,
    intelligence: 18,
    vitality: 15
  };

  const inventory = character?.inventory || [
    { id: 'inv-1', name: 'Elixir of Clarity', type: 'consumable', icon: 'Potion', count: 3, effect: '+20% XP boost' },
    { id: 'inv-2', name: 'Rune of Haste', type: 'relic', icon: 'Scroll', count: 1, effect: 'Instantly resets daily duties' },
    { id: 'inv-3', name: 'Ancestral Seal', type: 'gear', icon: 'Shield', count: 1, effect: '+5 Vitality and Armor' }
  ];

  const equipped = character?.equipped || {
    head: hero.gearSlots[0] || 'Crown of Focus',
    chest: hero.gearSlots[1] || 'Mantle of Discipline',
    weapon: hero.weapon,
    relic: hero.gearSlots[3] || 'Ancestral Crest'
  };

  const handleUseItem = (item) => {
    sound.playQuestComplete();
    setConsumedMessage(`Activated ${item.name}! Effect: ${item.effect}`);
    setTimeout(() => setConsumedMessage(null), 2500);
  };

  const statConfig = [
    { key: 'strength', name: 'Strength', val: attributes.strength, max: 30, icon: Sword, color: 'text-red-400', bar: 'bg-red-500' },
    { key: 'agility', name: 'Agility', val: attributes.agility, max: 30, icon: Zap, color: 'text-amber-400', bar: 'bg-amber-500' },
    { key: 'intelligence', name: 'Intelligence', val: attributes.intelligence, max: 30, icon: Sparkles, color: 'text-cyan-400', bar: 'bg-cyan-500' },
    { key: 'vitality', name: 'Vitality', val: attributes.vitality, max: 30, icon: Heart, color: 'text-emerald-400', bar: 'bg-emerald-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-white/10 text-white border border-white/15">
              Character Sanctum
            </span>
            <span className="text-xs text-neutral-400 font-semibold">
              Mastery Tier {character?.level || 1}
            </span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-black text-white mt-1 tracking-wide ${themeConfig.fontHeading}`}>
            {character?.name || hero.name}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
            Class: <strong className="text-white">{hero.class}</strong> • Current Weapon: <strong className="text-white">{hero.weapon}</strong>
          </p>
        </div>

        {/* Level & XP Progress Banner */}
        <div className="theme-card p-3 rounded-2xl flex items-center gap-4 min-w-[240px]">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex flex-col items-center justify-center font-black text-amber-300">
            <span className="text-[10px] leading-tight text-neutral-400">LVL</span>
            <span className="text-lg leading-none">{character?.level || 1}</span>
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-neutral-300">{themeConfig.terminology.xp}</span>
              <span className="text-emerald-400">{character?.xp || 0} XP</span>
            </div>
            <ProgressBar
              value={character?.progressPercent || 25}
              max={100}
              heightClass="h-2"
              colorClass="bg-gradient-to-r from-emerald-400 to-amber-400"
            />
          </div>
        </div>
      </div>

      {/* Notification for Consumables */}
      <AnimatePresence>
        {consumedMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{consumedMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Character Stage */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <CharacterStage characterState={character} onActionTriggered={onActionTriggered} />
          
          {/* Equipment Loadout Matrix */}
          <div className="theme-card p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              Equipped Relics & Gear
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { slot: 'Head Slot', item: equipped.head, icon: '👑' },
                { slot: 'Armor Slot', item: equipped.chest, icon: '🛡️' },
                { slot: 'Primary Weapon', item: equipped.weapon, icon: '⚔️' },
                { slot: 'Ancient Relic', item: equipped.relic, icon: '🔮' }
              ].map((eq, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-black/30 border border-white/10 flex items-center gap-3 hover:border-white/25 transition-all"
                >
                  <span className="text-xl select-none">{eq.icon}</span>
                  <div className="min-w-0">
                    <div className="text-[10px] text-neutral-400 uppercase font-semibold">
                      {eq.slot}
                    </div>
                    <div className="text-xs font-bold text-white truncate">
                      {eq.item}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Attributes & Inventory */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Attributes Matrix */}
          <div className="theme-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  Hero Core Attributes
                </h3>
                <p className="text-xs text-neutral-400">
                  Earned through habit completion and Skill Tree upgrades.
                </p>
              </div>

              {character?.skillPoints > 0 && (
                <div className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black animate-pulse">
                  {character.skillPoints} Skill Points Available
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {statConfig.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.key}
                    className="p-4 rounded-xl bg-black/25 border border-white/10 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${stat.color}`} />
                        <span className="text-xs font-bold text-neutral-200">
                          {stat.name}
                        </span>
                      </div>
                      <span className="text-sm font-black text-white">
                        {stat.val}
                      </span>
                    </div>

                    <ProgressBar
                      value={stat.val}
                      max={stat.max}
                      heightClass="h-2"
                      colorClass={stat.bar}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Inventory Backpack */}
          <div className="theme-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-amber-400" />
                  Adventurer's Backpack
                </h3>
                <p className="text-xs text-neutral-400">
                  Loot drops and consumable booster items.
                </p>
              </div>
              <span className="text-xs font-mono text-neutral-400">
                {inventory.length} / 12 Slots
              </span>
            </div>

            <div className="space-y-3">
              {inventory.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-black/25 hover:bg-black/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg">
                      {item.type === 'consumable' ? '🧪' : item.type === 'relic' ? '📜' : '🛡️'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">
                          {item.name}
                        </h4>
                        <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-white/10 text-neutral-300">
                          x{item.count}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {item.effect}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleUseItem(item)}
                    className="theme-button-primary px-3 py-1.5 text-xs font-bold self-end sm:self-auto"
                  >
                    Activate
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
