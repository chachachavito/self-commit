#!/usr/bin/env node

import 'dotenv/config';
import { Command } from 'commander';
import { main } from '../src/index.js';
import { setGlobalKey } from '../src/config.js';

const program = new Command();

program
  .name('self-commit')
  .description('The agnostic copywriting assistant for structured git commits')
  .version('0.5.0')
  .option('-d, --dry-run', 'preview the commit message without applying it')
  .action(async (options) => {
    try {
      await main(options);
    } catch (error) {
      console.error(`\nError: ${error.message}`);
      process.exit(1);
    }
  });

program
  .command('set-key')
  .description('Set a global API key for a provider')
  .argument('<provider>', 'AI provider (openai, gemini)')
  .argument('<key>', 'API key value')
  .action((provider, key) => {
    setGlobalKey(provider, key);
    console.log(`\n✅ Global API key for ${provider} saved successfully!\n`);
  });

program.parse();
