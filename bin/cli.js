#!/usr/bin/env node

import { Command } from 'commander';
import { main } from '../src/index.js';

const program = new Command();

program
  .name('self-commit')
  .description('The agnostic copywriting assistant for structured git commits')
  .version('0.1.0')
  .option('-d, --dry-run', 'preview the commit message without applying it')
  .action(async (options) => {
    try {
      await main(options);
    } catch (error) {
      console.error(`\nError: ${error.message}`);
      process.exit(1);
    }
  });

program.parse();
