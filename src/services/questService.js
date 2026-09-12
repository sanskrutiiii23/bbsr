import { apiClient } from './api';
import { mockEngine } from './mockEngine';

export const questService = {
  async getQuests() {
    try {
      const live = await apiClient.request('/quests');
      if (live) return live;
    } catch (e) {
      console.warn('Backend unavailable, falling back to mock state engine');
    }
    return mockEngine.getQuests();
  },

  async createQuest(questData) {
    try {
      const live = await apiClient.request('/quests', {
        method: 'POST',
        body: JSON.stringify(questData)
      });
      if (live) return live;
    } catch (e) {
      console.warn('Backend unavailable, creating in mock state engine');
    }
    return mockEngine.createQuest(questData);
  },

  async completeQuest(questId, activeTheme) {
    try {
      const live = await apiClient.request(`/quests/${questId}/complete`, {
        method: 'POST',
        body: JSON.stringify({ activeTheme })
      });
      if (live) return live;
    } catch (e) {
      console.warn('Backend unavailable, completing in mock state engine');
    }
    return mockEngine.completeQuest(questId, activeTheme);
  },

  async deleteQuest(questId) {
    try {
      const live = await apiClient.request(`/quests/${questId}`, {
        method: 'DELETE'
      });
      if (live) return live;
    } catch (e) {
      console.warn('Backend unavailable, deleting in mock state engine');
    }
    return mockEngine.deleteQuest(questId);
  }
};
