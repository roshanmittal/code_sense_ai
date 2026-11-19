import api from './api';

export const optimizationService = {
  async optimizeCode({ language, code, testCases, submissionId }) {
    const res = await api.post('/optimization', { language, code, testCases, submissionId });
    return res.data;
  },

  async getOptimizationById(id) {
    const res = await api.get(`/optimization/${id}`);
    return res.data;
  },
};
