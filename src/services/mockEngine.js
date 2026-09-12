// Server-Authoritative Mock State Engine for Life RPG
// Implements server rules: XP curve, Level calculation, Boss damage, Loot rolls, Streaks.

const STORAGE_KEY = 'life_rpg_server_state';

const calculateLevel = (xp) => {
  // Authoritative level formula: Level = floor(sqrt(XP / 100)) + 1
  return Math.floor(Math.sqrt(Math.max(0, xp) / 100)) + 1;
};

const xpForLevel = (lvl) => {
  return (lvl - 1) * (lvl - 1) * 100;
};

const xpForNextLevel = (lvl) => {
  return lvl * lvl * 100;
};

const DEFAULT_INITIAL_STATE = {
  character: {
    name: 'Champion of the Realm',
    xp: 280,
    level: 2,
    gold: 350,
    gems: 15,
    streak: 5,
    skillPoints: 2,
    attributes: {
      strength: 14,
      agility: 12,
      intelligence: 18,
      vitality: 15
    },
    inventory: [
      { id: 'inv-1', name: 'Elixir of Clarity', type: 'consumable', icon: 'Potion', count: 3, effect: '+20% XP for 1 hour' },
      { id: 'inv-2', name: 'Rune of Haste', type: 'relic', icon: 'Scroll', count: 1, effect: 'Instantly ready all daily habits' },
      { id: 'inv-3', name: 'Ancient Crest of Focus', type: 'gear', icon: 'Shield', count: 1, effect: '+5 Vitality' }
    ],
    equipped: {
      head: 'Crown of Focus',
      chest: 'Mantle of Discipline',
      weapon: 'Blade of Momentum',
      relic: 'Ancient Crest of Focus'
    }
  },
  quests: [
    {
      id: 'quest-1',
      title: 'Complete Deep Work: Code Architecture',
      description: 'Spend 90 minutes designing clean API interfaces and responsive components.',
      category: 'work',
      difficulty: 'hard',
      xp: 150,
      gold: 80,
      completed: false,
      isDaily: true,
      streak: 4
    },
    {
      id: 'quest-2',
      title: '30-Minute Physical Conditioning',
      description: 'Cardio, stretching, or strength training to fortify your hero vitality.',
      category: 'fitness',
      difficulty: 'medium',
      xp: 80,
      gold: 40,
      completed: false,
      isDaily: true,
      streak: 7
    },
    {
      id: 'quest-3',
      title: 'Read 20 Pages of Tech & Philosophy',
      description: 'Absorb high-density knowledge to increase Intellect and Mind power.',
      category: 'study',
      difficulty: 'easy',
      xp: 50,
      gold: 25,
      completed: true,
      isDaily: true,
      streak: 3
    },
    {
      id: 'quest-4',
      title: 'Hydrate: Drink 2.5 Liters of Clean Water',
      description: 'Maintain bodily purity and prevent fatigue debuffs.',
      category: 'health',
      difficulty: 'easy',
      xp: 40,
      gold: 20,
      completed: false,
      isDaily: true,
      streak: 12
    },
    {
      id: 'quest-5',
      title: 'Ship Epic Milestone: Theme Engine D/E/F',
      description: 'Deliver production-ready Enchanted Forest, Last Samurai, and Build Your City themes.',
      category: 'epic',
      difficulty: 'hard',
      xp: 300,
      gold: 200,
      completed: false,
      isDaily: false,
      streak: 0
    }
  ],
  bosses: {
    forest: {
      id: 'boss-forest',
      name: 'Malakor, The Blight Treant',
      maxHp: 1200,
      currentHp: 780,
      isEnraged: false,
      defeated: false
    },
    samurai: {
      id: 'boss-samurai',
      name: 'Kurokage, The Shadow Shogun',
      maxHp: 1500,
      currentHp: 1120,
      isEnraged: false,
      defeated: false
    },
    city: {
      id: 'boss-city',
      name: 'Titan OVERLOAD-9',
      maxHp: 1800,
      currentHp: 1450,
      isEnraged: false,
      defeated: false
    }
  },
  skills: [
    { id: 'skill-1', name: 'Iron Will', branch: 'strength', level: 1, maxLevel: 3, description: '+10% Gold from completed tasks', unlocked: true },
    { id: 'skill-2', name: 'Flow State', branch: 'intelligence', level: 1, maxLevel: 3, description: '+15% XP from Hard & Epic quests', unlocked: true },
    { id: 'skill-3', name: 'Streak Fortress', branch: 'vitality', level: 0, maxLevel: 3, description: 'Streak shield preserves streak if a day is missed', unlocked: false },
    { id: 'skill-4', name: 'Blade Surge / Laser Overdrive', branch: 'agility', level: 0, maxLevel: 3, description: 'Deals 2x damage to active Boss on task completion', unlocked: false }
  ],
  realmProgress: {
    forest: 42, // % bloom
    samurai: 35, // % honor restored
    city: 48 // % skyline built
  }
};

class MockStateEngine {
  constructor() {
    this.loadState();
  }

  loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.state = JSON.parse(raw);
        return;
      }
    } catch (e) {
      console.warn('Could not load stored state, using default:', e);
    }
    this.state = JSON.parse(JSON.stringify(DEFAULT_INITIAL_STATE));
    this.saveState();
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to save mock state:', e);
    }
  }

  getCharacter() {
    const char = this.state.character;
    const currentLevel = calculateLevel(char.xp);
    const currentLvlXp = xpForLevel(currentLevel);
    const nextLvlXp = xpForNextLevel(currentLevel);
    const progressPercent = Math.min(100, Math.round(((char.xp - currentLvlXp) / (nextLvlXp - currentLvlXp)) * 100));

    return {
      ...char,
      level: currentLevel,
      currentLvlXp,
      nextLvlXp,
      progressPercent
    };
  }

  getQuests() {
    return [...this.state.quests];
  }

  createQuest(questData) {
    const xpMap = { easy: 50, medium: 100, hard: 200 };
    const goldMap = { easy: 25, medium: 50, hard: 100 };

    const newQuest = {
      id: `quest-${Date.now()}`,
      title: questData.title || 'Untitled Quest',
      description: questData.description || '',
      category: questData.category || 'work',
      difficulty: questData.difficulty || 'medium',
      xp: questData.xp || xpMap[questData.difficulty] || 80,
      gold: questData.gold || goldMap[questData.difficulty] || 40,
      completed: false,
      isDaily: !!questData.isDaily,
      streak: 0
    };

    this.state.quests.unshift(newQuest);
    this.saveState();
    return newQuest;
  }

  completeQuest(questId, activeTheme = 'forest') {
    const quest = this.state.quests.find((q) => q.id === questId);
    if (!quest) {
      throw new Error(`Quest ${questId} not found`);
    }

    if (quest.completed) {
      return { message: 'Quest already completed', character: this.getCharacter() };
    }

    quest.completed = true;
    if (quest.isDaily) {
      quest.streak += 1;
    }

    const prevLevel = calculateLevel(this.state.character.xp);
    
    // Authoritative state updates
    this.state.character.xp += quest.xp;
    this.state.character.gold += quest.gold;
    const newLevel = calculateLevel(this.state.character.xp);
    const leveledUp = newLevel > prevLevel;

    if (leveledUp) {
      this.state.character.level = newLevel;
      this.state.character.skillPoints += 1;
      this.state.character.gems += 5;
    }

    // Authoritative Boss Damage
    const boss = this.state.bosses[activeTheme] || this.state.bosses.forest;
    const bossDamage = quest.xp;
    boss.currentHp = Math.max(0, boss.currentHp - bossDamage);
    if (boss.currentHp <= boss.maxHp * 0.4) {
      boss.isEnraged = true;
    }
    if (boss.currentHp === 0) {
      boss.defeated = true;
      // Bonus loot for boss defeat
      this.state.character.gold += 250;
      this.state.character.gems += 10;
    }

    // Advance realm progress
    if (this.state.realmProgress[activeTheme] !== undefined) {
      this.state.realmProgress[activeTheme] = Math.min(100, this.state.realmProgress[activeTheme] + 6);
    }

    this.saveState();

    return {
      success: true,
      questId,
      rewards: {
        xp: quest.xp,
        gold: quest.gold,
        leveledUp,
        newLevel,
        bossDamage,
        bossDefeated: boss.defeated
      },
      character: this.getCharacter(),
      boss: { ...boss },
      realmProgress: this.state.realmProgress
    };
  }

  deleteQuest(questId) {
    this.state.quests = this.state.quests.filter((q) => q.id !== questId);
    this.saveState();
    return { success: true, id: questId };
  }

  getBoss(theme = 'forest') {
    return this.state.bosses[theme] || this.state.bosses.forest;
  }

  attackBoss(theme = 'forest', damage = 50) {
    const boss = this.state.bosses[theme] || this.state.bosses.forest;
    boss.currentHp = Math.max(0, boss.currentHp - damage);
    if (boss.currentHp <= boss.maxHp * 0.4) {
      boss.isEnraged = true;
    }
    if (boss.currentHp === 0) {
      boss.defeated = true;
      this.state.character.gold += 150;
    }
    this.saveState();
    return { boss: { ...boss }, character: this.getCharacter() };
  }

  getSkills() {
    return [...this.state.skills];
  }

  allocateSkill(skillId) {
    if (this.state.character.skillPoints <= 0) {
      throw new Error('Not enough skill points');
    }
    const skill = this.state.skills.find((s) => s.id === skillId);
    if (!skill) throw new Error('Skill not found');

    if (skill.level < skill.maxLevel) {
      skill.level += 1;
      skill.unlocked = true;
      this.state.character.skillPoints -= 1;

      // Buff corresponding attribute
      if (skill.branch === 'strength') this.state.character.attributes.strength += 2;
      if (skill.branch === 'intelligence') this.state.character.attributes.intelligence += 2;
      if (skill.branch === 'vitality') this.state.character.attributes.vitality += 2;
      if (skill.branch === 'agility') this.state.character.attributes.agility += 2;

      this.saveState();
    }

    return {
      skills: this.getSkills(),
      character: this.getCharacter()
    };
  }

  getRealmProgress() {
    return { ...this.state.realmProgress };
  }
}

export const mockEngine = new MockStateEngine();
