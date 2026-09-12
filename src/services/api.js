// API Service configuration and request dispatcher
// Connects to shared backend if available, or delegates to Server-Authoritative Mock Engine.

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = {
  async isBackendAvailable() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET', signal: AbortSignal.timeout(1000) });
      return res.ok;
    } catch {
      return false;
    }
  },

  async request(endpoint, options = {}) {
    const isLive = await this.isBackendAvailable();
    if (!isLive) {
      return null; // Will fallback to mockEngine in individual services
    }

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || 'API request failed');
    }

    return await res.json();
  }
};
