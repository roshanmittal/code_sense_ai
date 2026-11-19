import api from './api';

export const executionService = {
  async executeCode({ language, code, customInput, submissionId }) {
    const res = await api.post('/execution/run', { language, code, customInput, submissionId });
    return res.data;
  },

  async runTestCases({ language, code, testCases, submissionId }) {
    const res = await api.post('/execution/test-cases', { language, code, testCases, submissionId });
    return res.data;
  },

  async getSupportedLanguages() {
    const res = await api.get('/execution/languages');
    return res.data;
  },
};
