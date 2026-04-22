import OpenAI from 'openai';

export class OpenAIProvider {
  constructor(config) {
    const apiKey = process.env['OPENAI-API-KEY'] || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('No OpenAI API key found. Please set OPENAI-API-KEY in your .env file.');
    }
    this.openai = new OpenAI({ apiKey });
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
