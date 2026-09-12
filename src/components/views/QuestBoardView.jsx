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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-black text-white tracking-wide ${themeConfig.fontHeading}`}>
            {themeConfig.terminology.quests}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Transform real-world milestones into server-authoritative RPG progression.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="theme-button-primary flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold shadow-lg"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New {themeConfig.terminology.quest}</span>
        </button>
      </div>

      {/* Control Bar: Search & Primary Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-3 rounded-2xl bg-white/5 border border-white/10">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'Active Quests' },
            { id: 'daily', label: 'Daily Habits' },
            { id: 'epic', label: 'Epic Milestones' },
            { id: 'completed', label: `Completed (${completedCount})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-white/20 text-white shadow-sm border border-white/20'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[220px]">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search objectives..."
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-400"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-neutral-500 font-semibold flex items-center gap-1">
          <Filter className="w-3 h-3" /> Filter:
        </span>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategoryFilter(c.id)}
            className={`px-3 py-1 rounded-full font-medium transition-all ${
              categoryFilter === c.id
                ? 'bg-white/20 text-white border border-white/20 font-bold'
                : 'text-neutral-400 hover:text-neutral-200 bg-black/30 border border-white/5'
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
        <div className="theme-card p-12 text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-neutral-400">
            <CheckCircle className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No Objectives Found</h3>
          <p className="text-xs text-neutral-400 max-w-sm mb-5">
            {activeTab === 'completed'
              ? 'No completed quests yet. Strike down your first task to earn honor and XP!'
              : 'All objectives in this category are accomplished or no quests match your filter.'}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="theme-button-primary px-4 py-2 text-xs font-bold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create New {themeConfig.terminology.quest}</span>
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
