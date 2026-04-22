import { cosmiconfig } from 'cosmiconfig';
import Conf from 'conf';

const configStore = new Conf({ projectName: 'self-commit' });
const explorer = cosmiconfig('self-commit');

export const DEFAULT_CONFIG = {
  provider: 'openai',
  model: 'gpt-4o-mini',
  language: 'en',
  verbosity: 'normal',
  contextCommand: null,
};

export function setGlobalKey(provider, key) {
  configStore.set(`keys.${provider}`, key);
}

export function getGlobalKey(provider) {
  return configStore.get(`keys.${provider}`);
}

export function deleteGlobalKey(provider) {
  configStore.delete(`keys.${provider}`);
}

export function listGlobalKeys() {
  const keys = configStore.get('keys') || {};
  return Object.keys(keys);
}

export async function getConfig() {
  try {
    const result = await explorer.search();
    const projectConfig = result ? result.config : {};
    const provider = projectConfig.provider || DEFAULT_CONFIG.provider;

    // Resolve API Key: 1. Global Store, 2. Env Var
    const globalKey = getGlobalKey(provider);
    const envVar = provider === 'openai' ? 'OPENAI_API_KEY' : 'GEMINI_API_KEY';
    const apiKey = globalKey || process.env[envVar] || process.env[`${envVar.replace('_', '-')}`];

    return {
      config: {
        ...DEFAULT_CONFIG,
        ...projectConfig,
        apiKey,
      },
      configPath: result ? result.filepath : null,
    };
  } catch (error) {
    console.warn('Failed to load config, using defaults.');
    return { config: DEFAULT_CONFIG, configPath: null };
  }
}
