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

  async generateCommitMessage(diff, fileList, externalContext) {
    const prompt = this._buildPrompt(diff, fileList, externalContext);

    try {
      return await this.provider.generate(diff, prompt);
    } catch (error) {
      throw new Error(`AI Generation failed (${this.config.provider}): ${error.message}`, {
        cause: error,
      });
    }
  }

  _buildPrompt(diff, fileList, externalContext) {
    const lang = this.config.language || 'en';
    const files = fileList.join('\n');
    const archContext = externalContext ? `\nArchitectural Context:\n${externalContext}\n` : '';

    return `
      You are an expert developer and technical writer.
      Generate a concise, meaningful, and professional git commit message based on the following diff, file list, and architectural context.
      Follow the Conventional Commits specification.
      Focus on the "why" (intent) and "what" (impact).
      Write the message in ${lang}.
      ${archContext}
      Context - Changed Files:
      ${files}

      Rules:
      1. Format: <type>(<scope>): <description>
      2. Types: feat, fix, chore, docs, style, refactor, perf, test.
      3. Scope: Detect the most relevant scope based on the file paths (e.g., 'api', 'core', 'ui', 'config').
      4. Description: Present tense, lowercase, no period.
      5. Body: Use bullet points for multiple changes.
      6. Return ONLY the commit message text.

      Diff:
      ${diff}
    `;
  }
}
