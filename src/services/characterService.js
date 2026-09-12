import { apiClient } from './api';
import { mockEngine } from './mockEngine';

export const characterService = {
  async getCharacter() {
    try {
      const live = await apiClient.request('/character');
      if (live) return live;
    } catch (e) {
      // fallback
    }
    return mockEngine.getCharacter();
  },

  async allocateSkill(skillId) {
    try {
      const live = await apiClient.request(`/character/skills/${skillId}/allocate`, {
        method: 'POST'
      });
      if (live) return live;
    } catch (e) {
      // fallback
    }
    return mockEngine.allocateSkill(skillId);
  },

  async getSkills() {
    try {
      const live = await apiClient.request('/character/skills');
      if (live) return live;
    } catch (e) {
      // fallback
    }
    return mockEngine.getSkills();
  },

  async getRealmProgress() {
    return mockEngine.getRealmProgress();
  }
};
