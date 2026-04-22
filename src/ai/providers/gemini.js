import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiProvider {
  constructor(config) {
    if (!config.apiKey) {
      throw new Error(
        'No Gemini API key found. Use "self-commit set-key gemini" to set it securely or use the GEMINI_API_KEY env var.'
      );
    }
    this.genAI = new GoogleGenerativeAI(config.apiKey);
    this.modelName = config.model || 'gemini-1.5-flash';
  }

  async generate(diff, prompt) {
    const model = this.genAI.getGenerativeModel({
      model: this.modelName,
      generationConfig: { maxOutputTokens: 256 },
    });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  }
}
