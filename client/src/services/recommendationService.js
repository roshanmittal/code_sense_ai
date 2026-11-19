import api from './api';

export const recommendationService = {
  async getProblems({ pattern, difficulty } = {}) {
    const res = await api.get('/recommendations/problems', {
      params: { pattern, difficulty },
    });
    return res.data;
  },
};
