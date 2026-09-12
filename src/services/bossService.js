import { apiClient } from './api';
import { mockEngine } from './mockEngine';

export const bossService = {
  async getBoss(theme) {
    try {
      const live = await apiClient.request(`/boss/${theme}`);
      if (live) return live;
    } catch (e) {
      // fallback
    }
    return mockEngine.getBoss(theme);
  },

  async attackBoss(theme, damage) {
    try {
      const live = await apiClient.request(`/boss/${theme}/attack`, {
        method: 'POST',
        body: JSON.stringify({ damage })
      });
      if (live) return live;
    } catch (e) {
      // fallback
    }
    return mockEngine.attackBoss(theme, damage);
  }
};
