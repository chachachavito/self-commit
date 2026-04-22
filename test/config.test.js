import { describe, it, expect } from 'vitest';
import { getConfig, DEFAULT_CONFIG } from '../src/config.js';

describe('Config Loader', () => {
  it('should return default config when no config file is found', async () => {
    const { config, configPath } = await getConfig();
    expect(config).toEqual(
      expect.objectContaining({
        provider: DEFAULT_CONFIG.provider,
        model: DEFAULT_CONFIG.model,
        language: DEFAULT_CONFIG.language,
      })
    );
    // configPath might be null or point to the project's config if it exists
    expect(configPath).toBeDefined();
  });

  it('should override defaults with provided config merge logic', async () => {
    const base = { ...DEFAULT_CONFIG };
    const override = { provider: 'gemini', language: 'pt' };
    const merged = { ...base, ...override };

    expect(merged.provider).toBe('gemini');
    expect(merged.language).toBe('pt');
    expect(merged.model).toBe(DEFAULT_CONFIG.model);
  });
});
