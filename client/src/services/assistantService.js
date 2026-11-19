import api from './api';

export const assistantService = {
  async sendMessage({ conversationId, message, language, codeContext }) {
    const res = await api.post('/assistant/chat', {
      conversationId,
      message,
      language,
      codeContext,
    });
    return res.data;
  },

  async debugCode({ language, code, compilerError, runtimeError, stdout, stderr }) {
    const res = await api.post('/assistant/debug', {
      language,
      code,
      compilerError,
      runtimeError,
      stdout,
      stderr,
    });
    return res.data;
  },

  async getConversations() {
    const res = await api.get('/assistant/conversations');
    return res.data;
  },

  async getConversationById(id) {
    const res = await api.get(`/assistant/conversations/${id}`);
    return res.data;
  },
};
