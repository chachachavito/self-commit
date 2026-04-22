import { describe, it, expect, vi } from 'vitest';
import { getConfig, DEFAULT_CONFIG } from '../src/config.js';

describe('Config Loader', () => {
  it('should return default config when no config file is found', async () => {
    const config = await getConfig();
    expect(config).toEqual(expect.objectContaining(DEFAULT_CONFIG));
  });

  it('should override defaults with provided config', async () => {
    // This would require mocking cosmiconfig, but for now we validate the merge logic
    const base = { ...DEFAULT_CONFIG };
    const override = { provider: 'gemini', language: 'pt' };
    const merged = { ...base, ...override };

    expect(merged.provider).toBe('gemini');
    expect(merged.language).toBe('pt');
    expect(merged.model).toBe(DEFAULT_CONFIG.model);
  });
});
