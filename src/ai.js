import { OpenAIProvider } from './ai/providers/openai.js';
import { GeminiProvider } from './ai/providers/gemini.js';

export class AIService {
  constructor(config) {
    this.config = config;
    this.provider = this._createProvider(config);
  }

  _createProvider(config) {
    switch (config.provider) {
      case 'openai':
        return new OpenAIProvider(config);
      case 'gemini':
        return new GeminiProvider(config);
      default:
        throw new Error(`Unsupported provider: ${config.provider}`);
    }
  }

  async generateCommitMessage(diff) {
    const prompt = this._buildPrompt(diff);

    try {
      return await this.provider.generate(diff, prompt);
    } catch (error) {
      throw new Error(`AI Generation failed (${this.config.provider}): ${error.message}`, {
        cause: error,
      });
    }
  }

  _buildPrompt(diff) {
    const lang = this.config.language || 'en';
    return `
      You are an expert developer and technical writer.
      Generate a concise, meaningful, and professional git commit message based on the following diff.
      Follow the Conventional Commits specification.
      Focus on the "why" (intent) and "what" (impact).
      Write the message in ${lang}.

      Rules:
      1. Format: <type>(<scope>): <description>
      2. Types: feat, fix, chore, docs, style, refactor, perf, test.
      3. Description should be in present tense, lowercase, and without a period at the end.
      4. If there are multiple changes, add a body with bullet points.
      5. Keep it professional and technical.
      6. Return ONLY the commit message text.

      Diff:
      ${diff}
    `;
  }
}
