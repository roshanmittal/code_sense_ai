const { GoogleGenerativeAI } = require('@google/generative-ai');
const env = require('../../config/env');

class GeminiProvider {
  constructor() {
    this.apiKey = env.LLM_API_KEY;
    this.modelName = env.LLM_MODEL || 'gemini-2.5-flash';
    this.client = this.apiKey ? new GoogleGenerativeAI(this.apiKey) : null;
  }

  isAvailable() {
    return Boolean(this.client && this.apiKey && this.apiKey.trim().length > 0);
  }

  async generateJson(prompt) {
    if (!this.isAvailable()) {
      throw new Error('LLM_API_KEY is not configured in the environment');
    }

    const model = this.client.getGenerativeModel({
      model: this.modelName,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    try {
      return JSON.parse(responseText);
    } catch (parseErr) {
      // Strip ```json markdown wrappers if present
      const cleanJson = responseText
        .replace(/^```json/m, '')
        .replace(/^```/m, '')
        .replace(/```$/m, '')
        .trim();
      return JSON.parse(cleanJson);
    }
  }

  async generateText(prompt) {
    if (!this.isAvailable()) {
      throw new Error('LLM_API_KEY is not configured in the environment');
    }

    const model = this.client.getGenerativeModel({
      model: this.modelName,
      generationConfig: {
        temperature: 0.4,
      },
    });

    const result = await model.generateContent(prompt);
    return result.response.text();
  }
}

module.exports = new GeminiProvider();
