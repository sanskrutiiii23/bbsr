import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { QuestCard } from './QuestCard';
import { QuestModal } from './QuestModal';
import { Plus, Search, Filter, CheckCircle, Flame, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const QuestBoardView = ({ quests, onCompleteQuest, onCreateQuest, onDeleteQuest }) => {
  const { themeConfig } = useTheme();
  const [activeTab, setActiveTab] = useState('all'); // all, daily, epic, completed
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'work', label: 'Work & Code' },
    { id: 'study', label: 'Study & Mind' },
    { id: 'fitness', label: 'Fitness & Body' },
    { id: 'health', label: 'Health' },
    { id: 'epic', label: 'Epic' }
  ];

  const filteredQuests = quests.filter((q) => {
    // Tab filter
    if (activeTab === 'daily' && !q.isDaily) return false;
    if (activeTab === 'epic' && q.category !== 'epic') return false;
    if (activeTab === 'completed' && !q.completed) return false;
    if (activeTab !== 'completed' && q.completed) return false; // Show active in other tabs

    // Category filter
    if (categoryFilter !== 'all' && q.category !== categoryFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const matchTitle = q.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDesc = q.description?.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchTitle && !matchDesc) return false;
    }

    return true;
  });

  const completedCount = quests.filter((q) => q.completed).length;

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-mono font-black uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5 rounded-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              BOUNTY LEDGER & CONTRACTS
            </span>
            <span className="text-[11px] font-mono text-neutral-400">
              EXPEDITION OBJECTIVES
            </span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-black text-white mt-1 tracking-wide uppercase ${themeConfig.fontHeading}`}>
            {themeConfig.terminology.quests}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
            Execute real-world habit contracts to empower your vanguard hero and damage world bosses.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="rpg-button-primary flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-mono font-black uppercase tracking-wider shadow-lg active:translate-y-0.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>NEW {themeConfig.terminology.quest}</span>
        </button>
      </div>

      {/* Control Bar: Search & Primary Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-2.5 rpg-card border border-neutral-800">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'ACTIVE CONTRACTS' },
            { id: 'daily', label: 'DAILY DISCIPLINES' },
            { id: 'epic', label: 'EPIC MILESTONES' },
            { id: 'completed', label: `RESOLVED (${completedCount})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-sm font-black'
                  : 'text-neutral-400 hover:text-white bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[220px]">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="FILTER OBJECTIVES..."
            className="w-full pl-8 pr-3 py-1.5 bg-black/60 border border-neutral-800 text-xs font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-neutral-500 font-mono text-[11px] uppercase flex items-center gap-1">
          <Filter className="w-3 h-3" /> DOMAIN:
        </span>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategoryFilter(c.id)}
            className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider transition-all border ${
              categoryFilter === c.id
                ? 'bg-neutral-800 text-amber-300 border-amber-500/50 font-bold shadow-sm'
                : 'text-neutral-500 hover:text-neutral-300 bg-neutral-950 border-neutral-800'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Quests Grid */}
      {filteredQuests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onComplete={onCompleteQuest}
              onDelete={onDeleteQuest}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rpg-card p-12 text-center flex flex-col items-center justify-center border border-neutral-800">
          <div className="w-12 h-12 rounded-sm bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-3 text-neutral-500">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white uppercase tracking-wider mb-1">NO ACTIVE CONTRACTS</h3>
          <p className="text-xs font-mono text-neutral-400 max-w-sm mb-5">
            {activeTab === 'completed'
              ? 'NO COMPLETED CONTRACTS ARCHIVED. DISPATCH A NEW OBJECTIVE TO COMMENCE PROGRESSION.'
              : 'ALL OBJECTIVES CLEARED OR NO CONTRACTS MATCH YOUR ACTIVE FILTER.'}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="rpg-button-primary px-4 py-2 text-xs font-mono font-bold flex items-center gap-2 uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" />
            <span>ENLIST NEW {themeConfig.terminology.quest}</span>
          </button>
        </div>
      )}

      {/* Quest Creation Modal */}
      <QuestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateQuest={onCreateQuest}
      />
    </div>
  );
};
