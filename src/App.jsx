import React, { useState, useEffect } from 'react';
import { useTheme } from './context/ThemeContext';
import { Navbar } from './components/shared/Navbar';
import { ParticleCanvas } from './components/shared/ParticleCanvas';
import { ThemeSelector } from './components/shared/ThemeSelector';
import { DashboardView } from './components/views/DashboardView';
import { QuestBoardView } from './components/views/QuestBoardView';
import { CharacterView } from './components/views/CharacterView';
import { BossView } from './components/views/BossView';
import { SkillTreeView } from './components/views/SkillTreeView';
import { WorldProgressView } from './components/views/WorldProgressView';
import { LandingPage } from './components/views/LandingPage';
import { QuestModal } from './components/views/QuestModal';
import { Modal } from './components/shared/Modal';
import { characterService } from './services/characterService';
import { questService } from './services/questService';
import { bossService } from './services/bossService';
import { sound } from './utils/soundEffects';
import confetti from 'canvas-confetti';
import { Award, Zap, Coins, Gem, Sparkles } from 'lucide-react';

export function App() {
  const { currentTheme, themeConfig, isTransitioning } = useTheme();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [character, setCharacter] = useState(null);
  const [quests, setQuests] = useState([]);
  const [boss, setBoss] = useState(null);
  const [skills, setSkills] = useState([]);
  const [realmProgress, setRealmProgress] = useState(null);

  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false);
  const [isCreateQuestOpen, setIsCreateQuestOpen] = useState(false);
  const [levelUpData, setLevelUpData] = useState(null);

  // Load authoritative state
  const reloadState = async () => {
    try {
      const [charData, questData, bossData, skillData, progressData] = await Promise.all([
        characterService.getCharacter(),
        questService.getQuests(),
        bossService.getBoss(currentTheme),
        characterService.getSkills(),
        characterService.getRealmProgress()
      ]);
      setCharacter(charData);
      setQuests(questData);
      setBoss(bossData);
      setSkills(skillData);
      setRealmProgress(progressData);
    } catch (e) {
      console.error('Failed to load authoritative state:', e);
    }
  };

  useEffect(() => {
    reloadState();
  }, [currentTheme]);

  // Authoritative quest completion
  const handleCompleteQuest = async (questId) => {
    try {
      const res = await questService.completeQuest(questId, currentTheme);
      if (res && res.success) {
        // Update state
        setCharacter(res.character);
        setBoss(res.boss);
        setRealmProgress(res.realmProgress);
        setQuests((prev) =>
          prev.map((q) => (q.id === questId ? { ...q, completed: true, streak: q.isDaily ? q.streak + 1 : q.streak } : q))
        );

        // Level Up Trigger
        if (res.rewards?.leveledUp) {
          sound.playLevelUp();
          confetti({
            particleCount: 100,
            spread: 90,
            origin: { y: 0.5 }
          });
          setLevelUpData(res.rewards);
        }
      }
    } catch (err) {
      console.error('Error completing quest:', err);
    }
  };

  // Authoritative quest creation
  const handleCreateQuest = async (questData) => {
    try {
      const newQuest = await questService.createQuest(questData);
      setQuests((prev) => [newQuest, ...prev]);
    } catch (err) {
      console.error('Error creating quest:', err);
    }
  };

  // Authoritative quest deletion
  const handleDeleteQuest = async (questId) => {
    try {
      await questService.deleteQuest(questId);
      setQuests((prev) => prev.filter((q) => q.id !== questId));
    } catch (err) {
      console.error('Error deleting quest:', err);
    }
  };

  // Authoritative boss attack
  const handleAttackBoss = async (theme, damage) => {
    try {
      const res = await bossService.attackBoss(theme, damage);
      setBoss(res.boss);
      setCharacter(res.character);
      return res;
    } catch (err) {
      console.error('Error attacking boss:', err);
    }
  };

  // Authoritative skill allocation
  const handleAllocateSkill = async (skillId) => {
    try {
      const res = await characterService.allocateSkill(skillId);
      setSkills(res.skills);
      setCharacter(res.character);
      return res;
    } catch (err) {
      console.error('Error allocating skill:', err);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col relative transition-opacity duration-300 ${isTransitioning ? 'opacity-70' : 'opacity-100'}`}>
      {/* Background Ambient Particles Canvas */}
      <ParticleCanvas />

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        character={character}
        onOpenThemeSelector={() => setIsThemeSelectorOpen(true)}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {activeTab === 'dashboard' && (
          <DashboardView
            character={character}
            quests={quests}
            boss={boss}
            realmProgress={realmProgress}
            onCompleteQuest={handleCompleteQuest}
            onNavigateTab={setActiveTab}
            onOpenCreateQuest={() => setIsCreateQuestOpen(true)}
          />
        )}

        {activeTab === 'quests' && (
          <QuestBoardView
            quests={quests}
            onCompleteQuest={handleCompleteQuest}
            onCreateQuest={handleCreateQuest}
            onDeleteQuest={handleDeleteQuest}
          />
        )}

        {activeTab === 'character' && (
          <CharacterView
            character={character}
            onActionTriggered={() => {}}
          />
        )}

        {activeTab === 'boss' && (
          <BossView
            boss={boss}
            onAttackBoss={handleAttackBoss}
            character={character}
          />
        )}

        {activeTab === 'skills' && (
          <SkillTreeView
            skills={skills}
            character={character}
            onAllocateSkill={handleAllocateSkill}
          />
        )}

        {activeTab === 'world' && (
          <WorldProgressView
            realmProgress={realmProgress}
            character={character}
          />
        )}

        {activeTab === 'landing' && (
          <LandingPage
            onEnterApp={() => setActiveTab('dashboard')}
            onOpenThemeSelector={() => setIsThemeSelectorOpen(true)}
          />
        )}
      </main>

      {/* Theme Matrix Modal */}
      <ThemeSelector
        isOpen={isThemeSelectorOpen}
        onClose={() => setIsThemeSelectorOpen(false)}
      />

      {/* Quick Quest Modal for Dashboard */}
      <QuestModal
        isOpen={isCreateQuestOpen}
        onClose={() => setIsCreateQuestOpen(false)}
        onCreateQuest={handleCreateQuest}
      />

      {/* Authoritative Level-Up Celebration Modal */}
      <Modal
        isOpen={!!levelUpData}
        onClose={() => setLevelUpData(null)}
        title="✨ HERO LEVEL ASCENSION! ✨"
      >
        <div className="text-center py-4 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 mx-auto animate-bounce">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-2xl font-black text-white">
              LEVEL {levelUpData?.newLevel} REACHED!
            </h3>
            <p className="text-xs text-neutral-300 mt-1">
              Your dedication has transcended the mortal realm.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto text-xs font-bold pt-2">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" />
              <span>+1 Skill Point</span>
            </div>
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 flex items-center justify-center gap-2">
              <Gem className="w-4 h-4" />
              <span>+5 Arcane Gems</span>
            </div>
          </div>

          <button
            onClick={() => setLevelUpData(null)}
            className="theme-button-primary w-full py-3 text-sm font-bold shadow-xl mt-4"
          >
            Claim Rewards & Continue
          </button>
        </div>
      </Modal>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/40 py-6 text-center text-xs text-neutral-400 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-wider">LIFE RPG</span>
            <span>•</span>
            <span className="text-neutral-400">Tech Member 2: Frontend & Themes</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-neutral-400">Active Theme: <strong className="text-white">{themeConfig.name}</strong></span>
            <span>•</span>
            <button
              onClick={() => setIsThemeSelectorOpen(true)}
              className="text-amber-400 hover:text-amber-300 font-bold transition-colors"
            >
              Switch Theme
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
