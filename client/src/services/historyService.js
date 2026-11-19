import api from './api';

export const historyService = {
  async getHistory({ language, search, page = 1, limit = 15 } = {}) {
    const res = await api.get('/history', {
      params: { language, search, page, limit },
    });
    return res.data;
  },

  async getHistoryItem(id) {
    const res = await api.get(`/history/${id}`);
    return res.data;
  },

  async deleteHistoryItem(id) {
    const res = await api.delete(`/history/${id}`);
    return res.data;
  },
};
