import { cosmiconfig } from 'cosmiconfig';

const explorer = cosmiconfig('self-commit');

export const DEFAULT_CONFIG = {
  provider: 'openai',
  model: 'gpt-4o-mini',
  language: 'en',
  verbosity: 'normal',
  contextCommand: null,
};

export async function getConfig() {
  try {
    const result = await explorer.search();
    return {
      ...DEFAULT_CONFIG,
      ...(result ? result.config : {}),
    };
  } catch (error) {
    console.warn('Failed to load config, using defaults.');
    return DEFAULT_CONFIG;
  }
}
