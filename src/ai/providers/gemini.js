import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiProvider {
  constructor(config) {
    const apiKey = process.env['GEMINI_API_KEY'] || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error('No Gemini API key found. Please set GEMINI_API_KEY in your .env file.');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.modelName = config.model || 'gemini-1.5-flash';
  }

  async generate(diff, prompt) {
    const model = this.genAI.getGenerativeModel({ model: this.modelName });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  }
}
