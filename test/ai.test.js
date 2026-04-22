import { describe, it, expect, vi } from 'vitest';
import { AIService } from '../src/ai.js';

describe('AIService', () => {
  const mockConfig = { provider: 'openai', language: 'en', apiKey: 'test-key' };

  it('should sanitize markdown backticks from AI response', async () => {
    const ai = new AIService(mockConfig);

    // Mock the provider to return a message with backticks
    ai.provider = {
      generate: vi.fn().mockResolvedValue('```\nfeat(core): test commit\n```'),
    };

    const result = await ai.generateCommitMessage('diff', ['file.js']);
    expect(result).toBe('feat(core): test commit');
    expect(result).not.toContain('```');
  });

  it('should sanitize raw backticks without language identifier', async () => {
    const ai = new AIService(mockConfig);

    ai.provider = {
      generate: vi.fn().mockResolvedValue('```feat(core): test commit```'),
    };

    const result = await ai.generateCommitMessage('diff', ['file.js']);
    expect(result).toBe('feat(core): test commit');
  });
});
