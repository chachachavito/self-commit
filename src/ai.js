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
      const result = await this.provider.generate(diff, prompt);

      // Robustness: Remove markdown blocks, backticks, and potential control characters
      return (
        result
          .replace(/```[a-z]*\n/g, '')
          .replace(/```/g, '')
          // eslint-disable-next-line no-control-regex
          .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '') // Remove control characters
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
          .join('\n')
          .trim()
      );
    } catch (error) {
      throw new Error(`AI Generation failed (${this.config.provider}): ${error.message}`, {
        cause: error,
      });
    }
  }

  _buildPrompt(diff, fileList, externalContext) {
    // Strict sanitization of config fields to prevent prompt injection
    const lang = (this.config.language || 'en').replace(/[^a-z-]/gi, '').substring(0, 10);
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
      6. Return ONLY the raw commit message text.
      7. NEVER include markdown code blocks or backticks (\`\`\`).

      Diff:
      ${diff}
    `;
  }
}
