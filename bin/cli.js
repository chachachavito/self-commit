#!/usr/bin/env node

import 'dotenv/config';
import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { main } from '../src/index.js';
import { setGlobalKey, listGlobalKeys, deleteGlobalKey } from '../src/config.js';

const program = new Command();

program
  .name('self-commit')
  .description('The agnostic copywriting assistant for structured git commits')
  .version('0.6.0')
  .option('-d, --dry-run', 'preview the commit message without applying it')
  .action(async (options) => {
    try {
      await main(options);
    } catch (error) {
      console.error(chalk.red(`\nError: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('set-key')
  .description('Set a global API key for a provider')
  .argument('<provider>', 'AI provider (openai, gemini)')
  .argument('[key]', 'API key value (optional, will prompt if omitted)')
  .action(async (provider, key) => {
    let apiKey = key;

    if (!apiKey) {
      const response = await inquirer.prompt([
        {
          type: 'password',
          name: 'apiKey',
          message: `Enter API key for ${provider}:`,
          mask: '*',
        },
      ]);
      apiKey = response.apiKey;
    }

    if (!apiKey) {
      console.error(chalk.red('\nError: API key is required.\n'));
      process.exit(1);
    }

    setGlobalKey(provider, apiKey);
    console.log(chalk.green(`\n✅ Global API key for ${provider} saved successfully!\n`));
  });

program
  .command('delete-key')
  .description('Remove a global API key for a provider')
  .argument('<provider>', 'AI provider (openai, gemini)')
  .action((provider) => {
    deleteGlobalKey(provider);
    console.log(chalk.yellow(`\n✅ Global API key for ${provider} removed.\n`));
  });

program
  .command('status')
  .description('Check the status of global configurations and API keys')
  .action(() => {
    const keys = listGlobalKeys();
    const providers = ['openai', 'gemini'];

    console.log(chalk.bold.magenta('\n📊 self-commit Status\n'));
    providers.forEach((p) => {
      const isSet = keys.includes(p);
      const icon = isSet ? chalk.green('✅ Set') : chalk.red('❌ Not set');
      console.log(`${chalk.bold(p.padEnd(10))}: ${icon}`);
    });
    console.log('');
  });

program.parse();
