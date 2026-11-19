import api from './api';

export const analysisService = {
  async analyzeCode({ language, code, title, submissionId }) {
    const res = await api.post('/analysis', { language, code, title, submissionId });
    return res.data;
  },

  async getAnalysisById(id) {
    const res = await api.get(`/analysis/${id}`);
    return res.data;
  },
};
