import OpenAI from 'openai';

export class OpenAIProvider {
  constructor(config) {
    if (!config.apiKey) {
      throw new Error(
        'No OpenAI API key found. Use "self-commit --set-key openai <KEY>" or set OPENAI_API_KEY env var.'
      );
    }
    this.openai = new OpenAI({ apiKey: config.apiKey });
    this.model = config.model || 'gpt-4o-mini';
  }

  async generate(diff, prompt) {
    const response = await this.openai.chat.completions.create({
      model: this.model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 200,
    });
    return response.choices[0].message.content.trim();
  }
}
