export const THEMES = {
  FOREST: 'forest',
  SAMURAI: 'samurai',
  CITY: 'city'
};

export const THEME_CONFIGS = {
  [THEMES.FOREST]: {
    id: THEMES.FOREST,
    code: 'Theme D',
    name: 'Enchanted Forest',
    subtitle: 'Druidic Sanctuary of the Ancient Tree',
    unlockLevel: 1,
    unlockRequirement: 'Starter Realm (Default)',
    icon: 'Sparkles',
    fontHeading: 'font-forest',
    fontFamily: "'Cinzel', serif",
    colorPalette: {
      primary: '#10b981',
      accent: '#34d399',
      gold: '#fbbf24',
      bgDark: '#02150d',
      surface: '#062b1d',
      border: 'rgba(52, 211, 153, 0.25)'
    },
    terminology: {
      quest: 'Grove Rite',
      quests: 'Sacred Bounties',
      boss: 'Corrupted Blight Treant',
      character: 'Archdruid Ranger',
      skills: 'World Tree Branches',
      xp: 'Anima Essence',
      currency: 'Spirit Dew',
      realmProgress: 'Spirit Tree Bloom',
      realmMetric: 'Purity Level'
    },
    hero: {
      name: 'Sylva Whisperwind',
      class: 'Verdant Archdruid',
      avatarEffect: 'floating-spores',
      weapon: 'Runed Elder Staff',
      gearSlots: ['Crown of Antlers', 'Cloak of Living Bramble', 'Staff of Yggdrasil', 'Emerald Talisman']
    },
    boss: {
      name: 'Malakor, The Blight Treant',
      title: 'Corruptor of the Ancient Sapling',
      maxHp: 1200,
      avatarType: 'treant',
      flavor: 'Thorns and blackened sap threaten to choke the life of the holy grove.'
    },
    worldProgress: {
      title: 'Ancient World Tree Restoration',
      description: 'Each quest completed purifies corrupted roots and makes the luminescent canopy bloom with spirit flowers.'
    }
  },

  [THEMES.SAMURAI]: {
    id: THEMES.SAMURAI,
    code: 'Theme E',
    name: 'Last Samurai Standing',
    subtitle: 'Path of Bushido & The Blood Moon',
    unlockLevel: 3,
    unlockRequirement: 'Unlocks at Level 3',
    icon: 'Sword',
    fontHeading: 'font-samurai',
    fontFamily: "'Noto Serif JP', serif",
    colorPalette: {
      primary: '#dc2626',
      accent: '#f87171',
      gold: '#f59e0b',
      bgDark: '#09090b',
      surface: '#121216',
      border: 'rgba(220, 38, 38, 0.3)'
    },
    terminology: {
      quest: 'Bushido Duty',
      quests: 'Honor Decrees',
      boss: 'Shadow Shogun Kurokage',
      character: 'Wandering Ronin',
      skills: 'Katana Stances & Kata',
      xp: 'Honor Points',
      currency: 'Koban Gold',
      realmProgress: 'Dojo & Torii Restoration',
      realmMetric: 'Honor Rank'
    },
    hero: {
      name: 'Jin Sakai',
      class: 'Master Ronin',
      avatarEffect: 'sakura-petals',
      weapon: 'Twin Muramasa Blades',
      gearSlots: ['Menpo War Mask', 'Crimson Lacquer Armor', 'Twin Katana Daisho', 'Ancestral Seal']
    },
    boss: {
      name: 'Kurokage, The Shadow Shogun',
      title: 'Lord of the Burning Torii',
      maxHp: 1500,
      avatarType: 'shogun',
      flavor: 'A fallen warlord seeking to extinguish the last ember of samurai discipline.'
    },
    worldProgress: {
      title: 'Sacred Mountain Shrine & Dojo',
      description: 'Restore ancestral stone lanterns, raise red torii gates, and cleanse the sacred dojo with completed duties.'
    }
  },

  [THEMES.CITY]: {
    id: THEMES.CITY,
    code: 'Theme F',
    name: 'Build Your City',
    subtitle: 'Cyber-Architect Metropolis Engine',
    unlockLevel: 5,
    unlockRequirement: 'Unlocks at Level 5',
    icon: 'Building2',
    fontHeading: 'font-city',
    fontFamily: "'Space Grotesk', monospace",
    colorPalette: {
      primary: '#0ea5e9',
      accent: '#38bdf8',
      gold: '#f59e0b',
      bgDark: '#050d1a',
      surface: '#0a192f',
      border: 'rgba(56, 189, 248, 0.3)'
    },
    terminology: {
      quest: 'Civil Blueprint',
      quests: 'Development Contracts',
      boss: 'Urban Decay Megabot',
      character: 'Chief Cyber Architect',
      skills: 'Infrastructure Tech Tree',
      xp: 'Grid Energy (MWh)',
      currency: 'Civic Credits',
      realmProgress: 'Skyline Expansion',
      realmMetric: 'Metropolis Tier'
    },
    hero: {
      name: 'Alex Sterling',
      class: 'Lead Grid Engineer',
      avatarEffect: 'drone-holo-scan',
      weapon: 'Holo-CAD Quantum Tablet',
      gearSlots: ['AR Visor HUD', 'Nanotech Exosuit', 'Plasma Beam Welder', 'Grav-Drone Module']
    },
    boss: {
      name: 'Titan OVERLOAD-9',
      title: 'Industrial Grid Glitch',
      maxHp: 1800,
      avatarType: 'cyber-titan',
      flavor: 'A rogue AI mainframe causing rolling blackouts and infrastructure structural collapse.'
    },
    worldProgress: {
      title: 'Metropolis Skyline Growth',
      description: 'Lay foundations, operate autonomous tower cranes, and illuminate neon skyscraper floors as goals succeed.'
    }
  }
};
