import OpenAI from 'openai';

export class AIService {
  constructor() {
    const apiKey = process.env['OPENAI-API-KEY'] || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error('No OpenAI API key found. Please set OPENAI-API-KEY in your .env file.');
    }

    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  async generateCommitMessage(diff) {
    const prompt = `
      You are an expert developer and technical writer.
      Generate a concise, meaningful, and professional git commit message based on the following diff.
      Follow the Conventional Commits specification.
      Focus on the "why" (intent) and "what" (impact).

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

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 200,
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      throw new Error(`AI Generation failed: ${error.message}`, { cause: error });
    }
  }
}
